'use client'

import { useEffect, useRef, useState } from 'react'

const KONAMI = [
    'ArrowUp',
    'ArrowUp',
    'ArrowDown',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
    'ArrowLeft',
    'ArrowRight',
    'b',
    'a',
]

const CHARS = '01<>/\\{}[]()=+-*&^%$#@!?abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

const KonamiMatrix = () => {
    const [active, setActive] = useState(false)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const rafRef = useRef<number | null>(null)
    const progressRef = useRef<number>(0)

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            const expected = KONAMI[progressRef.current]
            if (e.key === expected) {
                progressRef.current += 1
                if (progressRef.current === KONAMI.length) {
                    progressRef.current = 0
                    setActive(true)
                    window.setTimeout(() => setActive(false), 4500)
                }
            } else {
                progressRef.current = e.key === KONAMI[0] ? 1 : 0
            }
        }
        window.addEventListener('keydown', handleKey)
        return () => window.removeEventListener('keydown', handleKey)
    }, [])

    useEffect(() => {
        if (!active) return
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const resize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }
        resize()
        window.addEventListener('resize', resize)

        const fontSize = 14
        const columns = Math.floor(canvas.width / fontSize)
        const drops: number[] = Array.from({ length: columns }, () => Math.random() * -50)
        let start = performance.now()

        const draw = (now: number) => {
            const elapsed = now - start
            const fade = elapsed < 3500 ? 1 : Math.max(0, 1 - (elapsed - 3500) / 1000)

            ctx.fillStyle = 'rgba(0, 0, 0, 0.08)'
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            ctx.font = `${fontSize}px "JetBrains Mono", monospace`
            for (let i = 0; i < drops.length; i++) {
                const char = CHARS[Math.floor(Math.random() * CHARS.length)]
                const x = i * fontSize
                const y = drops[i] * fontSize
                ctx.fillStyle = `rgba(110, 231, 183, ${0.75 * fade})`
                ctx.fillText(char, x, y)
                if (y > canvas.height && Math.random() > 0.975) drops[i] = 0
                drops[i] += 1
            }

            if (elapsed < 4500) {
                rafRef.current = requestAnimationFrame(draw)
            }
        }

        rafRef.current = requestAnimationFrame(draw)
        return () => {
            window.removeEventListener('resize', resize)
            if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
            ctx.clearRect(0, 0, canvas.width, canvas.height)
        }
    }, [active])

    if (!active) return null

    return (
        <div
            aria-hidden
            className="fixed inset-0 z-[90] pointer-events-none transition-opacity duration-500"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.35)' }}
        >
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-emerald-300/80 text-xs tracking-widest font-mono">
                ↑↑↓↓←→←→BA · wake up, Neo…
            </div>
        </div>
    )
}

export default KonamiMatrix
