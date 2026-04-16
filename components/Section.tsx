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
        <section id={id} className={`py-12 md:py-16 ${className}`}>
            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-xs font-medium opacity-30 mb-8 tracking-widest uppercase">
                        // {title}
                    </h2>
                    {children}
                </motion.div>
            </div>
        </section>
    )
}

export default Section
