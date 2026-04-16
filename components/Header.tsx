'use client'

import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import ThemeToggle from './ThemeToggle'
import AdminIndicator from './AdminIndicator'

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const menuItems = [
        { name: 'experience', href: '/#experience' },
        { name: 'research', href: '/#research' },
        { name: 'projects', href: '/#projects' },
        { name: 'education', href: '/#education' },
        { name: 'chess', href: '/chess' },
        { name: 'snake', href: '/nand2tetris-snake' },
        { name: 'shell', href: '/toy-shell' },
    ]

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
                        {menuItems.map((item) => (
                            <a
                                key={item.name}
                                href={item.href}
                                className="text-xs opacity-40 hover:opacity-100 transition-opacity duration-200"
                            >
                                {item.name}
                            </a>
                        ))}
                    </div>

                    <div className="hidden md:flex items-center gap-3">
                        <AdminIndicator />
                        <ThemeToggle />
                    </div>

                    <div className="md:hidden flex items-center gap-3">
                        <AdminIndicator />
                        <ThemeToggle />
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="opacity-60 hover:opacity-100 transition-opacity"
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
                                className="block text-sm opacity-40 hover:opacity-100 transition-opacity py-1"
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
