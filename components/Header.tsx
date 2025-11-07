'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Menu, X, Mail, Linkedin, Github } from 'lucide-react'
import ThemeToggle from './ThemeToggle'

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [scrollY, setScrollY] = useState(0)

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const menuItems = [
        { name: 'About', href: '#about' },
        { name: 'Experience', href: '#experience' },
        { name: 'Research', href: '#research' },
        { name: 'Education', href: '#education' },
        { name: 'Projects', href: '#projects' },
        { name: 'Skills', href: '#skills' },
        { name: 'Contact', href: '#contact' }
    ]

    return (
        <motion.header
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrollY > 50
                ? 'glass-effect border-b border-white/10'
                : 'bg-transparent'
                }`}
        >
            <nav className="container mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="text-2xl font-bold"
                    >
                        AT
                    </motion.div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        {menuItems.map((item, index) => (
                            <motion.a
                                key={item.name}
                                href={item.href}
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 * index, duration: 0.5 }}
                                whileHover={{ scale: 1.05 }}
                                className="relative opacity-60 hover:opacity-100 transition-all duration-300 font-medium text-sm"
                            >
                                {item.name}
                            </motion.a>
                        ))}
                    </div>

                    {/* Social Icons and Theme Toggle */}
                    <div className="hidden md:flex items-center space-x-3">
                        <motion.a
                            href="mailto:advaittahilyani@gmail.com"
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.8, duration: 0.4 }}
                            whileHover={{ scale: 1.1 }}
                            className="p-2 opacity-60 hover:opacity-100 transition-all duration-300"
                        >
                            <Mail size={18} />
                        </motion.a>
                        <motion.a
                            href="https://www.linkedin.com/in/advait-tahilyani/"
                            target="_blank"
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.9, duration: 0.4 }}
                            whileHover={{ scale: 1.1 }}
                            className="p-2 opacity-60 hover:opacity-100 transition-all duration-300"
                        >
                            <Linkedin size={18} />
                        </motion.a>
                        <motion.a
                            href="https://github.com/AdvaitTahilyani"
                            target="_blank"
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 1.0, duration: 0.4 }}
                            whileHover={{ scale: 1.1 }}
                            className="p-2 opacity-60 hover:opacity-100 transition-all duration-300"
                        >
                            <Github size={18} />
                        </motion.a>
                        <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 1.1, duration: 0.4 }}
                        >
                            <ThemeToggle />
                        </motion.div>
                    </div>

                    {/* Mobile Menu Button and Theme Toggle */}
                    <div className="md:hidden flex items-center space-x-3">
                        <ThemeToggle />
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden mt-4 space-y-4"
                    >
                        {menuItems.map((item) => (
                            <a
                                key={item.name}
                                href={item.href}
                                className="block opacity-60 hover:opacity-100 transition-all py-2 text-sm"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {item.name}
                            </a>
                        ))}
                        <div className="flex space-x-4 pt-4">
                            <a href="mailto:advaittahilyani@gmail.com" className="opacity-60 hover:opacity-100 transition-all">
                                <Mail size={20} />
                            </a>
                            <a href="https://www.linkedin.com/in/advait-tahilyani/" target="_blank" className="opacity-60 hover:opacity-100 transition-all">
                                <Linkedin size={20} />
                            </a>
                            <a href="https://github.com/AdvaitTahilyani" target="_blank" className="opacity-60 hover:opacity-100 transition-all">
                                <Github size={20} />
                            </a>
                        </div>
                    </motion.div>
                )}
            </nav>
        </motion.header>
    )
}

export default Header
