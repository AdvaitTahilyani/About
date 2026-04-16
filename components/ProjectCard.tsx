'use client'

import { motion } from 'framer-motion'
import { ExternalLink, Github } from 'lucide-react'

interface ProjectCardProps {
    title: string
    description: string
    technologies: string[]
    period: string
    githubUrl?: string
    liveUrl?: string
    index: number
    featured?: boolean
}

const ProjectCard = ({ title, description, technologies, period, githubUrl, liveUrl, index, featured }: ProjectCardProps) => {
    if (featured) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="terminal-border rounded-md p-6 md:p-8"
            >
                <div className="flex flex-col md:flex-row md:items-baseline md:justify-between mb-3">
                    <h3 className="text-xl font-semibold">{title}</h3>
                    <span className="text-xs opacity-25">{period}</span>
                </div>

                <p className="opacity-50 text-sm leading-relaxed mb-4 max-w-2xl">
                    {description}
                </p>

                <div className="flex flex-wrap gap-2 mb-5">
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

                <div className="flex items-center gap-4">
                    {liveUrl && (
                        <a
                            href={liveUrl}
                            className="flex items-center gap-1.5 text-sm opacity-60 hover:opacity-100 transition-opacity duration-200"
                        >
                            <ExternalLink size={14} />
                            try it live
                        </a>
                    )}
                    {githubUrl && (
                        <a
                            href={githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-sm opacity-60 hover:opacity-100 transition-opacity duration-200"
                        >
                            <Github size={14} />
                            source
                        </a>
                    )}
                </div>
            </motion.div>
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row md:items-baseline gap-1 md:gap-4 py-3 border-t first:border-t-0"
            style={{ borderColor: 'var(--border-subtle)' }}
        >
            <h3 className="text-sm font-medium shrink-0">{title}</h3>
            <p className="text-sm opacity-40 flex-1 truncate">{description}</p>
            <div className="flex items-center gap-3 shrink-0">
                {(githubUrl || liveUrl) && (
                    <div className="flex items-center gap-2">
                        {liveUrl && (
                            <a
                                href={liveUrl}
                                className="opacity-40 hover:opacity-100 transition-opacity duration-200"
                            >
                                <ExternalLink size={12} />
                            </a>
                        )}
                        {githubUrl && (
                            <a
                                href={githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="opacity-40 hover:opacity-100 transition-opacity duration-200"
                            >
                                <Github size={12} />
                            </a>
                        )}
                    </div>
                )}
                <span className="text-xs opacity-20">{period}</span>
            </div>
        </motion.div>
    )
}

export default ProjectCard
