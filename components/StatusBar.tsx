'use client'

import { useEffect, useState } from 'react'
import { Command } from 'lucide-react'

type Props = {
    routeLabel?: string
}

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

const StatusBar = ({ routeLabel }: Props) => {
    const [progress, setProgress] = useState(0)
    const [section, setSection] = useState<string>('top')
    const [time, setTime] = useState<string>('')
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        setTime(formatTime())
        const clock = window.setInterval(() => setTime(formatTime()), 30 * 1000)
        return () => window.clearInterval(clock)
    }, [])

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY
            const docHeight = document.documentElement.scrollHeight - window.innerHeight
            const pct = docHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / docHeight) * 100)) : 0
            setProgress(pct)
            setVisible(scrollTop > 100)
        }
        handleScroll()
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        if (routeLabel) return
        const ids = ['about', 'experience', 'research', 'projects', 'education', 'skills', 'contact']
        const sections = ids
            .map((id) => document.getElementById(id))
            .filter((el): el is HTMLElement => el !== null)
        if (sections.length === 0) return

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((e) => e.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
                if (visible[0]) setSection(visible[0].target.id)
            },
            {
                rootMargin: '-30% 0px -55% 0px',
                threshold: [0, 0.25, 0.5, 0.75, 1],
            },
        )
        sections.forEach((s) => observer.observe(s))
        return () => observer.disconnect()
    }, [routeLabel])

    const displaySection = routeLabel ?? section

    const openCmdK = () => {
        const isMac = typeof navigator !== 'undefined' && /Mac/.test(navigator.platform)
        const event = new KeyboardEvent('keydown', {
            key: 'k',
            code: 'KeyK',
            metaKey: isMac,
            ctrlKey: !isMac,
            bubbles: true,
        })
        window.dispatchEvent(event)
    }

    return (
        <div
            className={`fixed bottom-0 left-0 right-0 z-40 pointer-events-none transition-all duration-300 ${
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            }`}
            aria-hidden={!visible}
        >
            <div
                className="mx-auto max-w-5xl mx-3 mb-3 rounded-md border backdrop-blur-md pointer-events-auto"
                style={{
                    borderColor: 'var(--border-primary)',
                    backgroundColor: 'var(--statusbar-bg)',
                }}
            >
                <div className="flex items-center justify-between gap-2 px-3 py-1.5 text-[10px] tracking-wider">
                    <div className="flex items-center gap-2 min-w-0 overflow-hidden">
                        <span
                            className="px-1.5 py-0.5 rounded font-bold text-[9px]"
                            style={{
                                backgroundColor: 'var(--statusbar-accent)',
                                color: 'var(--statusbar-accent-fg)',
                            }}
                        >
                            NORMAL
                        </span>
                        <span className="opacity-50 truncate">
                            ~/advait
                            <span className="opacity-40 mx-1">/</span>
                            <span className="opacity-90">{displaySection}</span>
                        </span>
                    </div>

                    <div className="hidden sm:flex items-center gap-4 shrink-0">
                        <button
                            onClick={openCmdK}
                            className="flex items-center gap-1 opacity-40 hover:opacity-100 transition-opacity"
                            aria-label="Open command palette"
                        >
                            <Command size={9} />
                            <span>K</span>
                        </button>
                        <span className="opacity-40 tabular-nums">
                            {time ? `${time} CST` : '—'}
                        </span>
                        <span className="flex items-center gap-1 opacity-40 tabular-nums w-14 justify-end">
                            <ProgressDots percent={progress} />
                            <span>{Math.round(progress)}%</span>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}

const ProgressDots = ({ percent }: { percent: number }) => {
    const bars = 5
    const filled = Math.round((percent / 100) * bars)
    return (
        <span className="flex items-center gap-[2px]" aria-hidden>
            {Array.from({ length: bars }).map((_, i) => (
                <span
                    key={i}
                    className="w-[3px] h-[7px] rounded-sm transition-colors duration-200"
                    style={{
                        backgroundColor: i < filled ? 'var(--progress-color)' : 'var(--border-tag)',
                    }}
                />
            ))}
        </span>
    )
}

export default StatusBar
