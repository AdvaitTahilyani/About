'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { ChevronDown } from 'lucide-react'

const Hero = () => {
    const [text, setText] = useState('')
    const fullText = "Software Engineer & Researcher"

    useEffect(() => {
        let i = 0
        const timer = setInterval(() => {
            setText(fullText.slice(0, i))
            i++
            if (i > fullText.length) {
                clearInterval(timer)
            }
        }, 100)

        return () => clearInterval(timer)
    }, [])

    return (
        <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
            {/* Enhanced Animated Background Elements */}
            <div className="absolute inset-0">
                {/* Primary floating orbs */}
                <motion.div
                    animate={{
                        x: [0, 150, -50, 0],
                        y: [0, -120, 80, 0],
                        scale: [1, 1.2, 0.8, 1],
                    }}
                    transition={{
                        duration: 25,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-20 blur-3xl floating-1"
                />
                <motion.div
                    animate={{
                        x: [0, -120, 100, 0],
                        y: [0, 150, -80, 0],
                        scale: [1, 0.7, 1.3, 1],
                    }}
                    transition={{
                        duration: 30,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full opacity-15 blur-3xl floating-2"
                />

                {/* Secondary accent orbs */}
                <motion.div
                    animate={{
                        x: [0, 80, -60, 0],
                        y: [0, -90, 120, 0],
                        rotate: [0, 180, 360],
                    }}
                    transition={{
                        duration: 35,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="absolute top-1/2 right-1/3 w-48 h-48 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full opacity-25 blur-2xl"
                />
                <motion.div
                    animate={{
                        x: [0, -70, 90, 0],
                        y: [0, 110, -70, 0],
                        rotate: [360, 180, 0],
                    }}
                    transition={{
                        duration: 40,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="absolute bottom-1/2 left-1/3 w-56 h-56 bg-gradient-to-r from-indigo-400 to-purple-600 rounded-full opacity-20 blur-2xl"
                />

                {/* Particle effects */}
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        animate={{
                            y: [-20, -100, -20],
                            opacity: [0, 1, 0],
                            scale: [0, 1, 0],
                        }}
                        transition={{
                            duration: 4 + i,
                            repeat: Infinity,
                            delay: i * 0.7,
                            ease: "easeInOut"
                        }}
                        className={`absolute w-2 h-2 bg-white rounded-full opacity-40`}
                        style={{
                            left: `${20 + i * 15}%`,
                            top: `${60 + (i % 3) * 10}%`,
                        }}
                    />
                ))}
            </div>

            <div className="container mx-auto px-6 text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <motion.h1
                        className="text-6xl md:text-8xl font-bold text-white mb-6 relative"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                    >
                        <motion.span
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                            className="block"
                        >
                            ADVAIT
                        </motion.span>
                        <motion.span
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                            className="block gradient-text drop-shadow-lg"
                        >
                            TAHILYANI
                        </motion.span>

                        {/* Glowing accent behind text */}
                        <motion.div
                            animate={{
                                scale: [1, 1.1, 1],
                                opacity: [0.3, 0.6, 0.3]
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-3xl -z-10"
                        />
                    </motion.h1>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 1 }}
                        className="text-xl md:text-2xl text-gray-200 mb-8 h-8"
                    >
                        {text}
                        <motion.span
                            animate={{ opacity: [1, 0] }}
                            transition={{ duration: 0.8, repeat: Infinity }}
                            className="text-blue-400"
                        >
                            |
                        </motion.span>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1, duration: 0.8 }}
                        className="text-lg text-gray-300 max-w-2xl mx-auto mb-12 leading-relaxed"
                    >
                        Computer Science student from UIUC with expertise in full-stack development,
                        machine learning, and high-performance computing. Currently advancing research
                        in parallel programming and compiler optimization.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.5, duration: 0.8 }}
                        className="flex flex-col sm:flex-row gap-6 justify-center"
                    >
                        <motion.a
                            href="#experience"
                            whileHover={{
                                scale: 1.05,
                                boxShadow: "0 20px 40px rgba(59, 130, 246, 0.4)"
                            }}
                            whileTap={{ scale: 0.95 }}
                            className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full shadow-xl overflow-hidden btn-shine"
                        >
                            <span className="relative z-10 font-semibold flex items-center">
                                View My Work
                                <motion.svg
                                    className="ml-2 w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    whileHover={{ x: 5 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </motion.svg>
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </motion.a>

                        <motion.a
                            href="#contact"
                            whileHover={{
                                scale: 1.05,
                                backgroundColor: "rgba(255, 255, 255, 0.1)"
                            }}
                            whileTap={{ scale: 0.95 }}
                            className="group relative px-8 py-4 border-2 border-white/30 text-white rounded-full shadow-xl backdrop-blur-sm overflow-hidden btn-shine"
                        >
                            <span className="relative z-10 font-semibold flex items-center">
                                Get In Touch
                                <motion.svg
                                    className="ml-2 w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    whileHover={{ rotate: 15 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </motion.svg>
                            </span>
                            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </motion.a>
                    </motion.div>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            >
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-white cursor-pointer"
                    onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
                >
                    <ChevronDown size={32} />
                </motion.div>
            </motion.div>
        </section>
    )
}

export default Hero
