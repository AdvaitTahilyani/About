'use client'

import { motion } from 'framer-motion'
import { Mail, Linkedin, Github } from 'lucide-react'

const Hero = () => {
    return (
        <section className="min-h-[70vh] flex items-center pt-24 relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.03]">
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(var(--dot-color) 1px, transparent 1px)`,
                    backgroundSize: '24px 24px'
                }} />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="text-sm opacity-30 mb-6 tracking-wider">
                        {'>'} whoami
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight">
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.1, duration: 0.3 }}
                            className="block"
                        >
                            Advait Tahilyani
                        </motion.span>
                    </h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        transition={{ delay: 0.2, duration: 0.3 }}
                        className="text-lg md:text-xl mb-8 max-w-xl"
                    >
                        Software engineer & researcher at UIUC.
                        Parallel computing, compilers, and systems.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.3 }}
                        className="flex items-center gap-6"
                    >
                        <a
                            href="mailto:advaittahilyani@gmail.com"
                            className="opacity-40 hover:opacity-100 transition-opacity duration-200"
                        >
                            <Mail size={18} />
                        </a>
                        <a
                            href="https://github.com/AdvaitTahilyani"
                            target="_blank"
                            className="opacity-40 hover:opacity-100 transition-opacity duration-200"
                        >
                            <Github size={18} />
                        </a>
                        <a
                            href="https://www.linkedin.com/in/advait-tahilyani/"
                            target="_blank"
                            className="opacity-40 hover:opacity-100 transition-opacity duration-200"
                        >
                            <Linkedin size={18} />
                        </a>
                        <span className="opacity-20 text-sm">
                            advaittahilyani@gmail.com
                        </span>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.3 }}
                        className="mt-6 flex items-center gap-2 text-sm opacity-30"
                    >
                        <span className="inline-block w-2 h-4 bg-white/60 animate-blink" />
                    </motion.div>
                </motion.div>
            </div>
        </section>
    )
}

export default Hero
