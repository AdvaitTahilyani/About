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
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
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
            <motion.h3
                className="text-lg font-bold mb-4 text-center"
                whileHover={{ scale: 1.02 }}
            >
                {category}
            </motion.h3>
            <div className="space-y-3">
                {skills.map((skill, skillIndex) => (
                    <motion.div
                        key={skill}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{
                            delay: (index * 0.1) + (skillIndex * 0.05),
                            duration: 0.4,
                            ease: "easeOut"
                        }}
                        viewport={{ once: true }}
                        className="flex items-center"
                    >
                        <motion.div
                            className="w-1.5 h-1.5 bg-white rounded-full mr-3"
                        />
                        <span className="text-sm font-medium opacity-80">
                            {skill}
                        </span>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    )
}

export default SkillCard
