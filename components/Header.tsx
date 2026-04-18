'use client'

import { useState, useEffect } from 'react'
import { Menu, X, Command } from 'lucide-react'
import ThemeToggle from './ThemeToggle'
import AdminIndicator from './AdminIndicator'

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const [activeSection, setActiveSection] = useState<string>('')
    const [pathname, setPathname] = useState<string>('/')

    useEffect(() => {
        setPathname(window.location.pathname)
        const handleScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', handleScroll)
        handleScroll()
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        if (pathname !== '/') return
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
                if (visible[0]) setActiveSection(visible[0].target.id)
            },
            {
                rootMargin: '-30% 0px -55% 0px',
                threshold: [0, 0.25, 0.5, 0.75, 1],
            },
        )

        sections.forEach((s) => observer.observe(s))
        return () => observer.disconnect()
    }, [pathname])

    const menuItems = [
        { name: 'experience', href: '/#experience', id: 'experience' },
        { name: 'research', href: '/#research', id: 'research' },
        { name: 'projects', href: '/#projects', id: 'projects' },
        { name: 'education', href: '/#education', id: 'education' },
        { name: 'shell', href: '/toy-shell', id: 'shell', route: '/toy-shell' },
        { name: 'snake', href: '/nand2tetris-snake', id: 'snake', route: '/nand2tetris-snake' },
        { name: 'chess', href: '/chess', id: 'chess', route: '/chess' },
    ]

    const isActive = (item: typeof menuItems[number]) => {
        if (item.route) return pathname === item.route
        return pathname === '/' && activeSection === item.id
    }

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
        <header
            className={`fixed top-0 w-full z-50 transition-all duration-200 ${
                scrolled ? 'border-b backdrop-blur-md' : 'bg-transparent'
            }`}
            style={scrolled ? { borderColor: 'var(--border-primary)', backgroundColor: 'var(--bg-header)' } : undefined}
        >
            <nav className="container mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    <a href="/" className="text-sm font-medium opacity-60 hover:opacity-100 transition-opacity duration-200">
                        ~/advait
                    </a>

                    <div className="hidden md:flex items-center gap-6">
                        {menuItems.map((item) => {
                            const active = isActive(item)
                            return (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    className={`relative text-xs transition-opacity duration-200 ${
                                        active ? 'opacity-100' : 'opacity-40 hover:opacity-100'
                                    }`}
                                >
                                    {item.name}
                                    {active && (
                                        <span
                                            aria-hidden
                                            className="absolute -bottom-1 left-0 right-0 h-px"
                                            style={{ backgroundColor: 'currentColor', opacity: 0.4 }}
                                        />
                                    )}
                                </a>
                            )
                        })}
                    </div>

                    <div className="hidden md:flex items-center gap-3">
                        <button
                            onClick={openCmdK}
                            aria-label="Open command palette"
                            className="flex items-center gap-1.5 text-[10px] opacity-40 hover:opacity-100 transition-opacity duration-200 px-2 py-1 border rounded"
                            style={{ borderColor: 'var(--border-tag)' }}
                        >
                            <Command size={10} />
                            <span>K</span>
                        </button>
                        <AdminIndicator />
                        <ThemeToggle />
                    </div>

                    <div className="md:hidden flex items-center gap-3">
                        <AdminIndicator />
                        <ThemeToggle />
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="opacity-60 hover:opacity-100 transition-opacity"
                            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                        >
                            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>

                {isMenuOpen && (
                    <div className="md:hidden mt-6 pb-4 border-t pt-4 space-y-3" style={{ borderColor: 'var(--border-primary)' }}>
                        {menuItems.map((item) => (
                            <a
                                key={item.name}
                                href={item.href}
                                className={`block text-sm transition-opacity py-1 ${isActive(item) ? 'opacity-100' : 'opacity-40 hover:opacity-100'}`}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {item.name}
                            </a>
                        ))}
                    </div>
                )}
            </nav>
        </header>
    )
}

export default Header
