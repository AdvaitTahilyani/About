'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

interface TextScrambleProps {
    text: string
    className?: string
    duration?: number
    hoverable?: boolean
    delay?: number
}

const CHARS = '!<>-_\\/[]{}—=+*^?#_$%&@'

const TextScramble = ({ text, className, duration = 800, hoverable = true, delay = 0 }: TextScrambleProps) => {
    const [display, setDisplay] = useState(text)
    const frameRef = useRef<number>(0)
    const rafRef = useRef<number | null>(null)
    const queueRef = useRef<Array<{ from: string; to: string; start: number; end: number; char?: string }>>([])
    const runningRef = useRef(false)

    const randomChar = () => CHARS[Math.floor(Math.random() * CHARS.length)]

    const scramble = useCallback(
        (target: string) => {
            const current = display
            const length = Math.max(current.length, target.length)
            const queue: Array<{ from: string; to: string; start: number; end: number; char?: string }> = []
            const frames = Math.max(20, Math.floor(duration / 16))
            for (let i = 0; i < length; i++) {
                const from = current[i] || ''
                const to = target[i] || ''
                const start = Math.floor(Math.random() * (frames * 0.4))
                const end = start + Math.floor(Math.random() * frames * 0.5) + Math.floor(frames * 0.3)
                queue.push({ from, to, start, end })
            }
            queueRef.current = queue
            frameRef.current = 0
            runningRef.current = true

            const update = () => {
                let output = ''
                let complete = 0
                for (let i = 0; i < queueRef.current.length; i++) {
                    const { from, to, start, end } = queueRef.current[i]
                    let char = queueRef.current[i].char
                    if (frameRef.current >= end) {
                        complete++
                        output += to
                    } else if (frameRef.current >= start) {
                        if (!char || Math.random() < 0.28) {
                            char = randomChar()
                            queueRef.current[i].char = char
                        }
                        output += char
                    } else {
                        output += from
                    }
                }
                setDisplay(output)
                if (complete === queueRef.current.length) {
                    runningRef.current = false
                    return
                }
                frameRef.current++
                rafRef.current = requestAnimationFrame(update)
            }
            if (rafRef.current) cancelAnimationFrame(rafRef.current)
            rafRef.current = requestAnimationFrame(update)
        },
        [display, duration],
    )

    useEffect(() => {
        const timer = window.setTimeout(() => {
            scramble(text)
        }, delay)
        return () => {
            window.clearTimeout(timer)
            if (rafRef.current) cancelAnimationFrame(rafRef.current)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleHover = () => {
        if (!hoverable || runningRef.current) return
        scramble(text)
    }

    return (
        <span
            className={className}
            onMouseEnter={handleHover}
            style={{ display: 'inline-block', whiteSpace: 'pre' }}
        >
            {display}
        </span>
    )
}

export default TextScramble
