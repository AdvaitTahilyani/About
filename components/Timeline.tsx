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
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            viewport={{ once: true }}
            className={`pb-8 ${index > 0 ? 'border-t pt-8' : ''}`}
            style={index > 0 ? { borderColor: 'var(--border-primary)' } : undefined}
        >
            <div className="flex flex-col md:flex-row md:items-baseline md:gap-4 mb-3">
                <h3 className="text-lg font-semibold">{company}</h3>
                <span className="text-sm opacity-40">{title}</span>
                <span className="text-xs opacity-25 md:ml-auto shrink-0">{period}</span>
            </div>

            <div className="opacity-60 text-sm leading-relaxed mb-4 max-w-3xl">
                {description}
            </div>

            {technologies && (
                <div className="flex flex-wrap gap-2">
                    {technologies.map((tech) => (
                        <span
                            key={tech}
                            className="px-2 py-0.5 border rounded text-xs opacity-40"
                            style={{ borderColor: 'var(--border-tag)' }}
                        >
                            {tech}
                        </span>
                    ))}
                </div>
            )}
        </motion.div>
    )
}

interface TimelineProps {
    items: Omit<TimelineItemProps, 'index'>[]
}

const Timeline = ({ items }: TimelineProps) => {
    return (
        <div className="max-w-3xl">
            {items.map((item, index) => (
                <TimelineItem key={index} {...item} index={index} />
            ))}
        </div>
    )
}

export default Timeline
