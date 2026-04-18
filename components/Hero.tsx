'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Linkedin, Github, Command, Check, Copy } from 'lucide-react'
import TextScramble from './TextScramble'
import LiveStatus from './LiveStatus'

const EMAIL = 'advaittahilyani@gmail.com'

const Hero = () => {
    const [copied, setCopied] = useState(false)

    const copyEmail = async () => {
        try {
            await navigator.clipboard.writeText(EMAIL)
            setCopied(true)
            window.setTimeout(() => setCopied(false), 1600)
        } catch {}
    }

    return (
        <section className="min-h-[80vh] flex items-center pt-24 relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.035]">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `radial-gradient(var(--dot-color) 1px, transparent 1px)`,
                        backgroundSize: '24px 24px',
                    }}
                />
            </div>

            <div
                aria-hidden
                className="pointer-events-none absolute -top-24 -left-24 w-[420px] h-[420px] rounded-full opacity-[0.06] blur-3xl"
                style={{ background: 'radial-gradient(circle, rgba(120,120,160,1) 0%, transparent 70%)' }}
            />

            <div className="container mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-6 text-sm tracking-wider">
                        <span className="opacity-30">{'>'} whoami</span>
                        <LiveStatus />
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight">
                        <TextScramble text="Advait Tahilyani" duration={900} className="block" />
                    </h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.55 }}
                        transition={{ delay: 0.25, duration: 0.3 }}
                        className="text-lg md:text-xl mb-8 max-w-xl leading-relaxed"
                    >
                        Software engineer &amp; researcher at UIUC.
                        Parallel computing, compilers, and systems.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.35, duration: 0.3 }}
                        className="flex items-center gap-6"
                    >
                        <a
                            href={`mailto:${EMAIL}`}
                            className="opacity-40 hover:opacity-100 transition-opacity duration-200"
                            aria-label="Email"
                        >
                            <Mail size={18} />
                        </a>
                        <a
                            href="https://github.com/AdvaitTahilyani"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="opacity-40 hover:opacity-100 transition-opacity duration-200"
                            aria-label="GitHub"
                        >
                            <Github size={18} />
                        </a>
                        <a
                            href="https://www.linkedin.com/in/advait-tahilyani/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="opacity-40 hover:opacity-100 transition-opacity duration-200"
                            aria-label="LinkedIn"
                        >
                            <Linkedin size={18} />
                        </a>
                        <button
                            type="button"
                            onClick={copyEmail}
                            className="group relative flex items-center gap-2 text-sm opacity-30 hover:opacity-80 transition-opacity duration-200 hidden sm:flex"
                            aria-label="Copy email to clipboard"
                        >
                            <span>{EMAIL}</span>
                            <AnimatePresence mode="wait" initial={false}>
                                {copied ? (
                                    <motion.span
                                        key="check"
                                        initial={{ opacity: 0, scale: 0.7 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.7 }}
                                        transition={{ duration: 0.15 }}
                                        className="flex items-center gap-1 text-[10px] text-emerald-400"
                                    >
                                        <Check size={10} />
                                        copied
                                    </motion.span>
                                ) : (
                                    <motion.span
                                        key="copy"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.15 }}
                                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                    >
                                        <Copy size={10} />
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </button>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.45, duration: 0.3 }}
                        className="mt-10 flex items-center gap-4 text-xs opacity-30"
                    >
                        <span className="inline-block w-2 h-4 bg-current animate-blink" aria-hidden />
                        <span className="hidden sm:flex items-center gap-1.5">
                            press
                            <kbd
                                className="px-1.5 py-0.5 border rounded text-[10px]"
                                style={{ borderColor: 'var(--border-tag)' }}
                            >
                                <Command size={9} className="inline mb-0.5" /> K
                            </kbd>
                            to jump anywhere
                        </span>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    )
}

export default Hero
