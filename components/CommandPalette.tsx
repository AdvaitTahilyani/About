'use client'

import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import {
    Search,
    User,
    Briefcase,
    FlaskConical,
    GraduationCap,
    FolderGit2,
    Wrench,
    Mail,
    Github,
    Linkedin,
    FileText,
    Terminal,
    Gamepad2,
    ExternalLink,
    Sun,
    ArrowDownToLine,
    Command as CmdIcon,
} from 'lucide-react'

type CommandItem = {
    id: string
    label: string
    hint?: string
    group: 'navigation' | 'projects' | 'links' | 'actions'
    icon: LucideIcon
    action: () => void
    shortcut?: string[]
    keywords?: string[]
}

const groupOrder: Array<CommandItem['group']> = ['navigation', 'projects', 'links', 'actions']
const groupLabels: Record<CommandItem['group'], string> = {
    navigation: 'Navigate',
    projects: 'Open project',
    links: 'External',
    actions: 'Actions',
}

const CommandPalette = () => {
    const [open, setOpen] = useState(false)
    const [query, setQuery] = useState('')
    const [selectedIndex, setSelectedIndex] = useState(0)
    const inputRef = useRef<HTMLInputElement>(null)
    const listRef = useRef<HTMLDivElement>(null)

    const scrollToId = useCallback((id: string) => {
        if (window.location.pathname !== '/') {
            window.location.href = `/#${id}`
            return
        }
        const el = document.getElementById(id)
        if (el) {
            const y = el.getBoundingClientRect().top + window.scrollY - 80
            window.scrollTo({ top: y, behavior: 'smooth' })
        }
    }, [])

    const toggleTheme = useCallback(() => {
        const isLight = document.documentElement.classList.toggle('light')
        try {
            localStorage.setItem('theme', isLight ? 'light' : 'dark')
        } catch {}
    }, [])

    const copyEmail = useCallback(() => {
        navigator.clipboard?.writeText('advaitt2@illinois.edu')
    }, [])

    const items: CommandItem[] = useMemo(
        () => [
            { id: 'nav-about', label: 'About', group: 'navigation', icon: User, action: () => scrollToId('about'), keywords: ['home', 'intro', 'bio'] },
            { id: 'nav-experience', label: 'Experience', group: 'navigation', icon: Briefcase, action: () => scrollToId('experience'), keywords: ['work', 'jobs'] },
            { id: 'nav-research', label: 'Research', group: 'navigation', icon: FlaskConical, action: () => scrollToId('research'), keywords: ['lab', 'academic'] },
            { id: 'nav-education', label: 'Education', group: 'navigation', icon: GraduationCap, action: () => scrollToId('education'), keywords: ['school', 'uiuc'] },
            { id: 'nav-projects', label: 'Projects', group: 'navigation', icon: FolderGit2, action: () => scrollToId('projects'), keywords: ['work', 'builds'] },
            { id: 'nav-skills', label: 'Skills', group: 'navigation', icon: Wrench, action: () => scrollToId('skills'), keywords: ['stack', 'tech'] },
            { id: 'nav-contact', label: 'Contact', group: 'navigation', icon: Mail, action: () => scrollToId('contact'), keywords: ['email', 'reach out'] },

            { id: 'proj-shell', label: 'Toy Shell', hint: '/toy-shell', group: 'projects', icon: Terminal, action: () => (window.location.href = '/toy-shell'), keywords: ['cli', 'terminal', 'cs341'] },
            { id: 'proj-snake', label: 'Nand2Tetris Snake', hint: '/nand2tetris-snake', group: 'projects', icon: Gamepad2, action: () => (window.location.href = '/nand2tetris-snake'), keywords: ['game', 'jack'] },
            { id: 'proj-chess', label: 'Chess', hint: '/chess', group: 'projects', icon: Gamepad2, action: () => (window.location.href = '/chess'), keywords: ['game'] },

            { id: 'link-github', label: 'GitHub', hint: 'github.com/AdvaitTahilyani', group: 'links', icon: Github, action: () => window.open('https://github.com/AdvaitTahilyani', '_blank'), keywords: ['source', 'code'] },
            { id: 'link-linkedin', label: 'LinkedIn', hint: 'linkedin.com/in/advait-tahilyani', group: 'links', icon: Linkedin, action: () => window.open('https://www.linkedin.com/in/advait-tahilyani/', '_blank'), keywords: ['profile'] },
            { id: 'link-email', label: 'Email', hint: 'advaitt2@illinois.edu', group: 'links', icon: Mail, action: () => (window.location.href = 'mailto:advaitt2@illinois.edu'), keywords: ['contact', 'reach'] },
            { id: 'link-resume', label: 'Resume', hint: '/resume.pdf', group: 'links', icon: FileText, action: () => window.open('/resume.pdf', '_blank'), keywords: ['cv', 'pdf'] },

            { id: 'proj-aether', label: 'Aether — source', hint: 'github.com/AdvaitTahilyani/Aether', group: 'links', icon: Github, action: () => window.open('https://github.com/AdvaitTahilyani/Aether', '_blank'), keywords: ['email', 'llm'] },
            { id: 'proj-nand', label: 'Nand2Tetris — source', hint: 'github.com/AdvaitTahilyani/nand2tetris', group: 'links', icon: Github, action: () => window.open('https://github.com/AdvaitTahilyani/nand2tetris', '_blank'), keywords: ['compiler', 'cpu'] },
            { id: 'proj-note', label: 'NoteTaker — source', hint: 'github.com/AdvaitTahilyani/Notetaking-Software', group: 'links', icon: Github, action: () => window.open('https://github.com/AdvaitTahilyani/Notetaking-Software', '_blank'), keywords: ['swift', 'whisper'] },
            { id: 'proj-roomie', label: 'RoomieMatch — source', hint: 'github.com/AdvaitTahilyani/RoomieMatch', group: 'links', icon: Github, action: () => window.open('https://github.com/AdvaitTahilyani/RoomieMatch', '_blank'), keywords: ['react', 'firebase'] },
            { id: 'proj-plant', label: 'Plant Health Classifier — source', hint: 'github.com/AdvaitTahilyani/plant-health-classifier', group: 'links', icon: Github, action: () => window.open('https://github.com/AdvaitTahilyani/plant-health-classifier', '_blank'), keywords: ['mtc', 'ml'] },

            { id: 'act-copy-email', label: 'Copy email to clipboard', group: 'actions', icon: Mail, action: copyEmail, keywords: ['contact'] },
            { id: 'act-toggle-theme', label: 'Toggle theme', group: 'actions', icon: Sun, action: toggleTheme, keywords: ['dark', 'light', 'mode'] },
            { id: 'act-top', label: 'Scroll to top', group: 'actions', icon: ArrowDownToLine, action: () => window.scrollTo({ top: 0, behavior: 'smooth' }), keywords: ['home', 'up'] },
            { id: 'act-bottom', label: 'Scroll to bottom', group: 'actions', icon: ArrowDownToLine, action: () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }), keywords: ['end', 'footer'] },
        ],
        [scrollToId, toggleTheme, copyEmail],
    )

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase()
        if (!q) return items
        return items.filter((item) => {
            const haystack = `${item.label} ${item.hint ?? ''} ${(item.keywords ?? []).join(' ')}`.toLowerCase()
            return q.split(/\s+/).every((token) => haystack.includes(token))
        })
    }, [items, query])

    const grouped = useMemo(() => {
        const map = new Map<CommandItem['group'], CommandItem[]>()
        filtered.forEach((item) => {
            if (!map.has(item.group)) map.set(item.group, [])
            map.get(item.group)!.push(item)
        })
        return groupOrder
            .filter((g) => map.has(g))
            .map((g) => ({ group: g, items: map.get(g)! }))
    }, [filtered])

    const flat = useMemo(() => grouped.flatMap((g) => g.items), [grouped])

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            const mod = e.metaKey || e.ctrlKey
            if (mod && e.key.toLowerCase() === 'k') {
                e.preventDefault()
                setOpen((prev) => !prev)
                return
            }
            if (!open && e.key === '/' && !(e.target instanceof HTMLInputElement) && !(e.target instanceof HTMLTextAreaElement)) {
                e.preventDefault()
                setOpen(true)
            }
        }
        window.addEventListener('keydown', handleKey)
        return () => window.removeEventListener('keydown', handleKey)
    }, [open])

    useEffect(() => {
        if (open) {
            setQuery('')
            setSelectedIndex(0)
            setTimeout(() => inputRef.current?.focus(), 10)
        }
    }, [open])

    useEffect(() => {
        setSelectedIndex(0)
    }, [query])

    useEffect(() => {
        if (!listRef.current) return
        const el = listRef.current.querySelector<HTMLElement>(`[data-index="${selectedIndex}"]`)
        el?.scrollIntoView({ block: 'nearest' })
    }, [selectedIndex])

    const runItem = useCallback((item: CommandItem) => {
        setOpen(false)
        setTimeout(() => item.action(), 50)
    }, [])

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Escape') {
            setOpen(false)
        } else if (e.key === 'ArrowDown') {
            e.preventDefault()
            setSelectedIndex((i) => Math.min(i + 1, flat.length - 1))
        } else if (e.key === 'ArrowUp') {
            e.preventDefault()
            setSelectedIndex((i) => Math.max(i - 1, 0))
        } else if (e.key === 'Enter') {
            e.preventDefault()
            const item = flat[selectedIndex]
            if (item) runItem(item)
        }
    }

    let runningIndex = -1

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    key="cmdk-backdrop"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="fixed inset-0 z-[100] flex items-start justify-center pt-[12vh] px-4"
                    style={{ backgroundColor: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)' }}
                    onClick={() => setOpen(false)}
                    role="dialog"
                    aria-modal="true"
                    aria-label="Command palette"
                >
                    <motion.div
                        key="cmdk-panel"
                        initial={{ opacity: 0, y: -8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.98 }}
                        transition={{ duration: 0.18, ease: 'easeOut' }}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-xl rounded-lg overflow-hidden shadow-2xl"
                        style={{
                            backgroundColor: 'var(--cmdk-bg)',
                            border: '1px solid var(--border-primary)',
                        }}
                    >
                        <div
                            className="flex items-center gap-3 px-4 py-3 border-b"
                            style={{ borderColor: 'var(--border-primary)' }}
                        >
                            <Search size={14} className="opacity-40 shrink-0" />
                            <input
                                ref={inputRef}
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Type to search — sections, projects, actions…"
                                className="flex-1 bg-transparent outline-none text-sm placeholder:opacity-30"
                            />
                            <kbd
                                className="hidden sm:inline-block text-[10px] px-1.5 py-0.5 rounded opacity-50 border"
                                style={{ borderColor: 'var(--border-tag)' }}
                            >
                                esc
                            </kbd>
                        </div>

                        <div ref={listRef} className="max-h-[50vh] overflow-y-auto p-2">
                            {grouped.length === 0 && (
                                <div className="px-3 py-8 text-center text-sm opacity-40">
                                    No matches. Try another search.
                                </div>
                            )}
                            {grouped.map((g) => (
                                <div key={g.group} className="mb-1">
                                    <div className="px-3 pt-3 pb-1 text-[10px] uppercase tracking-widest opacity-25">
                                        {groupLabels[g.group]}
                                    </div>
                                    {g.items.map((item) => {
                                        runningIndex += 1
                                        const idx = runningIndex
                                        const isActive = idx === selectedIndex
                                        const Icon = item.icon
                                        const isExternal = item.group === 'links'
                                        return (
                                            <button
                                                key={item.id}
                                                data-index={idx}
                                                onMouseEnter={() => setSelectedIndex(idx)}
                                                onClick={() => runItem(item)}
                                                className="w-full flex items-center gap-3 px-3 py-2 rounded text-left text-sm transition-colors"
                                                style={{
                                                    backgroundColor: isActive ? 'var(--cmdk-active)' : 'transparent',
                                                }}
                                            >
                                                <Icon size={14} className="opacity-60 shrink-0" />
                                                <span className="truncate">{item.label}</span>
                                                {item.hint && (
                                                    <span className="text-xs opacity-30 truncate ml-1">
                                                        {item.hint}
                                                    </span>
                                                )}
                                                {isExternal && (
                                                    <ExternalLink size={10} className="opacity-30 ml-auto shrink-0" />
                                                )}
                                                {!isExternal && isActive && (
                                                    <span className="ml-auto text-[10px] opacity-40">↵</span>
                                                )}
                                            </button>
                                        )
                                    })}
                                </div>
                            ))}
                        </div>

                        <div
                            className="flex items-center justify-between px-4 py-2 text-[10px] opacity-40 border-t"
                            style={{ borderColor: 'var(--border-primary)' }}
                        >
                            <div className="flex items-center gap-3">
                                <span className="flex items-center gap-1">
                                    <kbd className="px-1 border rounded" style={{ borderColor: 'var(--border-tag)' }}>↑</kbd>
                                    <kbd className="px-1 border rounded" style={{ borderColor: 'var(--border-tag)' }}>↓</kbd>
                                    navigate
                                </span>
                                <span className="flex items-center gap-1">
                                    <kbd className="px-1 border rounded" style={{ borderColor: 'var(--border-tag)' }}>↵</kbd>
                                    select
                                </span>
                            </div>
                            <div className="flex items-center gap-1">
                                <CmdIcon size={10} />
                                <span>K to open</span>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default CommandPalette
