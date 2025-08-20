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
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
            className="glass-effect p-6 rounded-lg card-hover"
        >
            <h3 className="text-lg font-semibold text-white mb-4 text-center">
                {category}
            </h3>
            <div className="space-y-2">
                {skills.map((skill, skillIndex) => (
                    <motion.div
                        key={skill}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: (index * 0.1) + (skillIndex * 0.05) }}
                        viewport={{ once: true }}
                        className="flex items-center"
                    >
                        <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                        <span className="text-gray-200 text-sm">{skill}</span>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    )
}

export default SkillCard
