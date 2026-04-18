'use client'

import { useEffect, useRef, useState } from 'react'

const CursorSpotlight = () => {
    const ref = useRef<HTMLDivElement>(null)
    const [enabled, setEnabled] = useState(true)
    const raf = useRef<number | null>(null)
    const pos = useRef({ x: -1000, y: -1000 })

    useEffect(() => {
        if (typeof window === 'undefined') return
        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        const isTouch = window.matchMedia('(pointer: coarse)').matches
        if (prefersReduced || isTouch) {
            setEnabled(false)
            return
        }

        const handleMove = (e: MouseEvent) => {
            pos.current.x = e.clientX
            pos.current.y = e.clientY
            if (raf.current === null) {
                raf.current = requestAnimationFrame(update)
            }
        }

        const handleLeave = () => {
            pos.current.x = -1000
            pos.current.y = -1000
            if (raf.current === null) {
                raf.current = requestAnimationFrame(update)
            }
        }

        const update = () => {
            raf.current = null
            if (!ref.current) return
            ref.current.style.setProperty('--sx', `${pos.current.x}px`)
            ref.current.style.setProperty('--sy', `${pos.current.y}px`)
        }

        window.addEventListener('mousemove', handleMove, { passive: true })
        window.addEventListener('mouseleave', handleLeave)
        return () => {
            window.removeEventListener('mousemove', handleMove)
            window.removeEventListener('mouseleave', handleLeave)
            if (raf.current !== null) cancelAnimationFrame(raf.current)
        }
    }, [])

    if (!enabled) return null

    return (
        <div
            ref={ref}
            aria-hidden
            className="pointer-events-none fixed inset-0 z-[1]"
            style={{
                background:
                    'radial-gradient(600px circle at var(--sx, -1000px) var(--sy, -1000px), var(--spotlight-color), transparent 60%)',
            }}
        />
    )
}

export default CursorSpotlight
