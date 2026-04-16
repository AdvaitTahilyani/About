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
                'Toy shell ported from a CS 341 C shell assignment.\\nThis browser version has no exec, no host filesystem access, and no process control.\\nTry: ls, cat README.md, mkdir notes, echo hello > notes/msg.txt, tree\\n',
            },
            projects: {
              type: 'dir',
              children: {
                'snake.vm': {
                  type: 'file',
                  content: 'push constant 0\\ncall SnakeGame.new 0\\n',
                },
                'shell-notes.txt': {
                  type: 'file',
                  content:
                    'The original C shell supported history, cd, redirection, logical operators, and process commands.\\nThis page keeps the interaction model but runs entirely inside a virtual filesystem.\\n',
                },
              },
            },
            tmp: {
              type: 'dir',
              children: {},
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

export default function ToyShellDemo() {
  const [root, setRoot] = useState<FsDirectory>(() => starterFs())
  const [cwd, setCwd] = useState('/home/advait')
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState<number | null>(null)
  const [lines, setLines] = useState<ShellLine[]>([
    { kind: 'system', text: 'CS 341 shell, ported to a browser sandbox.' },
    { kind: 'system', text: 'Type help to see the allowlisted commands.' },
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
      ['pwd', 'print current sandbox path'],
      ['ls [-la] [path]', 'list files'],
      ['cd [path]', 'change directory inside the sandbox'],
      ['mkdir <path>', 'create directories'],
      ['touch <file>', 'create or update files'],
      ['cat <file>', 'read files'],
      ['echo text [> file]', 'print text or write redirected output'],
      ['write <file> <text>', 'replace a file with text'],
      ['rm [-r] <path>', 'delete files, or directories with -r'],
      ['rmdir <path>', 'delete empty directories'],
      ['tree [path]', 'draw the virtual filesystem'],
      ['history, #n, !prefix', 'replay commands like the C shell'],
      ['clear, reset', 'clear terminal or restore starter filesystem'],
    ],
    []
  )

  const runCommand = (rawCommand: string, fs: FsDirectory, currentCwd: string): { result: CommandResult; cwd: string } => {
    let command = rawCommand.trim()
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

    const deny = (message: string): CommandResult => ({
      code: 126,
      output: [`${name}: ${message}`],
    })

    let result: CommandResult
    let nextCwd = currentCwd

    switch (name) {
      case 'help':
        result = {
          code: 0,
          output: [
            'Allowlisted commands:',
            ...commands.map(([usage, description]) => `  ${usage.padEnd(22)} ${description}`),
            '',
            'Operators: ;, &&, || and output redirects >, >> are simulated.',
          ],
        }
        break
      case 'pwd':
        result = { code: 0, output: [currentCwd] }
        break
      case 'ls': {
        const flags = args.filter((arg) => arg.startsWith('-')).join('')
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

        const names = Object.entries(node.children).sort(([left], [right]) => left.localeCompare(right))
        result = {
          code: 0,
          output: flags.includes('l')
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
              output.push(`${prefix}${isLast ? '`-- ' : '|-- '}${entryName}`)
              walk(child, `${prefix}${isLast ? '    ' : '|   '}`)
            })
        }
        walk(node, '')
        result = { code: 0, output }
        break
      }
      case 'history':
      case '!history':
        result = { code: 0, output: history.map((entry, index) => `${index}  ${entry}`) }
        break
      case 'clear':
        result = { code: 0, output: [], clear: true }
        break
      case 'reset':
        Object.assign(fs, starterFs())
        nextCwd = '/home/advait'
        result = { code: 0, output: ['sandbox filesystem restored'] }
        break
      case 'ps':
        result = {
          code: 0,
          output: ['PID   NLWP  VSZ    STAT  START  TIME  COMMAND', '341   1     64K    R     now    0:00  browser-shell'],
        }
        break
      case 'kill':
      case 'stop':
      case 'cont':
        result = deny('process control is simulated here; no host process can be reached')
        break
      case 'exit':
        result = { code: 0, output: ['session closed in the original shell; browser sandbox remains available'] }
        break
      default:
        result = {
          code: 127,
          output: [`${name}: command not found in sandbox. Try help.`],
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

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.7fr)]">
        <section
          className="terminal-border overflow-hidden rounded-md bg-black text-white"
          onClick={() => inputRef.current?.focus()}
        >
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <div className="flex items-center gap-2 text-sm">
              <Terminal size={16} />
              sandbox shell
            </div>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                setRoot(starterFs())
                setCwd('/home/advait')
                setLines([
                  { kind: 'system', text: 'Sandbox reset.' },
                  { kind: 'system', text: 'Type help to see the allowlisted commands.' },
                ])
                setInput('')
                window.localStorage.removeItem(STORAGE_KEY)
              }}
              className="flex items-center gap-1.5 rounded border border-white/20 px-2 py-1 text-xs opacity-70 transition hover:opacity-100"
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
                        ? 'text-emerald-300'
                        : 'text-white/70'
                }
              >
                <span className="whitespace-pre-wrap break-words">{line.text || ' '}</span>
              </div>
            ))}

            <form onSubmit={submitLine} className="mt-2 flex items-center gap-2">
              <span className="shrink-0 text-white/60">{formatPath(cwd)} $</span>
              <input
                ref={inputRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={handleKeyDown}
                className="min-w-0 flex-1 bg-transparent text-white caret-white outline-none"
                aria-label="Toy shell command input"
                spellCheck={false}
                autoComplete="off"
              />
            </form>
          </div>
        </section>

        <aside className="space-y-4">
          <div className="terminal-border rounded-md p-5">
            <h3 className="mb-3 text-sm font-semibold">Sandbox Rules</h3>
            <p className="text-sm leading-relaxed opacity-50">
              This shell runs entirely in the browser. Commands operate on a virtual filesystem saved in local storage.
              There is no network access, no process spawning, and no access to your computer's files.
            </p>
          </div>

          <div className="terminal-border rounded-md p-5">
            <h3 className="mb-3 text-sm font-semibold">Try These</h3>
            <div className="space-y-2 text-xs opacity-60">
              {[
                'ls -la',
                'cat README.md',
                'mkdir notes',
                'echo hello > notes/msg.txt',
                'cat notes/msg.txt',
                'tree',
                'history',
              ].map((command) => (
                <button
                  key={command}
                  type="button"
                  onClick={() => {
                    setInput(command)
                    inputRef.current?.focus()
                  }}
                  className="block rounded border border-white/10 px-2 py-1 text-left transition hover:border-white/30 hover:opacity-100"
                >
                  {command}
                </button>
              ))}
            </div>
          </div>

          <a href={sourceUrl} className="block text-sm opacity-50 underline underline-offset-4 transition hover:opacity-100">
            original shell.c source
          </a>
        </aside>
      </div>
    </div>
  )
}
