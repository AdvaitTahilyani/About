'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface TimelineItemProps {
    title: string
    company: string
    period: string
    description: ReactNode
    technologies?: string[]
    index: number
}

const TimelineItem = ({ title, company, period, description, technologies, index }: TimelineItemProps) => {
    return (
        <motion.div
            initial={{
                opacity: 0,
                x: -50,
                scale: 0.95
            }}
            whileInView={{
                opacity: 1,
                x: 0,
                scale: 1
            }}
            transition={{
                duration: 0.6,
                delay: index * 0.15,
                ease: "easeOut"
            }}
            viewport={{ once: true }}
            className={`flex items-center mb-16 flex-row ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
        >
            <div className={`w-full md:w-1/2 pl-8 text-left ${index % 2 === 0 ? 'md:pr-8 md:text-right md:pl-0' : 'md:pl-8 md:text-left'}`}>
                <motion.div
                    whileHover={{ scale: 1.01 }}
                    className="glass-effect p-6 rounded-lg card-hover"
                >
                    <h3 className="text-xl font-bold mb-2">{title}</h3>
                    <h4 className="text-lg mb-2">{company}</h4>
                    <p className="text-sm opacity-60 mb-4">{period}</p>
                    <div className="opacity-80 text-sm leading-relaxed">
                        {description}
                    </div>
                    {technologies && (
                        <div className={`mt-4 flex flex-wrap gap-2 justify-start ${index % 2 === 0 ? 'md:justify-end' : 'md:justify-start'}`}>
                            {technologies.map((tech) => (
                                <span
                                    key={tech}
                                    className="px-2 py-1 bg-white/10 border border-white/20 rounded text-xs"
                                >
                                    {tech}
                                </span>
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>

            <div className="relative flex items-center justify-center w-8 shrink-0">
                <motion.div
                    className="w-3 h-3 bg-white dark:bg-white rounded-full border-2 border-white/20 z-10 relative"
                    whileInView={{
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: index * 0.3
                    }}
                    viewport={{ once: true }}
                />
                <motion.div
                    className="absolute w-px bg-white/20 top-6 h-20"
                    initial={{ height: 0 }}
                    whileInView={{ height: 80 }}
                    transition={{ duration: 0.8, delay: index * 0.2 + 0.3 }}
                    viewport={{ once: true }}
                />
            </div>

            <div className="hidden md:block md:w-1/2"></div>
        </motion.div>
    )
}

interface TimelineProps {
    items: Omit<TimelineItemProps, 'index'>[]
}

const Timeline = ({ items }: TimelineProps) => {
    return (
        <div className="relative">
            {/* Minimal central timeline - left on mobile, centered on desktop */}
            <motion.div
                className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 w-px h-full bg-white/10"
                initial={{ height: 0 }}
                whileInView={{ height: "100%" }}
                transition={{ duration: 2, ease: "easeInOut" }}
                viewport={{ once: true }}
            />

            {items.map((item, index) => (
                <TimelineItem key={index} {...item} index={index} />
            ))}
        </div>
    )
}

export default Timeline
