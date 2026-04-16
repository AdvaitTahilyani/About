'use client'

import { motion } from 'framer-motion'

interface SkillCardProps {
    category: string
    skills: string[]
    index: number
}

const SkillCard = ({ category, skills, index }: SkillCardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row md:gap-6 py-3 border-t first:border-t-0"
            style={{ borderColor: 'var(--border-subtle)' }}
        >
            <span className="text-xs opacity-25 shrink-0 md:w-36 mb-1 md:mb-0 pt-0.5">
                {category.toLowerCase()}
            </span>
            <div className="flex flex-wrap gap-x-4 gap-y-1">
                {skills.map((skill) => (
                    <span key={skill} className="text-sm opacity-60">
                        {skill}
                    </span>
                ))}
            </div>
        </motion.div>
    )
}

export default SkillCard
