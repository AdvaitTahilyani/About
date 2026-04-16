'use client'

import { FormEvent, KeyboardEvent, useEffect, useMemo, useRef, useState } from 'react'
import { RotateCcw, Terminal } from 'lucide-react'

type FsFile = {
  type: 'file'
  content: string
}

type FsDirectory = {
  type: 'dir'
  children: Record<string, FsNode>
}

type FsNode = FsFile | FsDirectory

type ShellLine = {
  kind: 'input' | 'output' | 'error' | 'system'
  text: string
}

type CommandResult = {
  code: number
  output: string[]
  clear?: boolean
}

type Redirect = {
  target: string
  append: boolean
}

const STORAGE_KEY = 'advait-toy-shell-fs'
const MAX_FILE_BYTES = 12_000
const MAX_FILES = 80

const FORTUNES = [
  'There are only two hard things in CS: cache invalidation and naming things.',
  'A monad is just a monoid in the category of endofunctors, what\'s the problem?',
  'It works on my machine. -- Every developer, ever',
  'The best code is no code at all.',
  'Weeks of coding can save you hours of planning.',
  '// TODO: fix this later  (committed 3 years ago)',
  'There are 10 types of people: those who understand binary and those who don\'t.',
  'Software being "done" is like a lawn being "mowed".',
  'First, solve the problem. Then, write the code. -- John Johnson',
  'Any sufficiently advanced bug is indistinguishable from a feature.',
  'If debugging is the process of removing bugs, then programming must be the process of putting them in.',
]

const COW = (text: string) => {
  const border = '-'.repeat(text.length + 2)
  return [
    ` ${border}`,
    `< ${text} >`,
    ` ${border}`,
    '        \\   ^__^',
    '         \\  (oo)\\_______',
    '            (__)\\       )\\/\\',
    '                ||----w |',
    '                ||     ||',
  ]
}

const NEOFETCH = [
  '        .--.         advait@browser-sandbox',
  '       |o_o |        -----------------------',
  '       |:_/ |        OS: BrowserOS (sandboxed)',
  '      //   \\ \\       Shell: toy-shell v3.41',
  '     (|     | )      Origin: CS 341 @ UIUC',
  '    /\'\\_   _/`\\      Language: C → TypeScript',
  '    \\___)=(___/       Uptime: since you opened this tab',
  '                      FS: virtual (localStorage)',
  '                      Theme: terminal-dark',
]

const starterFs = (): FsDirectory => ({
  type: 'dir',
  children: {
    home: {
      type: 'dir',
      children: {
        advait: {
          type: 'dir',
          children: {
            'README.md': {
              type: 'file',
              content:
                'Toy shell ported from a CS 341 (Systems Programming) assignment.\nWritten in C, then reimplemented in TypeScript for the browser.\n\nThe original supported: history, cd, logical operators (&&, ||, ;),\nI/O redirection (>, >>), and signal handling.\n\nThis version keeps the interaction model but runs on a virtual filesystem.\nTry: ls -la, cat README.md, tree, or just explore.\n',
            },
            '.secret': {
              type: 'file',
              content: 'You found a hidden file! Try: cowsay, fortune, or neofetch.\nThere might be more secrets buried in the filesystem...\n',
            },
            '.bash_history': {
              type: 'file',
              content: 'gcc -o shell shell.c\n./shell\nvalgrind --leak-check=full ./shell\nmake clean && make\ngit add -A && git commit -m "fix memory leak in history"\n',
            },
            projects: {
              type: 'dir',
              children: {
                'snake.vm': {
                  type: 'file',
                  content: 'push constant 0\ncall SnakeGame.new 0\n',
                },
                'shell-notes.txt': {
                  type: 'file',
                  content:
                    'The original C shell supported history, cd, redirection, logical operators, and process commands.\nThis page keeps the interaction model but runs entirely inside a virtual filesystem.\n',
                },
                '.easter-egg': {
                  type: 'file',
                  content: 'Congrats, you found all the hidden files.\nHere\'s a secret command: try typing "matrix"\n',
                },
              },
            },
            tmp: {
              type: 'dir',
              children: {},
            },
            etc: {
              type: 'dir',
              children: {
                'passwd': {
                  type: 'file',
                  content: 'root:x:0:0:root:/root:/bin/bash\nadvait:x:1000:1000:Advait Tahilyani:/home/advait:/bin/toy-shell\nnobody:x:65534:65534:nobody:/nonexistent:/usr/sbin/nologin\n',
                },
                'motd': {
                  type: 'file',
                  content: 'Welcome to the sandbox. Nothing you do here can break anything real.\nBut that doesn\'t mean there isn\'t anything to find.\n',
                },
              },
            },
          },
        },
      },
    },
  },
})

const cloneFs = (root: FsDirectory): FsDirectory => JSON.parse(JSON.stringify(root))

const isDirectory = (node: FsNode | undefined): node is FsDirectory => node?.type === 'dir'
const isFile = (node: FsNode | undefined): node is FsFile => node?.type === 'file'

const normalizePath = (cwd: string, input = '.') => {
  const parts = input.startsWith('/') ? [] : cwd.split('/').filter(Boolean)

  input.split('/').forEach((part) => {
    if (!part || part === '.') {
      return
    }

    if (part === '..') {
      parts.pop()
      return
    }

    parts.push(part)
  })

  return `/${parts.join('/')}`
}

const splitPath = (path: string) => path.split('/').filter(Boolean)

const getNode = (root: FsDirectory, path: string) => {
  let node: FsNode = root

  for (const part of splitPath(path)) {
    if (!isDirectory(node)) {
      return undefined
    }
    node = node.children[part]
    if (!node) {
      return undefined
    }
  }

  return node
}

const getParent = (root: FsDirectory, path: string) => {
  const parts = splitPath(path)
  const name = parts.pop()
  const parent = getNode(root, `/${parts.join('/')}`)

  if (!name || !isDirectory(parent)) {
    return null
  }

  return { parent, name }
}

const countFiles = (node: FsNode): number => {
  if (isFile(node)) {
    return 1
  }

  return Object.values(node.children).reduce((total, child) => total + countFiles(child), 0)
}

const tokenize = (line: string) => {
  const tokens: string[] = []
  let current = ''
  let quote: '"' | "'" | null = null

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index]

    if (quote) {
      if (char === quote) {
        quote = null
      } else {
        current += char
      }
      continue
    }

    if (char === '"' || char === "'") {
      quote = char
      continue
    }

    if (char === ' ' || char === '\t') {
      if (current) {
        tokens.push(current)
        current = ''
      }
      continue
    }

    current += char
  }

  if (current) {
    tokens.push(current)
  }

  return tokens
}

const splitSegments = (line: string) => {
  const segments: Array<{ op: ';' | '&&' | '||' | null; command: string }> = []
  let current = ''
  let quote: '"' | "'" | null = null
  let op: ';' | '&&' | '||' | null = null

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index]
    const pair = line.slice(index, index + 2)

    if (quote) {
      if (char === quote) {
        quote = null
      }
      current += char
      continue
    }

    if (char === '"' || char === "'") {
      quote = char
      current += char
      continue
    }

    if (pair === '&&' || pair === '||') {
      if (current.trim()) {
        segments.push({ op, command: current.trim() })
      }
      op = pair
      current = ''
      index += 1
      continue
    }

    if (char === ';') {
      if (current.trim()) {
        segments.push({ op, command: current.trim() })
      }
      op = ';'
      current = ''
      continue
    }

    current += char
  }

  if (current.trim()) {
    segments.push({ op, command: current.trim() })
  }

  return segments
}

const formatPath = (path: string) => (path === '/home/advait' ? '~' : path.replace('/home/advait', '~'))

const writeFile = (root: FsDirectory, cwd: string, target: string, content: string, append: boolean) => {
  if (content.length > MAX_FILE_BYTES) {
    return `file too large: max ${MAX_FILE_BYTES} bytes`
  }

  const path = normalizePath(cwd, target)
  const destination = getParent(root, path)

  if (!destination) {
    return 'cannot write root'
  }

  const existing = destination.parent.children[destination.name]
  if (isDirectory(existing)) {
    return `${target}: is a directory`
  }

  if (!existing && countFiles(root) >= MAX_FILES) {
    return `filesystem limit reached: max ${MAX_FILES} files`
  }

  destination.parent.children[destination.name] = {
    type: 'file',
    content: append && isFile(existing) ? `${existing.content}${content}` : content,
  }

  return null
}

const SHELL_BREAK_COMMANDS = new Set([
  'bash', 'sh', 'zsh', 'fish', 'csh', 'ksh', 'dash',
  '/bin/bash', '/bin/sh', '/bin/zsh', '/usr/bin/env',
  'exec', 'fork', 'execvp', 'system',
])

const NETWORK_COMMANDS = new Set([
  'curl', 'wget', 'ssh', 'scp', 'rsync', 'nc', 'netcat',
  'telnet', 'ftp', 'sftp', 'ping', 'traceroute', 'dig', 'nslookup',
])

const EDITOR_COMMANDS = new Set(['vim', 'vi', 'nano', 'emacs', 'ed', 'code', 'nvim'])

const COMPILER_COMMANDS = new Set(['gcc', 'g++', 'clang', 'make', 'cmake', 'cargo', 'rustc', 'javac', 'go'])

const INTERPRETER_COMMANDS = new Set(['python', 'python3', 'node', 'ruby', 'perl', 'lua', 'php'])

const PKG_COMMANDS = new Set(['apt', 'apt-get', 'brew', 'pacman', 'yum', 'dnf', 'npm', 'pip', 'pip3'])

export default function ToyShellDemo() {
  const [root, setRoot] = useState<FsDirectory>(() => starterFs())
  const [cwd, setCwd] = useState('/home/advait')
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState<number | null>(null)
  const [lines, setLines] = useState<ShellLine[]>([
    { kind: 'system', text: 'CS 341 shell — browser sandbox' },
    { kind: 'system', text: 'Type help for commands. Explore freely.' },
  ])
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (!saved) {
      return
    }

    try {
      const parsed = JSON.parse(saved) as FsDirectory
      if (parsed.type === 'dir') {
        setRoot(parsed)
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEY)
    }
  }, [])

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(root))
  }, [root])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
  }, [lines])

  const sourceUrl = '/demos/toy-shell/src/shell.c'

  const commands = useMemo(
    () => [
      ['help', 'show commands'],
      ['pwd', 'print working directory'],
      ['ls [-la] [path]', 'list files (try -a for hidden files)'],
      ['cd [path]', 'change directory'],
      ['mkdir <path>', 'create directories'],
      ['touch <file>', 'create or update files'],
      ['cat <file>', 'read files'],
      ['echo text [> file]', 'print or redirect text'],
      ['write <file> <text>', 'overwrite a file'],
      ['rm [-r] <path>', 'delete files or directories'],
      ['rmdir <path>', 'delete empty directories'],
      ['tree [path]', 'draw the filesystem tree'],
      ['history, #n, !prefix', 'replay commands (like the C version)'],
      ['clear, reset', 'clear screen or restore filesystem'],
    ],
    []
  )

  const runCommand = (rawCommand: string, fs: FsDirectory, currentCwd: string): { result: CommandResult; cwd: string } => {
    let command = rawCommand.trim()

    // Detect fork bomb pattern
    if (command.includes(':(){ :|:&') || command.includes(':(){') || (command.includes('|') && command.includes('&') && command.split('|').length > 2)) {
      return {
        result: { code: 1, output: ['Nice try with the fork bomb! This sandbox has exactly one process and intends to keep it that way.'] },
        cwd: currentCwd,
      }
    }

    // Detect pipe attempts
    if (command.includes('|') && !command.includes('||')) {
      return {
        result: { code: 1, output: ['Pipes aren\'t wired up in the sandbox. The original C version didn\'t have them either — that was the next assignment.'] },
        cwd: currentCwd,
      }
    }

    let redirect: Redirect | null = null
    const appendIndex = command.lastIndexOf('>>')
    const writeIndex = command.lastIndexOf('>')

    if (appendIndex >= 0) {
      redirect = { target: command.slice(appendIndex + 2).trim(), append: true }
      command = command.slice(0, appendIndex).trim()
    } else if (writeIndex >= 0) {
      redirect = { target: command.slice(writeIndex + 1).trim(), append: false }
      command = command.slice(0, writeIndex).trim()
    }

    const tokens = tokenize(command)
    const [name, ...args] = tokens

    if (!name) {
      return { result: { code: 0, output: [] }, cwd: currentCwd }
    }

    let result: CommandResult
    let nextCwd = currentCwd

    // Easter egg: sudo anything
    if (name === 'sudo' || name === 'su') {
      result = { code: 126, output: ['Great try, but I can\'t really let you do that.'] }
    }
    // Shell break attempts
    else if (SHELL_BREAK_COMMANDS.has(name)) {
      result = { code: 126, output: ['Great try, but I can\'t really let you do that. This sandbox is escape-proof.'] }
    }
    // Network commands
    else if (NETWORK_COMMANDS.has(name)) {
      if (name === 'ping') {
        result = { code: 0, output: ['pong'] }
      } else {
        result = { code: 126, output: [`${name}: no network stack in the sandbox. This terminal is fully offline.`] }
      }
    }
    // Editors
    else if (EDITOR_COMMANDS.has(name)) {
      const jokes: Record<string, string> = {
        vim: 'You\'d never leave. Use "write <file> <text>" instead.',
        vi: 'You\'d never leave. Use "write <file> <text>" instead.',
        nvim: 'You\'d never leave. Use "write <file> <text>" instead.',
        emacs: 'This terminal isn\'t ready for an operating system inside an operating system.',
        nano: 'No editor here. Use "write <file> <text>" or "echo text > file".',
        ed: 'ed is the standard editor. But not here.',
        code: 'You\'re already in a code editor looking at this.',
      }
      result = { code: 126, output: [jokes[name] ?? `${name}: not available in sandbox`] }
    }
    // Compilers
    else if (COMPILER_COMMANDS.has(name)) {
      result = { code: 126, output: [`${name}: no compiler toolchain in the sandbox. The original shell.c was compiled on EWS though.`] }
    }
    // Interpreters
    else if (INTERPRETER_COMMANDS.has(name)) {
      result = { code: 126, output: [`${name}: no interpreter available. This sandbox only speaks shell.`] }
    }
    // Package managers
    else if (PKG_COMMANDS.has(name)) {
      result = { code: 126, output: [`${name}: can't install packages in a browser sandbox. Nice thought though.`] }
    }
    else {
      switch (name) {
        case 'help':
          result = {
            code: 0,
            output: [
              'Commands:',
              ...commands.map(([usage, description]) => `  ${usage.padEnd(26)} ${description}`),
              '',
              'Operators: ;  &&  ||       chain commands',
              'Redirect:  >  >>           write output to files',
              '',
              'Hint: hidden files start with a dot. Try ls -a',
            ],
          }
          break
        case 'pwd':
          result = { code: 0, output: [currentCwd] }
          break
        case 'ls': {
          const flags = args.filter((arg) => arg.startsWith('-')).join('')
          const showHidden = flags.includes('a')
          const longFormat = flags.includes('l')
          const targetArg = args.find((arg) => !arg.startsWith('-')) ?? '.'
          const path = normalizePath(currentCwd, targetArg)
          const node = getNode(fs, path)

          if (!node) {
            result = { code: 1, output: [`ls: ${targetArg}: no such file or directory`] }
            break
          }

          if (isFile(node)) {
            result = { code: 0, output: [path.split('/').pop() ?? path] }
            break
          }

          const names = Object.entries(node.children)
            .filter(([entryName]) => showHidden || !entryName.startsWith('.'))
            .sort(([left], [right]) => left.localeCompare(right))

          result = {
            code: 0,
            output: longFormat
              ? names.map(([entryName, child]) => `${child.type === 'dir' ? 'd' : '-'}rw-r--r--  ${entryName}`)
              : [names.map(([entryName]) => entryName).join('  ') || '(empty)'],
          }
          break
        }
        case 'cd': {
          const path = normalizePath(currentCwd, args[0] ?? '/home/advait')
          const node = getNode(fs, path)

          if (!isDirectory(node)) {
            result = { code: 1, output: [`cd: ${args[0] ?? path}: no such directory`] }
          } else {
            nextCwd = path
            result = { code: 0, output: [] }
          }
          break
        }
        case 'mkdir': {
          if (!args.length) {
            result = { code: 1, output: ['mkdir: missing operand'] }
            break
          }

          const errors: string[] = []
          args.forEach((arg) => {
            const path = normalizePath(currentCwd, arg)
            const destination = getParent(fs, path)

            if (!destination) {
              errors.push(`mkdir: ${arg}: invalid path`)
            } else if (destination.parent.children[destination.name]) {
              errors.push(`mkdir: ${arg}: file exists`)
            } else {
              destination.parent.children[destination.name] = { type: 'dir', children: {} }
            }
          })
          result = { code: errors.length ? 1 : 0, output: errors }
          break
        }
        case 'touch': {
          if (!args.length) {
            result = { code: 1, output: ['touch: missing file operand'] }
            break
          }

          const errors = args.flatMap((arg) => {
            const error = writeFile(fs, currentCwd, arg, getNode(fs, normalizePath(currentCwd, arg))?.type === 'file' ? (getNode(fs, normalizePath(currentCwd, arg)) as FsFile).content : '', false)
            return error ? [`touch: ${error}`] : []
          })
          result = { code: errors.length ? 1 : 0, output: errors }
          break
        }
        case 'cat': {
          if (!args.length) {
            result = { code: 1, output: ['cat: missing file operand'] }
            break
          }

          const output: string[] = []
          let code = 0
          args.forEach((arg) => {
            const node = getNode(fs, normalizePath(currentCwd, arg))
            if (!node) {
              output.push(`cat: ${arg}: no such file`)
              code = 1
            } else if (isDirectory(node)) {
              output.push(`cat: ${arg}: is a directory`)
              code = 1
            } else {
              output.push(...node.content.replace(/\n$/, '').split('\n'))
            }
          })
          result = { code, output }
          break
        }
        case 'echo':
          result = { code: 0, output: [args.join(' ')] }
          break
        case 'write': {
          const [target, ...text] = args
          if (!target) {
            result = { code: 1, output: ['write: missing file operand'] }
            break
          }

          const error = writeFile(fs, currentCwd, target, `${text.join(' ')}\n`, false)
          result = error ? { code: 1, output: [`write: ${error}`] } : { code: 0, output: [] }
          break
        }
        case 'rm': {
          const recursive = args.includes('-r') || args.includes('-rf') || args.includes('-fr')
          const targets = args.filter((arg) => !arg.startsWith('-'))
          if (!targets.length) {
            result = { code: 1, output: ['rm: missing operand'] }
            break
          }

          // Special: rm -rf /
          if (recursive && targets.includes('/')) {
            result = { code: 1, output: [
              'rm: refusing to nuke the sandbox root.',
              'The virtual filesystem would survive anyway — it\'s rebuilt on reset.',
              '(But nice instinct.)',
            ]}
            break
          }

          const output: string[] = []
          let code = 0
          targets.forEach((target) => {
            const path = normalizePath(currentCwd, target)
            if (path === '/') {
              output.push('rm: refusing to remove sandbox root')
              code = 1
              return
            }

            const destination = getParent(fs, path)
            const node = destination?.parent.children[destination.name]

            if (!destination || !node) {
              output.push(`rm: ${target}: no such file or directory`)
              code = 1
            } else if (isDirectory(node) && !recursive) {
              output.push(`rm: ${target}: is a directory`)
              code = 1
            } else {
              delete destination.parent.children[destination.name]
            }
          })
          result = { code, output }
          break
        }
        case 'rmdir': {
          if (!args.length) {
            result = { code: 1, output: ['rmdir: missing operand'] }
            break
          }

          const output: string[] = []
          let code = 0
          args.forEach((target) => {
            const path = normalizePath(currentCwd, target)
            const destination = getParent(fs, path)
            const node = destination?.parent.children[destination.name]

            if (!destination || !node) {
              output.push(`rmdir: ${target}: no such directory`)
              code = 1
            } else if (!isDirectory(node)) {
              output.push(`rmdir: ${target}: not a directory`)
              code = 1
            } else if (Object.keys(node.children).length) {
              output.push(`rmdir: ${target}: directory not empty`)
              code = 1
            } else {
              delete destination.parent.children[destination.name]
            }
          })
          result = { code, output }
          break
        }
        case 'tree': {
          const path = normalizePath(currentCwd, args[0] ?? '.')
          const node = getNode(fs, path)
          if (!node) {
            result = { code: 1, output: [`tree: ${args[0] ?? path}: no such file or directory`] }
            break
          }

          const output: string[] = [formatPath(path)]
          const walk = (treeNode: FsNode, prefix: string) => {
            if (!isDirectory(treeNode)) {
              return
            }

            Object.entries(treeNode.children)
              .sort(([left], [right]) => left.localeCompare(right))
              .forEach(([entryName, child], index, entries) => {
                const isLast = index === entries.length - 1
                output.push(`${prefix}${isLast ? '└── ' : '├── '}${entryName}`)
                walk(child, `${prefix}${isLast ? '    ' : '│   '}`)
              })
          }
          walk(node, '')
          result = { code: 0, output }
          break
        }
        case 'history':
        case '!history':
          result = { code: 0, output: history.map((entry, index) => `${String(index).padStart(3)}  ${entry}`) }
          break
        case 'clear':
          result = { code: 0, output: [], clear: true }
          break
        case 'reset':
          Object.assign(fs, starterFs())
          nextCwd = '/home/advait'
          result = { code: 0, output: ['Sandbox filesystem restored to initial state.'] }
          break

        // --- Easter egg commands ---
        case 'whoami':
          result = { code: 0, output: ['advait (or whoever you are — I can\'t actually tell)'] }
          break
        case 'hostname':
          result = { code: 0, output: ['browser-sandbox.local'] }
          break
        case 'uname':
          if (args.includes('-a')) {
            result = { code: 0, output: ['BrowserOS browser-sandbox 6.341.0-cs341 #1 SMP PREEMPT_DYNAMIC TypeScript x86_64'] }
          } else {
            result = { code: 0, output: ['BrowserOS'] }
          }
          break
        case 'date':
          result = { code: 0, output: [new Date().toString()] }
          break
        case 'uptime':
          result = { code: 0, output: ['up since you opened this tab, 1 user, load average: 0.00, 0.00, 0.00'] }
          break
        case 'neofetch':
        case 'screenfetch':
          result = { code: 0, output: NEOFETCH }
          break
        case 'cowsay':
          result = { code: 0, output: COW(args.join(' ') || 'moo') }
          break
        case 'fortune':
          result = { code: 0, output: [FORTUNES[Math.floor(Math.random() * FORTUNES.length)]] }
          break
        case 'sl':
          result = { code: 0, output: [
            '      ====        ________',
            '  _D _|  |_______/        \\__I_I_____===__|_________',
            '   |(_)---  |   H\\________/ |   |        =|___ ___|',
            '   /     |  |   H  |  |     |   |         ||_| |_||',
            '  |      |  |   H  |__--------------------| [___] |',
            '  | ________|___H__/__|_____/[][]~\\_______|       |',
            '  |/ |   |-----------I_____I [][] []  D   |=======|_',
            '',
            'You meant "ls", didn\'t you?',
          ]}
          break
        case 'matrix':
          result = { code: 0, output: [
            '01001000 01100101 01101100 01101100 01101111',
            '01010111 01101111 01110010 01101100 01100100',
            '',
            'Decoded: Hello World',
            'You found the hidden command! There might be more...',
          ]}
          break
        case 'hack':
        case 'hackerman':
          result = { code: 0, output: [
            'ACCESSING MAINFRAME...',
            '████████████████████ 100%',
            'ACCESS GRANTED.',
            '',
            'Just kidding. This is a sandboxed virtual filesystem.',
          ]}
          break
        case 'ps':
          result = {
            code: 0,
            output: ['PID   NLWP  VSZ    STAT  START  TIME  COMMAND', '341   1     64K    R     now    0:00  browser-shell'],
          }
          break
        case 'top':
        case 'htop':
          result = { code: 0, output: [
            'Tasks: 1 total, 1 running',
            '%CPU: 0.0  %MEM: minimal',
            '',
            '  PID  COMMAND          %CPU  %MEM',
            '  341  browser-shell    0.0   ~0',
            '',
            '(there\'s only one process and it\'s you)',
          ]}
          break
        case 'kill':
        case 'stop':
        case 'cont':
          result = { code: 126, output: ['Great try, but I can\'t really let you do that. There\'s only one process here, and killing it would be self-harm.'] }
          break
        case 'exit':
        case 'logout':
          result = { code: 0, output: ['Where would you even go? The tab is still open. But thanks for the sentiment.'] }
          break
        case 'man':
          if (args[0]) {
            result = { code: 0, output: [`No manual entry for ${args[0]}. Try "help" instead — it's shorter and we both save time.`] }
          } else {
            result = { code: 0, output: ['What manual page do you want? Try "help" for what\'s available here.'] }
          }
          break
        case 'which':
          if (args[0]) {
            result = { code: 0, output: [`/usr/bin/${args[0]}  (just kidding, everything runs inline)`] }
          } else {
            result = { code: 1, output: ['which: missing argument'] }
          }
          break
        case 'chmod':
        case 'chown':
        case 'chgrp':
          result = { code: 126, output: ['Permissions are purely decorative in this sandbox. You own everything here.'] }
          break
        case 'git':
          result = { code: 0, output: ['This sandbox has no version control, but the original shell.c certainly did. Many late-night commits.'] }
          break
        case 'lsof':
        case 'strace':
        case 'ltrace':
        case 'gdb':
        case 'valgrind':
          result = { code: 126, output: [`${name}: the original shell was debugged extensively with these tools. This browser version, not so much.`] }
          break
        case 'cat /dev/null':
        case '/dev/null':
          result = { code: 0, output: [] }
          break
        case 'xkcd':
          result = { code: 0, output: ['sudo make me a sandwich'] }
          break
        case 'hello':
        case 'hi':
        case 'hey':
          result = { code: 0, output: ['Hey! Try some commands — "help" lists what\'s available, or just explore.'] }
          break
        case '42':
          result = { code: 0, output: ['The answer to life, the universe, and everything. But what was the question?'] }
          break
        default:
          result = {
            code: 127,
            output: [`${name}: command not found. Try "help" to see what's available.`],
          }
      }
    }

    if (redirect) {
      if (!redirect.target) {
        return { result: { code: 1, output: ['redirect: missing target'] }, cwd: nextCwd }
      }

      const error = writeFile(fs, currentCwd, redirect.target, `${result.output.join('\n')}\n`, redirect.append)
      return {
        result: error ? { code: 1, output: [`redirect: ${error}`] } : { code: result.code, output: [] },
        cwd: nextCwd,
      }
    }

    return { result, cwd: nextCwd }
  }

  const expandHistory = (line: string) => {
    if (line.startsWith('#')) {
      const index = Number(line.slice(1))
      return Number.isInteger(index) && history[index] ? history[index] : null
    }

    if (line.startsWith('!') && line !== '!history') {
      const prefix = line.slice(1)
      return [...history].reverse().find((entry) => entry.startsWith(prefix)) ?? null
    }

    return line
  }

  const submitLine = (event?: FormEvent, rawOverride?: string) => {
    event?.preventDefault()
    const raw = (rawOverride ?? input).trim()

    if (!raw) {
      return
    }

    const expanded = expandHistory(raw)
    const baseLines: ShellLine[] = [{ kind: 'input', text: `${formatPath(cwd)} $ ${raw}` }]

    if (expanded === null) {
      setLines((previous) => [...previous, ...baseLines, { kind: 'error', text: 'no matching history entry' }])
      setInput('')
      return
    }

    if (expanded !== raw) {
      baseLines.push({ kind: 'system', text: expanded })
    }

    const workingFs = cloneFs(root)
    let workingCwd = cwd
    let lastCode = 0
    const outputLines: ShellLine[] = []

    splitSegments(expanded).forEach(({ op, command }) => {
      if (op === '&&' && lastCode !== 0) {
        return
      }

      if (op === '||' && lastCode === 0) {
        return
      }

      const { result, cwd: nextCwd } = runCommand(command, workingFs, workingCwd)
      workingCwd = nextCwd
      lastCode = result.code

      if (result.clear) {
        outputLines.length = 0
        baseLines.length = 0
      }

      result.output.forEach((text) => {
        outputLines.push({ kind: result.code === 0 ? 'output' : 'error', text })
      })
    })

    setHistory((previous) => [...previous, expanded])
    setRoot(workingFs)
    setCwd(workingCwd)
    setLines((previous) => [...previous, ...baseLines, ...outputLines])
    setInput('')
    setHistoryIndex(null)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      submitLine(undefined, event.currentTarget.value)
      return
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault()
      setHistoryIndex((previous) => {
        const next = previous === null ? history.length - 1 : Math.max(0, previous - 1)
        setInput(history[next] ?? input)
        return next
      })
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setHistoryIndex((previous) => {
        if (previous === null) {
          return null
        }

        const next = previous + 1
        if (next >= history.length) {
          setInput('')
          return null
        }

        setInput(history[next])
        return next
      })
    }
  }

  const trySuggestions = [
    { cmd: 'ls -la', hint: 'spot the hidden files' },
    { cmd: 'cat .secret', hint: 'read what you find' },
    { cmd: 'tree', hint: 'see the whole filesystem' },
    { cmd: 'neofetch', hint: 'system info' },
    { cmd: 'cowsay hello', hint: 'moo' },
    { cmd: 'sudo rm -rf /', hint: 'go ahead, try it' },
  ]

  return (
    <div className="mx-auto max-w-6xl">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.7fr)]">
        <section
          className="terminal-border overflow-hidden rounded-md bg-black text-white"
          onClick={() => inputRef.current?.focus()}
        >
          <div className="flex items-center justify-between border-b px-4 py-3" style={{ borderColor: 'var(--border-primary)' }}>
            <div className="flex items-center gap-2 text-sm opacity-60">
              <Terminal size={14} />
              toy-shell
            </div>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                setRoot(starterFs())
                setCwd('/home/advait')
                setLines([
                  { kind: 'system', text: 'Sandbox reset to initial state.' },
                  { kind: 'system', text: 'Type help for commands. Explore freely.' },
                ])
                setInput('')
                setHistory([])
                window.localStorage.removeItem(STORAGE_KEY)
              }}
              className="flex items-center gap-1.5 text-xs opacity-30 transition hover:opacity-80"
            >
              <RotateCcw size={12} />
              reset
            </button>
          </div>

          <div ref={scrollRef} className="h-[520px] overflow-auto px-4 py-4 text-sm leading-relaxed">
            {lines.map((line, index) => (
              <div
                key={`${line.kind}-${index}-${line.text}`}
                className={
                  line.kind === 'input'
                    ? 'text-white'
                    : line.kind === 'error'
                      ? 'text-red-300'
                      : line.kind === 'system'
                        ? 'text-emerald-300/70'
                        : 'text-white/70'
                }
              >
                <span className="whitespace-pre-wrap break-words">{line.text || ' '}</span>
              </div>
            ))}

            <form onSubmit={submitLine} className="mt-2 flex items-center gap-2">
              <span className="shrink-0 text-white/40">{formatPath(cwd)} $</span>
              <input
                ref={inputRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={handleKeyDown}
                className="min-w-0 flex-1 bg-transparent text-white caret-white outline-none"
                aria-label="Shell command input"
                spellCheck={false}
                autoComplete="off"
              />
            </form>
          </div>
        </section>

        <aside className="space-y-4">
          <div className="terminal-border rounded-md p-5">
            <h3 className="mb-3 text-xs font-medium opacity-30 tracking-widest uppercase">Sandbox Rules</h3>
            <ul className="space-y-2 text-sm leading-relaxed opacity-40">
              <li>Runs entirely in your browser</li>
              <li>Virtual filesystem in localStorage</li>
              <li>No network, no process spawning</li>
              <li>Can't access your real files</li>
              <li>Supports: ;  &&  ||  {'>'} {'>>'}</li>
            </ul>
          </div>

          <div className="terminal-border rounded-md p-5">
            <h3 className="mb-3 text-xs font-medium opacity-30 tracking-widest uppercase">Try These</h3>
            <div className="space-y-1.5">
              {trySuggestions.map(({ cmd, hint }) => (
                <button
                  key={cmd}
                  type="button"
                  onClick={() => {
                    setInput(cmd)
                    inputRef.current?.focus()
                  }}
                  className="flex w-full items-baseline gap-3 rounded px-2 py-1.5 text-left text-xs transition hover:bg-white/[0.04]"
                >
                  <code className="opacity-60">{cmd}</code>
                  <span className="opacity-25 text-[11px]">{hint}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="terminal-border rounded-md p-5">
            <h3 className="mb-3 text-xs font-medium opacity-30 tracking-widest uppercase">About</h3>
            <p className="text-xs leading-relaxed opacity-30">
              Originally written in C for CS 341 at UIUC. Implemented history
              expansion, logical operators, I/O redirection, and signal handling.
              This browser port uses the same interaction model on a virtual filesystem.
            </p>
            <a href={sourceUrl} className="mt-3 block text-xs opacity-25 underline underline-offset-4 transition hover:opacity-60">
              view original shell.c
            </a>
          </div>
        </aside>
      </div>
    </div>
  )
}
