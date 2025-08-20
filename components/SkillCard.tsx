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
            initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
            whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: "easeOut"
            }}
            viewport={{ once: true }}
            whileHover={{
                scale: 1.05,
                rotateY: 5,
                transition: { duration: 0.3 }
            }}
            className="glass-effect p-6 rounded-xl card-hover group relative overflow-hidden shadow-card"
        >
            {/* Animated background gradient */}
            <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500"
                style={{
                    background: 'linear-gradient(135deg, #667eea, #764ba2, #f093fb)',
                    backgroundSize: '200% 200%',
                }}
                animate={{
                    backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
                }}
                transition={{
                    duration: 4,
                    ease: 'linear',
                    repeat: Infinity,
                }}
            />

            <div className="relative z-10">
                <motion.h3
                    className="text-lg font-bold text-white mb-4 text-center group-hover:text-blue-300 transition-colors"
                    whileHover={{ scale: 1.05 }}
                >
                    {category}
                </motion.h3>
                <div className="space-y-3">
                    {skills.map((skill, skillIndex) => (
                        <motion.div
                            key={skill}
                            initial={{ opacity: 0, x: -30, scale: 0.8 }}
                            whileInView={{ opacity: 1, x: 0, scale: 1 }}
                            transition={{
                                delay: (index * 0.1) + (skillIndex * 0.08),
                                duration: 0.5,
                                ease: "easeOut"
                            }}
                            viewport={{ once: true }}
                            whileHover={{ x: 5, scale: 1.02 }}
                            className="flex items-center group/skill cursor-pointer"
                        >
                            <motion.div
                                className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mr-3 group-hover/skill:shadow-glow"
                                animate={{
                                    scale: [1, 1.2, 1],
                                    boxShadow: [
                                        "0 0 0 rgba(59, 130, 246, 0)",
                                        "0 0 20px rgba(59, 130, 246, 0.6)",
                                        "0 0 0 rgba(59, 130, 246, 0)"
                                    ]
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    delay: skillIndex * 0.3
                                }}
                            />
                            <span className="text-gray-200 text-sm font-medium group-hover/skill:text-white transition-colors duration-200">
                                {skill}
                            </span>

                            {/* Skill proficiency bar */}
                            <motion.div
                                className="ml-auto w-16 h-1 bg-gray-600 rounded-full overflow-hidden"
                                initial={{ width: 0 }}
                                whileInView={{ width: 64 }}
                                transition={{ delay: (index * 0.1) + (skillIndex * 0.08) + 0.3 }}
                                viewport={{ once: true }}
                            >
                                <motion.div
                                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                                    initial={{ width: "0%" }}
                                    whileInView={{ width: `${75 + Math.random() * 25}%` }}
                                    transition={{
                                        delay: (index * 0.1) + (skillIndex * 0.08) + 0.5,
                                        duration: 1,
                                        ease: "easeOut"
                                    }}
                                    viewport={{ once: true }}
                                />
                            </motion.div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    )
}

export default SkillCard
