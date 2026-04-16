/**
 * shell
 * CS 341 - Spring 2025
 */
#include "format.h"
#include "shell.h"
#include "vector.h"
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <string.h>
#include <limits.h>
#include <signal.h>
#include <sys/wait.h>
#include <time.h>
#include <sys/sysinfo.h>

void execute(char *line, size_t starting_size);
int external_command(char *line, size_t starting_size, int options, vector *background);
int general_command(char *line, size_t starting_size, vector *background, char **argv);
int change_directory(char *line);
void cleanup(vector *background);
void kill_all(vector *background);
void process_inf(vector *background, char *arg);
void process_in(pid_t pid, long btime, long clk_tck, char *name);
void get_command(pid_t pid, char *cmdline);

typedef struct process
{
    char *command;
    pid_t pid;
} process;

int shell(int argc, char *argv[])
{
    // TODO: This is the entry point for your shell.
    int opt;
    FILE *history_file = NULL;
    FILE *input = stdin;
    char *line = NULL;
    size_t len = 0;
    size_t starting_size = 4;
    ssize_t read;
    char cwd[PATH_MAX];
    char *logic;
    vector *background = int_vector_create();
    vector *history = string_vector_create();
    signal(SIGINT, SIG_IGN);

    while ((opt = getopt(argc, argv, "h:f:")) != -1)
    {
        if (opt == 'h')
        {
            history_file = fopen(optarg, "a+");
            if (history_file == NULL)
            {
                print_history_file_error();
                exit(1);
            }
            rewind(history_file);
            while ((read = getline(&line, &len, history_file)) != -1)
            {
                vector_push_back(history, line);
            }
        }
        else if (opt == 'f')
        {
            input = fopen(optarg, "r");
            if (input == NULL)
            {
                print_script_file_error();
                exit(1);
            }
        }
        else if (opt == '?')
        {
            print_usage();
            exit(1);
        }
    }
    print_prompt(getcwd(cwd, sizeof(cwd)), getpid());
    while ((read = getline(&line, &len, input)) != -1)
    {
        cleanup(background);
        line[strlen(line) - 1] = '\0';
        if (input != stdin)
        {
            print_command(line);
        }
        if (!strcmp(line, "exit"))
        {
            break;
        }
        if (!strcmp(line, "!history"))
        {
            size_t history_size = vector_size(history);
            for (size_t i = 0; i < history_size; i++)
            {
                print_history_line(i, (char *)vector_get(history, i));
            }
            print_prompt(getcwd(cwd, sizeof(cwd)), getpid());
            continue;
        }
        if (line[0] == '#')
        {
            size_t index = atoi(line + 1);
            if (index >= vector_size(history))
            {
                print_invalid_index();
                print_prompt(getcwd(cwd, sizeof(cwd)), getpid());
                continue;
            }
            line = strdup(vector_get(history, index));
            print_command(line);
        }
        if (line[0] == '!')
        {
            int match_flag = 0;
            size_t history_size = vector_size(history);
            if (history_size == 0)
            {
                print_no_history_match();
                print_prompt(getcwd(cwd, sizeof(cwd)), getpid());
                continue;
            }
            size_t prefix_length = strlen(line) - 1;
            for (size_t i = history_size; i-- > 0;)
            {
                if (strncmp(line + 1, vector_get(history, i), prefix_length) == 0)
                {
                    line = strdup(vector_get(history, i));
                    print_command(line);
                    match_flag = 1;
                    break;
                }
            }
            if (!match_flag)
            {
                print_no_history_match();
                print_prompt(getcwd(cwd, sizeof(cwd)), getpid());
                continue;
            }
        }
        vector_push_back(history, line);
        if (history_file != NULL)
        {
            fprintf(history_file, "%s\n", line);
        }
        if ((logic = strstr(line, "&&")) != NULL)
        {
            *(logic - 1) = 0;
            if (!general_command(line, starting_size, background, argv))
            {
                general_command(logic + 3, starting_size, background, argv);
            }
        }
        else if ((logic = strstr(line, "||")) != NULL)
        {
            *(logic - 1) = 0;
            if (general_command(line, starting_size, background, argv))
            {
                general_command(logic + 3, starting_size, background, argv);
            }
        }
        else if ((logic = strchr(line, ';')) != NULL)
        {
            *(logic) = 0;
            general_command(line, starting_size, background, argv);
            general_command(logic + 2, starting_size, background, argv);
        }
        else if (line[strlen(line) - 1] == '&')
        {
            line[strlen(line) - 1] = 0;
            external_command(line, starting_size, WNOHANG, background);
        }
        else
        {
            general_command(line, starting_size, background, argv);
        }
        print_prompt(getcwd(cwd, sizeof(cwd)), getpid());
    }
    kill_all(background);
    vector_destroy(history);
    vector_destroy(background);
    if (history_file != NULL)
    {
        fclose(history_file);
    }
    free(line);
    return 0;
}

int change_directory(char *line)
{
    char cwd[PATH_MAX];
    if (line[3] != '/')
    {
        line[2] = '/';
        getcwd(cwd, sizeof(cwd)), getpid();
        strncat(cwd, line + 2, PATH_MAX - strlen(cwd) - 1);
    }
    else
    {
        snprintf(cwd, sizeof(cwd), "%s", line + 3);
    }
    if (chdir(cwd) != 0)
    {
        print_no_directory(cwd);
        return 1;
    }
    return 0;
}

void execute(char *line, size_t starting_size)
{
    signal(SIGINT, SIG_DFL);
    char **tokens = malloc(starting_size * sizeof(char *));
    size_t current_capacity = starting_size;
    size_t current_size = 0;
    char *temp = strdup(line);
    char *token = strtok(temp, " ");
    while (token != NULL)
    {
        if (current_size == current_capacity - 1)
        {
            tokens = realloc(tokens, current_capacity * 2 * sizeof(char *));
            current_capacity = current_capacity * 2;
        }
        tokens[current_size] = token;
        current_size++;
        token = strtok(NULL, " ");
    }
    tokens[current_size] = NULL;
    execvp(tokens[0], tokens);
    free(temp);
    free(tokens);
    exit(1);
}

int external_command(char *line, size_t starting_size, int options, vector *background)
{
    fflush(stdout);
    int pid = fork();
    if (pid < 0)
    {
        print_fork_failed();
        return 1;
    }
    else if (pid == 0)
    {
        char *files;
        if ((files = strstr(line, ">>")) != NULL)
        {
            *(files - 1) = 0;
            FILE *app = fopen(files + 3, "a");
            int fd = fileno(app);
            dup2(fd, STDOUT_FILENO);
        }
        else if ((files = strchr(line, '>')) != NULL)
        {
            *(files - 1) = 0;
            FILE *app = fopen(files + 2, "w");
            int fd = fileno(app);
            dup2(fd, STDOUT_FILENO);
        }
        else if ((files = strchr(line, '<')) != NULL)
        {
            *(files - 1) = 0;
            freopen(files + 2, "r", stdin);
        }
        if (options)
        {
            setpgid(0, 0);
        }
        execute(line, starting_size);
    }
    else
    {
        int status;
        print_command_executed(pid);
        pid_t result = waitpid(pid, &status, options);
        if (WIFEXITED(status) && WEXITSTATUS(status) == 1)
        {
            print_exec_failed(line);
            return 1;
        }
        if (!result && options)
        {
            vector_push_back(background, &pid);
        }
    }
    return 0;
}

int general_command(char *line, size_t starting_size, vector *background, char **argv)
{
    if (!strncmp(line, "cd ", 3))
    {
        return change_directory(line);
    }
    else if (!strncmp(line, "ps", 2))
    {
        process_inf(background, argv[0]);
        return 0;
    }
    else if (!strncmp(line, "kill", 4))
    {
        pid_t pid;
        if (sscanf(line, "kill %d", &pid) == 1)
        {
            char cmdline[1024];
            get_command(pid, cmdline);
            if (kill(pid, SIGKILL) == 0)
            {
                print_killed_process(pid, cmdline);
            }
            else
            {
                print_no_process_found(pid);
            }
        }
        else
        {
            print_invalid_command(line);
        }
        return 0;
    }
    else if (!strncmp(line, "stop", 4))
    {
        pid_t pid;
        if (sscanf(line, "stop %d", &pid) == 1)
        {
            char cmdline[1024];
            get_command(pid, cmdline);
            if (kill(pid, SIGSTOP) == 0)
            {
                print_stopped_process(pid, cmdline);
            }
            else
            {
                print_no_process_found(pid);
            }
        }
        else
        {
            print_invalid_command(line);
        }
        return 0;
    }
    else if (!strncmp(line, "cont", 4))
    {
        pid_t pid;
        if (sscanf(line, "cont %d", &pid) == 1)
        {
            char cmdline[1024];
            get_command(pid, cmdline);
            if (kill(pid, SIGCONT) == 0)
            {
                print_continued_process(pid, cmdline);
            }
            else
            {
                print_no_process_found(pid);
            }
        }
        else
        {
            print_invalid_command(line);
        }
        return 0;
    }
    return external_command(line, starting_size, 0, NULL);
}

void cleanup(vector *background)
{
    size_t size = vector_size(background);
    int status;
    for (size_t i = 0; i < size; i++)
    {
        int pid = *(int *)vector_get(background, i);
        pid_t result = waitpid(pid, &status, WNOHANG);
        if (result != 0)
        {
            vector_erase(background, i);
            i--;
            size--;
        }
    }
}

void kill_all(vector *background)
{
    size_t size = vector_size(background);
    for (size_t i = 0; i < size; i++)
    {
        int pid = *(int *)vector_get(background, i);
        kill(pid, SIGKILL);
    }
}

void process_inf(vector *background, char *arg)
{
    long clk_tck = sysconf(_SC_CLK_TCK);
    print_process_info_header();
    struct sysinfo sys_info;
    sysinfo(&sys_info);
    long btime = time(NULL) - sys_info.uptime;
    size_t size = vector_size(background);
    for (size_t i = 0; i < size; i++)
    {
        pid_t pid = *(pid_t *)vector_get(background, i);
        process_in(pid, btime, clk_tck, NULL);
    }
    process_in(getpid(), btime, clk_tck, arg);
}

void process_in(pid_t pid, long btime, long clk_tck, char *name)
{
    long utime, stime, start_time, total_time, nthreads;
    unsigned long int vsize;
    char state;
    int mins, secs;
    char cmdline[1024];
    if (name == NULL)
    {
        get_command(pid, cmdline);
        name = cmdline;
    }
    char statpath[64];
    sprintf(statpath, "/proc/%d/stat", pid);
    FILE *stat = fopen(statpath, "r");
    if (!stat)
    {
        return;
    }
    fscanf(stat, "%*s %*s %c", &state);
    for (int j = 0; j < 10; j++)
    {
        fscanf(stat, "%*s");
    }
    fscanf(stat, "%ld %ld", &utime, &stime);
    for (int j = 0; j < 4; j++)
    {
        fscanf(stat, "%*s");
    }
    fscanf(stat, "%ld %*s %ld %ld", &nthreads, &start_time, &vsize);
    vsize /= 1024;
    start_time = start_time / clk_tck + btime;
    long hours_start = (start_time % (24 * 3600)) / 3600;
    long mins_start = (start_time % 3600) / 60;
    total_time = (utime + stime) / clk_tck;
    secs = total_time % 60;
    mins = total_time / 60;
    char time_running[20];
    char time_started[20];
    sprintf(time_started, "%02ld:%02ld", hours_start, mins_start);
    sprintf(time_running, "%d:%02d", mins, secs);
    process_info pi = {pid, nthreads, vsize, state, time_started, time_running, name};
    print_process_info(&pi);
}

void get_command(pid_t pid, char *cmdline)
{
    char cmdpath[64];
    sprintf(cmdpath, "/proc/%d/cmdline", pid);
    FILE *cmd = fopen(cmdpath, "r");
    if (!cmd)
    {
        return;
    }
    size_t bytes_read = fread(cmdline, 1, 1023, cmd);
    fclose(cmd);
    if (bytes_read > 0)
    {
        cmdline[bytes_read] = '\0';
        for (size_t j = 0; j < bytes_read; j++)
        {
            if (cmdline[j] == '\0')
            {
                cmdline[j] = ' ';
            }
        }
    }
}