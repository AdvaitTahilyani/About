'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Code2, Pause, Play, RotateCcw, Terminal } from 'lucide-react'

const SCREEN_WIDTH = 512
const SCREEN_HEIGHT = 256
const ASSET_ROOT = '/demos/nand2tetris-snake'
const VM_FILES = ['Main.vm', 'SnakeGame.vm', 'Snake.vm', 'Fruit.vm', 'Square.vm']
const SOURCE_FILES = ['Main.jack', 'SnakeGame.jack', 'Snake.jack', 'Fruit.jack', 'Square.jack']

type Segment = 'constant' | 'argument' | 'local' | 'static' | 'this' | 'that' | 'pointer' | 'temp'
type VmInstruction =
  | { op: 'push' | 'pop'; segment: Segment; index: number; file: string }
  | { op: 'label' | 'goto' | 'if-goto'; label: string; file: string }
  | { op: 'function'; name: string; locals: number; file: string }
  | { op: 'call'; name: string; args: number; file: string }
  | { op: 'return'; file: string }
  | { op: 'add' | 'sub' | 'neg' | 'eq' | 'gt' | 'lt' | 'and' | 'or' | 'not'; file: string }

type VmFunction = {
  name: string
  file: string
  locals: number
  instructions: VmInstruction[]
  labels: Map<string, number>
}

type VmProgram = {
  functions: Map<string, VmFunction>
}

type VmFrame = {
  fn: VmFunction
  pc: number
  locals: number[]
  args: number[]
  savedThis: number
  savedThat: number
}

type NativeContext = {
  screen: Uint8Array
  keyCode: () => number
  markDirty: () => void
}

type NativeHandler = (args: number[], runtime: BrowserVmRuntime) => number

const normalize = (value: number) => {
  const unsigned = value & 0xffff
  return unsigned > 0x7fff ? unsigned - 0x10000 : unsigned
}

const parseVmProgram = (files: Record<string, string>): VmProgram => {
  const functions = new Map<string, VmFunction>()
  let current: VmFunction | null = null

  Object.entries(files).forEach(([fileName, source]) => {
    source.split('\n').forEach((rawLine) => {
      const line = rawLine.replace(/\/\/.*$/, '').trim()
      if (!line) {
        return
      }

      const parts = line.split(/\s+/)
      const command = parts[0]

      if (command === 'function') {
        current = {
          name: parts[1],
          file: fileName.replace('.vm', ''),
          locals: Number(parts[2]),
          instructions: [],
          labels: new Map(),
        }
        functions.set(current.name, current)
        return
      }

      if (!current) {
        throw new Error(`VM command before function in ${fileName}: ${line}`)
      }

      const file = fileName.replace('.vm', '')

      if (command === 'push' || command === 'pop') {
        current.instructions.push({
          op: command,
          segment: parts[1] as Segment,
          index: Number(parts[2]),
          file,
        })
        return
      }

      if (command === 'label') {
        current.labels.set(parts[1], current.instructions.length)
        current.instructions.push({ op: 'label', label: parts[1], file })
        return
      }

      if (command === 'goto' || command === 'if-goto') {
        current.instructions.push({ op: command, label: parts[1], file })
        return
      }

      if (command === 'call') {
        current.instructions.push({ op: 'call', name: parts[1], args: Number(parts[2]), file })
        return
      }

      if (command === 'return') {
        current.instructions.push({ op: 'return', file })
        return
      }

      current.instructions.push({ op: command as VmInstruction['op'], file } as VmInstruction)
    })
  })

  return { functions }
}

class BrowserVmRuntime {
  private program: VmProgram
  private ctx: NativeContext
  private stack: number[] = []
  private frames: VmFrame[] = []
  private ram = new Int32Array(32768)
  private temp = new Int32Array(8)
  private statics = new Map<string, number>()
  private natives: Map<string, NativeHandler>
  private thisBase = 0
  private thatBase = 0
  private heapPointer = 2048
  private waitUntil = 0
  halted = false

  constructor(program: VmProgram, ctx: NativeContext) {
    this.program = program
    this.ctx = ctx
    this.natives = this.createNatives()
    this.callFunction('Main.main', [])
  }

  step(now = performance.now()) {
    if (this.halted) {
      return
    }

    if (this.waitUntil > now) {
      return
    }

    const frame = this.frames[this.frames.length - 1]
    if (!frame) {
      this.halted = true
      return
    }

    const instruction = frame.fn.instructions[frame.pc]
    if (!instruction) {
      this.returnFromFunction(0)
      return
    }

    frame.pc += 1

    switch (instruction.op) {
      case 'push':
        this.stack.push(this.readSegment(instruction.segment, instruction.index, instruction.file))
        break
      case 'pop':
        this.writeSegment(instruction.segment, instruction.index, instruction.file, this.pop())
        break
      case 'add':
        this.binary((left, right) => left + right)
        break
      case 'sub':
        this.binary((left, right) => left - right)
        break
      case 'neg':
        this.stack.push(normalize(-this.pop()))
        break
      case 'eq':
        this.binary((left, right) => (left === right ? -1 : 0))
        break
      case 'gt':
        this.binary((left, right) => (left > right ? -1 : 0))
        break
      case 'lt':
        this.binary((left, right) => (left < right ? -1 : 0))
        break
      case 'and':
        this.binary((left, right) => left & right)
        break
      case 'or':
        this.binary((left, right) => left | right)
        break
      case 'not':
        this.stack.push(normalize(~this.pop()))
        break
      case 'label':
        break
      case 'goto':
        frame.pc = this.resolveLabel(frame, instruction.label)
        break
      case 'if-goto':
        if (this.pop() !== 0) {
          frame.pc = this.resolveLabel(frame, instruction.label)
        }
        break
      case 'call':
        this.invoke(instruction.name, instruction.args)
        break
      case 'function':
        break
      case 'return':
        this.returnFromFunction(this.pop())
        break
      default:
        throw new Error(`Unsupported VM instruction: ${(instruction as VmInstruction).op}`)
    }
  }

  runSlice(cycles: number, now = performance.now()) {
    for (let i = 0; i < cycles && !this.halted; i += 1) {
      if (this.waitUntil > now) {
        break
      }
      this.step(now)
    }
  }

  private currentFrame() {
    const frame = this.frames[this.frames.length - 1]
    if (!frame) {
      throw new Error('No active VM frame')
    }
    return frame
  }

  private invoke(name: string, argCount: number) {
    const args = this.stack.splice(this.stack.length - argCount, argCount)
    const native = this.natives.get(name)

    if (native) {
      this.stack.push(normalize(native(args, this)))
      return
    }

    this.callFunction(name, args)
  }

  private callFunction(name: string, args: number[]) {
    const fn = this.program.functions.get(name)
    if (!fn) {
      throw new Error(`Missing VM function: ${name}`)
    }

    this.frames.push({
      fn,
      pc: 0,
      locals: Array(fn.locals).fill(0),
      args,
      savedThis: this.thisBase,
      savedThat: this.thatBase,
    })
  }

  private returnFromFunction(value: number) {
    const completed = this.frames.pop()

    if (completed) {
      this.thisBase = completed.savedThis
      this.thatBase = completed.savedThat
    }

    if (this.frames.length === 0) {
      this.halted = true
      return
    }

    this.stack.push(normalize(value))
  }

  private binary(operation: (left: number, right: number) => number) {
    const right = this.pop()
    const left = this.pop()
    this.stack.push(normalize(operation(left, right)))
  }

  private pop() {
    return normalize(this.stack.pop() ?? 0)
  }

  private resolveLabel(frame: VmFrame, label: string) {
    const pc = frame.fn.labels.get(label)
    if (pc === undefined) {
      throw new Error(`Missing label ${label} in ${frame.fn.name}`)
    }
    return pc
  }

  private readSegment(segment: Segment, index: number, file: string) {
    const frame = this.currentFrame()

    switch (segment) {
      case 'constant':
        return index
      case 'argument':
        return frame.args[index] ?? 0
      case 'local':
        return frame.locals[index] ?? 0
      case 'static':
        return this.statics.get(`${file}.${index}`) ?? 0
      case 'this':
        return this.ram[this.thisBase + index] ?? 0
      case 'that':
        return this.ram[this.thatBase + index] ?? 0
      case 'pointer':
        return index === 0 ? this.thisBase : this.thatBase
      case 'temp':
        return this.temp[index] ?? 0
      default:
        throw new Error(`Unsupported segment: ${segment}`)
    }
  }

  private writeSegment(segment: Segment, index: number, file: string, value: number) {
    const frame = this.currentFrame()
    const normalized = normalize(value)

    switch (segment) {
      case 'argument':
        frame.args[index] = normalized
        break
      case 'local':
        frame.locals[index] = normalized
        break
      case 'static':
        this.statics.set(`${file}.${index}`, normalized)
        break
      case 'this':
        this.ram[this.thisBase + index] = normalized
        break
      case 'that':
        this.ram[this.thatBase + index] = normalized
        break
      case 'pointer':
        if (index === 0) {
          this.thisBase = normalized
        } else {
          this.thatBase = normalized
        }
        break
      case 'temp':
        this.temp[index] = normalized
        break
      default:
        throw new Error(`Cannot write VM segment: ${segment}`)
    }
  }

  private alloc(size: number) {
    const base = this.heapPointer
    const words = Math.max(1, size)
    this.ram.fill(0, base, base + words)
    this.heapPointer += words
    return base
  }

  private createNatives() {
    const natives = new Map<string, NativeHandler>()

    natives.set('Memory.alloc', ([size], runtime) => runtime.alloc(size))
    natives.set('Memory.deAlloc', () => 0)
    natives.set('Array.new', ([size], runtime) => runtime.alloc(size))
    natives.set('Array.dispose', () => 0)
    natives.set('Math.multiply', ([left, right]) => left * right)
    natives.set('Math.divide', ([left, right]) => (right === 0 ? 0 : Math.trunc(left / right)))
    natives.set('Keyboard.keyPressed', () => this.ctx.keyCode())
    natives.set('Sys.wait', ([duration]) => {
      this.waitUntil = performance.now() + Math.max(12, Math.min(80, duration))
      return 0
    })
    natives.set('Screen.setColor', ([color]) => {
      this.screenColor = color !== 0 ? 1 : 0
      return 0
    })
    natives.set('Screen.drawRectangle', ([x1, y1, x2, y2]) => {
      this.drawRectangle(x1, y1, x2, y2)
      return 0
    })

    return natives
  }

  private screenColor = 1

  private drawRectangle(x1: number, y1: number, x2: number, y2: number) {
    const left = Math.max(0, Math.min(SCREEN_WIDTH - 1, Math.min(x1, x2)))
    const right = Math.max(0, Math.min(SCREEN_WIDTH - 1, Math.max(x1, x2)))
    const top = Math.max(0, Math.min(SCREEN_HEIGHT - 1, Math.min(y1, y2)))
    const bottom = Math.max(0, Math.min(SCREEN_HEIGHT - 1, Math.max(y1, y2)))

    for (let y = top; y <= bottom; y += 1) {
      const row = y * SCREEN_WIDTH
      for (let x = left; x <= right; x += 1) {
        this.ctx.screen[row + x] = this.screenColor
      }
    }

    this.ctx.markDirty()
  }
}

const mapKeyCode = (event: KeyboardEvent) => {
  if (event.key === 'ArrowLeft') return 130
  if (event.key === 'ArrowUp') return 131
  if (event.key === 'ArrowRight') return 132
  if (event.key === 'ArrowDown') return 133
  if (event.key === 'q' || event.key === 'Q') return 81
  return null
}

export default function Nand2TetrisSnakeDemo() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const runtimeRef = useRef<BrowserVmRuntime | null>(null)
  const screenRef = useRef(new Uint8Array(SCREEN_WIDTH * SCREEN_HEIGHT))
  const keyCodeRef = useRef(0)
  const pendingKeyCodeRef = useRef(0)
  const dirtyRef = useRef(true)
  const animationRef = useRef<number | null>(null)
  const programRef = useRef<VmProgram | null>(null)
  const [program, setProgram] = useState<VmProgram | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [selectedSource, setSelectedSource] = useState(SOURCE_FILES[0])
  const [sourceText, setSourceText] = useState('')
  const [sourceError, setSourceError] = useState<string | null>(null)
  const [status, setStatus] = useState('Loading VM assets')

  const resetRuntime = useCallback((loadedProgram = programRef.current) => {
    if (!loadedProgram) {
      return
    }

    screenRef.current.fill(0)
    keyCodeRef.current = 0
    pendingKeyCodeRef.current = 0
    dirtyRef.current = true
    runtimeRef.current = new BrowserVmRuntime(loadedProgram, {
      screen: screenRef.current,
      keyCode: () => {
        if (pendingKeyCodeRef.current !== 0) {
          const code = pendingKeyCodeRef.current
          pendingKeyCodeRef.current = 0
          return code
        }

        return keyCodeRef.current
      },
      markDirty: () => {
        dirtyRef.current = true
      },
    })
    runtimeRef.current.runSlice(10000, performance.now())
    setStatus('Ready')
    setIsRunning(false)
  }, [])

  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) {
      return
    }

    const ctx = canvas.getContext('2d')
    if (!ctx) {
      return
    }

    const image = ctx.createImageData(SCREEN_WIDTH, SCREEN_HEIGHT)
    const screen = screenRef.current

    for (let i = 0; i < screen.length; i += 1) {
      const offset = i * 4
      const value = screen[i] === 1 ? 8 : 248
      image.data[offset] = value
      image.data[offset + 1] = value
      image.data[offset + 2] = value
      image.data[offset + 3] = 255
    }

    ctx.putImageData(image, 0, 0)
    dirtyRef.current = false
  }, [])

  useEffect(() => {
    let cancelled = false

    const loadVmFiles = async () => {
      try {
        const entries = await Promise.all(
          VM_FILES.map(async (file) => {
            const response = await fetch(`${ASSET_ROOT}/vm/${file}`)
            if (!response.ok) {
              throw new Error(`Could not load ${file}`)
            }
            return [file, await response.text()] as const
          })
        )

        if (cancelled) {
          return
        }

        const parsed = parseVmProgram(Object.fromEntries(entries))
        programRef.current = parsed
        setProgram(parsed)
        resetRuntime(parsed)
      } catch (error) {
        if (!cancelled) {
          setLoadError(error instanceof Error ? error.message : 'Could not load VM program')
          setStatus('VM load failed')
        }
      }
    }

    loadVmFiles()

    return () => {
      cancelled = true
    }
  }, [resetRuntime])

  useEffect(() => {
    let cancelled = false

    const loadSource = async () => {
      setSourceError(null)

      try {
        const response = await fetch(`${ASSET_ROOT}/src/${selectedSource}`)
        if (!response.ok) {
          throw new Error(`Could not load ${selectedSource}`)
        }
        const text = await response.text()
        if (!cancelled) {
          setSourceText(text)
        }
      } catch (error) {
        if (!cancelled) {
          setSourceError(error instanceof Error ? error.message : 'Could not load source file')
          setSourceText('')
        }
      }
    }

    loadSource()

    return () => {
      cancelled = true
    }
  }, [selectedSource])

  useEffect(() => {
    const tick = (now: number) => {
      if (isRunning) {
        runtimeRef.current?.runSlice(4500, now)
        if (runtimeRef.current?.halted) {
          setIsRunning(false)
          setStatus('Program halted')
        }
      }

      if (dirtyRef.current || isRunning) {
        renderCanvas()
      }

      animationRef.current = requestAnimationFrame(tick)
    }

    animationRef.current = requestAnimationFrame(tick)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isRunning, renderCanvas])

  useEffect(() => {
    renderCanvas()
  }, [renderCanvas])

  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    const code = mapKeyCode(event.nativeEvent)
    if (code === null) {
      return
    }

    event.preventDefault()
    pendingKeyCodeRef.current = code
    keyCodeRef.current = code
  }, [])

  const handleKeyUp = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    const code = mapKeyCode(event.nativeEvent)
    if (code === null) {
      return
    }

    event.preventDefault()
    if (keyCodeRef.current === code) {
      keyCodeRef.current = 0
    }
  }, [])

  const focusDemo = useCallback(() => {
    canvasRef.current?.parentElement?.focus()
  }, [])

  const architectureSteps = useMemo(() => [
    'Jack source',
    'Compiled VM files',
    'Browser VM runtime',
    'Native Jack OS shims',
    'Canvas Hack screen',
  ], [])

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.45fr)_minmax(300px,0.75fr)]">
        <div className="space-y-4">
          <div
            tabIndex={0}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              setIsFocused(false)
              keyCodeRef.current = 0
              pendingKeyCodeRef.current = 0
            }}
            onKeyDown={handleKeyDown}
            onKeyUp={handleKeyUp}
            className={`rounded-lg border bg-white p-2 outline-none transition ${
              isFocused ? 'border-white ring-2 ring-white/40' : 'border-white/20'
            }`}
            aria-label="Playable nand2tetris Snake canvas. Use arrow keys to steer and Q to quit."
          >
            <canvas
              ref={canvasRef}
              width={SCREEN_WIDTH}
              height={SCREEN_HEIGHT}
              className="aspect-[2/1] w-full bg-white [image-rendering:pixelated]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              disabled={!program || Boolean(loadError)}
              onClick={() => {
                setIsRunning(true)
                setStatus('Running')
                focusDemo()
              }}
              className="btn-shine flex items-center gap-2 rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold transition hover:border-white/40 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Play size={16} />
              Start
            </button>
            <button
              type="button"
              disabled={!program}
              onClick={() => {
                setIsRunning(false)
                setStatus('Paused')
              }}
              className="flex items-center gap-2 rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold transition hover:border-white/40 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Pause size={16} />
              Pause
            </button>
            <button
              type="button"
              disabled={!program}
              onClick={() => {
                resetRuntime()
                renderCanvas()
              }}
              className="flex items-center gap-2 rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold transition hover:border-white/40 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <RotateCcw size={16} />
              Reset
            </button>
            <button
              type="button"
              onClick={focusDemo}
              className="flex items-center gap-2 rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold transition hover:border-white/40"
            >
              <Terminal size={16} />
              Focus keyboard
            </button>
            <span className="text-sm opacity-70">Status: {status}</span>
          </div>

          <p className="text-sm leading-relaxed opacity-70">
            Use arrow keys to steer. Press Q to quit the VM program. Keyboard controls work best on desktop.
          </p>

          {loadError && (
            <p className="rounded-lg border border-red-400/40 bg-red-950/30 p-3 text-sm text-red-100">
              {loadError}
            </p>
          )}
        </div>

        <aside className="glass-effect rounded-lg p-5">
          <h3 className="mb-4 text-xl font-bold">Runtime Architecture</h3>
          <p className="mb-5 text-sm leading-relaxed opacity-80">
            Written in Jack for nand2tetris, compiled to VM code, and running here in a browser VM emulator with the
            Hack screen and keyboard model.
          </p>
          <ol className="space-y-3">
            {architectureSteps.map((step, index) => (
              <li key={step} className="flex items-center gap-3 text-sm">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded border border-white/20 text-xs">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </aside>
      </div>

      <section className="glass-effect rounded-lg p-5">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="flex items-center gap-2 text-xl font-bold">
              <Code2 size={20} />
              Jack Source
            </h3>
            <p className="mt-1 text-sm opacity-70">The original project source files are served as static artifacts.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {SOURCE_FILES.map((file) => (
              <button
                key={file}
                type="button"
                onClick={() => setSelectedSource(file)}
                className={`rounded border px-3 py-1 text-xs transition ${
                  selectedSource === file
                    ? 'border-white bg-white text-black'
                    : 'border-white/20 hover:border-white/50'
                }`}
              >
                {file}
              </button>
            ))}
          </div>
        </div>

        {sourceError ? (
          <p className="rounded-lg border border-red-400/40 bg-red-950/30 p-3 text-sm text-red-100">{sourceError}</p>
        ) : (
          <pre className="max-h-[480px] overflow-auto rounded-lg border border-white/10 bg-black/70 p-4 text-xs leading-relaxed text-white">
            <code>{sourceText}</code>
          </pre>
        )}

        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          {VM_FILES.map((file) => (
            <a
              key={file}
              href={`${ASSET_ROOT}/vm/${file}`}
              className="opacity-60 underline underline-offset-4 transition hover:opacity-100"
            >
              {file}
            </a>
          ))}
        </div>
      </section>
    </div>
  )
}
