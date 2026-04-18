'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const formatTime = () => {
    try {
        return new Intl.DateTimeFormat('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
            timeZone: 'America/Chicago',
        }).format(new Date())
    } catch {
        const d = new Date()
        return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
    }
}

const LiveStatus = () => {
    const [time, setTime] = useState<string>('')
    const [step, setStep] = useState(0)

    useEffect(() => {
        setTime(formatTime())
        const clock = window.setInterval(() => setTime(formatTime()), 30 * 1000)
        const rotate = window.setInterval(() => setStep((s) => (s + 1) % 3), 4500)
        return () => {
            window.clearInterval(clock)
            window.clearInterval(rotate)
        }
    }, [])

    const messages = [
        { label: 'now', value: '@ Amazon · Summer 2026' },
        { label: 'based', value: 'Urbana, IL' },
        { label: 'local', value: time ? `${time} CST` : '—' },
    ]

    const current = messages[step]

    return (
        <span className="flex items-center gap-1.5 opacity-30 min-w-0">
            <span className="relative inline-flex h-1.5 w-1.5 shrink-0" aria-hidden>
                <span className="absolute inset-0 rounded-full bg-emerald-400 opacity-70 animate-ping" />
                <span className="relative rounded-full bg-emerald-400 h-1.5 w-1.5" />
            </span>
            <span className="text-xs">
                <span className="opacity-80">{current.label}:</span>{' '}
                <AnimatePresence mode="wait">
                    <motion.span
                        key={step}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.25 }}
                        className="inline-block"
                    >
                        {current.value}
                    </motion.span>
                </AnimatePresence>
            </span>
        </span>
    )
}

export default LiveStatus
