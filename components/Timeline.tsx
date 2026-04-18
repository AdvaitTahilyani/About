'use client'

import { motion } from 'framer-motion'
import { Github } from 'lucide-react'
import { ReactNode } from 'react'

interface TimelineItemProps {
    title: string
    company: string
    period: string
    description: ReactNode
    technologies?: string[]
    githubUrl?: string
    index: number
}

const TimelineItem = ({ title, company, period, description, technologies, githubUrl, index }: TimelineItemProps) => {
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
                {githubUrl && (
                    <a
                        href={githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="opacity-30 hover:opacity-100 transition-opacity duration-200"
                        aria-label={`${company} on GitHub`}
                    >
                        <Github size={14} />
                    </a>
                )}
                <span className="text-xs opacity-25 md:ml-auto shrink-0">{period}</span>
            </div>

            <div className="opacity-60 text-sm leading-relaxed mb-4 max-w-3xl">
                {description}
            </div>

            {technologies && technologies.length > 0 && (
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
