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
                x: index % 2 === 0 ? -80 : 80,
                scale: 0.8
            }}
            whileInView={{
                opacity: 1,
                x: 0,
                scale: 1
            }}
            transition={{
                duration: 0.8,
                delay: index * 0.2,
                ease: "easeOut"
            }}
            viewport={{ once: true }}
            className={`flex items-center mb-16 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
        >
            <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="glass-effect p-6 rounded-lg card-hover"
                >
                    <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
                    <h4 className="text-lg text-blue-300 mb-2">{company}</h4>
                    <p className="text-sm text-gray-300 mb-4">{period}</p>
                    <div className="text-gray-200 text-sm leading-relaxed">
                        {description}
                    </div>
                    {technologies && (
                        <div className="mt-4 flex flex-wrap gap-2">
                            {technologies.map((tech) => (
                                <span
                                    key={tech}
                                    className="px-2 py-1 bg-blue-600/30 text-blue-200 rounded text-xs"
                                >
                                    {tech}
                                </span>
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>

            <div className="relative flex items-center justify-center w-8">
                <motion.div
                    className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full border-4 border-white shadow-xl z-10 relative"
                    whileInView={{
                        scale: [1, 1.3, 1],
                        boxShadow: [
                            "0 0 0 0 rgba(59, 130, 246, 0.4)",
                            "0 0 20px 10px rgba(59, 130, 246, 0.1)",
                            "0 0 0 0 rgba(59, 130, 246, 0.4)"
                        ]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: index * 0.3
                    }}
                    viewport={{ once: true }}
                >
                    <motion.div
                        className="absolute inset-1 bg-white rounded-full"
                        animate={{
                            scale: [0.8, 1, 0.8],
                            opacity: [0.6, 1, 0.6]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: index * 0.3
                        }}
                    />
                </motion.div>
                <motion.div
                    className="absolute w-px bg-gradient-to-b from-blue-400 to-purple-500 top-6 h-20"
                    initial={{ height: 0 }}
                    whileInView={{ height: 80 }}
                    transition={{ duration: 0.8, delay: index * 0.2 + 0.3 }}
                    viewport={{ once: true }}
                />
            </div>

            <div className="w-1/2"></div>
        </motion.div>
    )
}

interface TimelineProps {
    items: Omit<TimelineItemProps, 'index'>[]
}

const Timeline = ({ items }: TimelineProps) => {
    return (
        <div className="relative">
            {/* Enhanced central timeline */}
            <motion.div
                className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-transparent via-blue-400 to-transparent"
                initial={{ height: 0 }}
                whileInView={{ height: "100%" }}
                transition={{ duration: 2, ease: "easeInOut" }}
                viewport={{ once: true }}
            />

            {/* Glowing effect for the timeline */}
            <motion.div
                className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-500/20 via-purple-500/30 to-blue-500/20 blur-sm"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1.5, delay: 0.5 }}
                viewport={{ once: true }}
            />

            {items.map((item, index) => (
                <TimelineItem key={index} {...item} index={index} />
            ))}
        </div>
    )
}

export default Timeline
