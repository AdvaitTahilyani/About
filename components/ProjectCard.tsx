'use client'

import { motion } from 'framer-motion'
import { ExternalLink, Github, Calendar } from 'lucide-react'

interface ProjectCardProps {
    title: string
    description: string
    technologies: string[]
    period: string
    githubUrl?: string
    liveUrl?: string
    index: number
}

const ProjectCard = ({ title, description, technologies, period, githubUrl, liveUrl, index }: ProjectCardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: "easeOut"
            }}
            viewport={{ once: true }}
            whileHover={{
                y: -4,
                transition: { duration: 0.3 }
            }}
            className="glass-effect p-6 rounded-lg card-hover group relative overflow-hidden"
        >
            <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-bold">
                    {title}
                </h3>
                <div className="flex items-center opacity-60 text-sm">
                    <Calendar size={14} className="mr-1" />
                    {period}
                </div>
            </div>

            <p className="opacity-80 text-sm leading-relaxed mb-4">
                {description}
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
                {technologies.map((tech) => (
                    <span
                        key={tech}
                        className="px-2 py-1 bg-white/10 border border-white/20 rounded text-xs"
                    >
                        {tech}
                    </span>
                ))}
            </div>

            <div className="flex space-x-3">
                {githubUrl && (
                    <motion.a
                        href={githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center opacity-60 hover:opacity-100 transition-opacity"
                    >
                        <Github size={16} className="mr-1" />
                        <span className="text-sm">Code</span>
                    </motion.a>
                )}
                {liveUrl && (
                    <motion.a
                        href={liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center opacity-60 hover:opacity-100 transition-opacity"
                    >
                        <ExternalLink size={16} className="mr-1" />
                        <span className="text-sm">Live</span>
                    </motion.a>
                )}
            </div>
        </motion.div>
    )
}

export default ProjectCard
