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
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
            whileHover={{ y: -8 }}
            className="glass-effect p-6 rounded-lg card-hover group"
        >
            <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors">
                    {title}
                </h3>
                <div className="flex items-center text-gray-400 text-sm">
                    <Calendar size={14} className="mr-1" />
                    {period}
                </div>
            </div>

            <p className="text-gray-200 text-sm leading-relaxed mb-4">
                {description}
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
                {technologies.map((tech) => (
                    <span
                        key={tech}
                        className="px-2 py-1 bg-purple-600/30 text-purple-200 rounded text-xs"
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
                        whileHover={{ scale: 1.1 }}
                        className="flex items-center text-gray-300 hover:text-white transition-colors"
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
                        whileHover={{ scale: 1.1 }}
                        className="flex items-center text-gray-300 hover:text-white transition-colors"
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
