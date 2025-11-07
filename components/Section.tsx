'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface SectionProps {
    id: string
    title: string
    children: ReactNode
    className?: string
}

const Section = ({ id, title, children, className = '' }: SectionProps) => {
    return (
        <section id={id} className={`py-20 ${className}`}>
            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
                        {title}
                    </h2>
                    {children}
                </motion.div>
            </div>
        </section>
    )
}

export default Section
