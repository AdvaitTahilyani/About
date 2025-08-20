'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Menu, X, Mail, Linkedin, Github } from 'lucide-react'

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
            className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrollY > 50
                ? 'glass-effect shadow-2xl border-b border-white/10'
                : 'bg-transparent'
                }`}
        >
            <nav className="container mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="text-2xl font-bold text-white"
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
                                whileHover={{
                                    scale: 1.1,
                                    textShadow: "0 0 20px rgba(59, 130, 246, 0.8)"
                                }}
                                className="relative text-white hover:text-blue-300 transition-all duration-300 font-medium group"
                            >
                                {item.name}
                                <motion.div
                                    className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-500"
                                    initial={{ width: 0 }}
                                    whileHover={{ width: "100%" }}
                                    transition={{ duration: 0.3 }}
                                />
                            </motion.a>
                        ))}
                    </div>

                    {/* Social Icons */}
                    <div className="hidden md:flex items-center space-x-4">
                        <motion.a
                            href="mailto:advaittahilyani@gmail.com"
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.8, duration: 0.4 }}
                            whileHover={{
                                scale: 1.3,
                                rotate: 10,
                                boxShadow: "0 0 20px rgba(59, 130, 246, 0.6)"
                            }}
                            className="p-2 text-white hover:text-blue-300 transition-all duration-300 rounded-full hover:bg-white/10"
                        >
                            <Mail size={18} />
                        </motion.a>
                        <motion.a
                            href="https://www.linkedin.com/in/advait-tahilyani/"
                            target="_blank"
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.9, duration: 0.4 }}
                            whileHover={{
                                scale: 1.3,
                                rotate: 10,
                                boxShadow: "0 0 20px rgba(59, 130, 246, 0.6)"
                            }}
                            className="p-2 text-white hover:text-blue-300 transition-all duration-300 rounded-full hover:bg-white/10"
                        >
                            <Linkedin size={18} />
                        </motion.a>
                        <motion.a
                            href="https://github.com/AdvaitTahilyani"
                            target="_blank"
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 1.0, duration: 0.4 }}
                            whileHover={{
                                scale: 1.3,
                                rotate: 10,
                                boxShadow: "0 0 20px rgba(59, 130, 246, 0.6)"
                            }}
                            className="p-2 text-white hover:text-blue-300 transition-all duration-300 rounded-full hover:bg-white/10"
                        >
                            <Github size={18} />
                        </motion.a>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-white"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
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
                                className="block text-white hover:text-blue-300 transition-colors py-2"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {item.name}
                            </a>
                        ))}
                        <div className="flex space-x-4 pt-4">
                            <a href="mailto:advaittahilyani@gmail.com" className="text-white hover:text-blue-300">
                                <Mail size={20} />
                            </a>
                            <a href="https://www.linkedin.com/in/advait-tahilyani/" target="_blank" className="text-white hover:text-blue-300">
                                <Linkedin size={20} />
                            </a>
                            <a href="https://github.com/AdvaitTahilyani" target="_blank" className="text-white hover:text-blue-300">
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
