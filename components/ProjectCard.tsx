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
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="group relative terminal-border rounded-md p-6 md:p-8 transition-all duration-300 hover:-translate-y-0.5"
                style={{ transition: 'transform 300ms ease, border-color 300ms ease, background-color 300ms ease' }}
            >
                <span
                    aria-hidden
                    className="absolute left-0 top-8 h-6 w-0.5 rounded-r opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ backgroundColor: 'var(--border-primary)' }}
                />

                <div className="flex flex-col md:flex-row md:items-baseline md:justify-between mb-3 gap-2">
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                        <span
                            aria-hidden
                            className="opacity-0 -translate-x-2 group-hover:opacity-40 group-hover:translate-x-0 transition-all duration-300 text-base"
                        >
                            {'>'}
                        </span>
                        <span>{title}</span>
                    </h3>
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
            className="group grid gap-x-6 gap-y-1 py-4 border-t first:border-t-0 transition-colors duration-200 md:grid-cols-[minmax(0,11rem)_1fr_auto]"
            style={{ borderColor: 'var(--border-subtle)' }}
        >
            <h3 className="text-sm font-medium flex items-start gap-1.5">
                <span
                    aria-hidden
                    className="opacity-0 -translate-x-1 group-hover:opacity-40 group-hover:translate-x-0 transition-all duration-200 mt-[1px]"
                >
                    {'>'}
                </span>
                <span className="break-words">{title}</span>
            </h3>
            <p className="text-sm opacity-50 leading-relaxed">{description}</p>
            <div className="flex items-center gap-3 md:justify-end">
                {(githubUrl || liveUrl) && (
                    <div className="flex items-center gap-2">
                        {liveUrl && (
                            <a
                                href={liveUrl}
                                className="opacity-40 hover:opacity-100 transition-opacity duration-200"
                                aria-label={`${title} live`}
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
                                aria-label={`${title} on GitHub`}
                            >
                                <Github size={12} />
                            </a>
                        )}
                    </div>
                )}
                <span className="text-xs opacity-25 whitespace-nowrap">{period}</span>
            </div>
        </motion.div>
    )
}

export default ProjectCard
