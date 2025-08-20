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
            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
            className={`flex items-center mb-12 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
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
                <div className="w-4 h-4 bg-blue-500 rounded-full border-4 border-white shadow-lg z-10"></div>
                <div className="absolute w-px h-24 bg-gray-300 top-4"></div>
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
            <div className="absolute left-1/2 transform -translate-x-1/2 w-px h-full bg-gray-300"></div>
            {items.map((item, index) => (
                <TimelineItem key={index} {...item} index={index} />
            ))}
        </div>
    )
}

export default Timeline
