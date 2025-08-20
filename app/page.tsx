'use client'

import Header from '@/components/Header'
import Hero from '@/components/Hero'
import Section from '@/components/Section'
import Timeline from '@/components/Timeline'
import ProjectCard from '@/components/ProjectCard'
import SkillCard from '@/components/SkillCard'
import { motion } from 'framer-motion'
import { Mail, Linkedin, Github, MapPin, GraduationCap } from 'lucide-react'

export default function Home() {
    const workExperience = [
        {
            title: "Research Intern",
            company: "Parallel Programming Lab",
            period: "April 2025 – Present",
            description: (
                <ul className="space-y-2">
                    <li>• Developed LiveViz, enabling real-time aggregated visualizations across distributed computing nodes within Charm++</li>
                    <li>• Enhanced a Charm++-based NumPy abstraction by implementing intuitive unary, binary, and ternary operators</li>
                    <li>• Contributed to Reconverse, a comprehensive rewrite of Charm++'s core infrastructure</li>
                </ul>
            ),
            technologies: ["Charm++", "C++", "Distributed Computing", "NumPy", "Visualization"]
        },
        {
            title: "Software Development Intern",
            company: "Glance",
            period: "June 2024 – August 2024",
            description: (
                <ul className="space-y-2">
                    <li>• Developed full-stack web solutions using Java, React, Redis, and PostgreSQL</li>
                    <li>• Deployed new features and improvements to Glance's e-commerce platform handling 4.5M+ monthly transactions</li>
                    <li>• Created efficient search autocomplete implementation and intuitive UI for the feature</li>
                    <li>• Enhanced system configuration with Confluent for Kafka to enable streamlined processes</li>
                </ul>
            ),
            technologies: ["Java", "React", "Redis", "PostgreSQL", "Kafka", "Confluent"]
        },
        {
            title: "Tech Consulting Intern",
            company: "Ernst & Young LLP",
            period: "June 2022",
            description: (
                <ul className="space-y-2">
                    <li>• Utilized MS Dynamics 365 to enhance a client's customer service system</li>
                    <li>• Developed a machine learning model that analyzes emails and assigns support cases with 89% accuracy</li>
                    <li>• Pinpointed weaknesses in Dynamics 365's model training process and underlying neural network architecture</li>
                    <li>• Presented findings to be relayed to Microsoft to help improve model accuracy and streamline training</li>
                </ul>
            ),
            technologies: ["MS Dynamics 365", "Machine Learning", "Neural Networks", "Email Analysis"]
        },
        {
            title: "Virtual Student Developer",
            company: "Microsoft Technology Center",
            period: "June 2021",
            description: (
                <ul className="space-y-2">
                    <li>• Utilized Microsoft's Custom Vision program and developed a TensorFlow model to identify lettuce plants</li>
                    <li>• Assessed whether plants are healthy or infected with 95% precision to control disease spread</li>
                    <li>• Incorporated features such as converting coordinates into rows and columns for easy interpretation</li>
                    <li>• Outputted all relevant information as a JSON to integrate into future apps and increase user-friendliness</li>
                </ul>
            ),
            technologies: ["TensorFlow", "Custom Vision", "Computer Vision", "JSON", "Agricultural Tech"]
        }
    ]

    const researchExperience = [
        {
            title: "Research Assistant",
            company: "Adapt Lab",
            period: "May 2025 – Present",
            description: (
                <ul className="space-y-2">
                    <li>• Designed a rule-based DNN operator fusion layer for Google's XLA compiler (Accelerated Linear Algebra)</li>
                    <li>• Used mapping-type taxonomy, reducing compilation latency and significantly improving element-wise kernel performance</li>
                </ul>
            ),
            technologies: ["XLA", "DNN", "Compiler Optimization", "Google", "Kernel Performance"]
        },
        {
            title: "Research Assistant",
            company: "Shajahan Lab",
            period: "January 2025 – May 2025",
            description: (
                <ul className="space-y-2">
                    <li>• Trained a YOLOv8 segmentation model to detect corn ears in agricultural footage</li>
                    <li>• Achieved high-confidence predictions and implemented an object tracking system that counts corn ears in video sequences</li>
                    <li>• Developed automated yield estimation system for agricultural applications</li>
                </ul>
            ),
            technologies: ["YOLOv8", "Computer Vision", "Object Tracking", "Agricultural AI", "Yield Estimation"]
        }
    ]

    const projects = [
        {
            title: "CS 124 Tutor",
            description: "Host office hours, assisting over 200 students by clarifying concepts and debugging programs. Help teach Kotlin fundamentals as well as Android App development concepts to students.",
            period: "January 2024 – Present",
            technologies: ["Kotlin", "Android Development", "Teaching", "Debugging"]
        },
        {
            title: "Illinois Semiconductor Student Alliance",
            description: "Developed an interactive 3D game in Unity to educate high school students about the semiconductor manufacturing process. Designed and implemented a Radio Frequency (RF) transceiver using Bipolar Junction Transistors (BJTs).",
            period: "August 2024 – Present",
            technologies: ["Unity", "3D Game Development", "RF Design", "BJTs", "Education"]
        },
        {
            title: "Nand2Tetris",
            description: "Constructed simulated components including the CPU and compiler from scratch for the Nand2Tetris course. Designed a primitive version of the Snake game using a custom-created programming language.",
            period: "May 2024 - Present",
            technologies: ["Computer Architecture", "Compiler Design", "Assembly", "Game Development"]
        },
        {
            title: "NoteTaker",
            description: "Developed a Swift app integrating Whisper and Phi-3 for local transcription and summarization of recordings. Expanded it to run on a RPi server where users can upload recordings and have summaries uploaded to their Google Drive.",
            period: "January 2024 – May 2025",
            technologies: ["Swift", "Whisper", "Phi-3", "Raspberry Pi", "Google Drive API"]
        },
        {
            title: "Hack Illinois - Roomie Match",
            description: "Developed a web app designed for college freshmen to find compatible roommates. Implemented advanced features using React, including filters, chat, and recommendation systems.",
            period: "February 2024",
            technologies: ["React", "Web Development", "Recommendation Systems", "Real-time Chat"]
        },
        {
            title: "Aether",
            description: "Developed a fully functional AI-powered email client emphasizing privacy and convenience using React Native and Postgres. Leveraged a lightweight local LLM to provide quick summaries, context-sensitive responses, and intelligent search offline.",
            period: "February 2025",
            technologies: ["React Native", "PostgreSQL", "Local LLM", "AI", "Privacy-focused"]
        }
    ]

    const skills = [
        {
            category: "Programming Languages",
            skills: ["C++", "C", "Java", "JavaScript", "Python", "Kotlin", "Swift", "TypeScript"]
        },
        {
            category: "Frameworks & Libraries",
            skills: ["React", "React Native", "Node.js", "Express", "Next.js", "TensorFlow", "Unity"]
        },
        {
            category: "Databases & Tools",
            skills: ["PostgreSQL", "Redis", "MongoDB", "Git", "Docker", "Kafka", "ElasticSearch"]
        },
        {
            category: "Specializations",
            skills: ["Machine Learning", "Computer Vision", "Distributed Systems", "Compiler Design", "Mobile Development"]
        }
    ]

    return (
        <main className="min-h-screen">
            <Header />
            <Hero />

            <Section id="about" title="About Me">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="glass-effect p-8 rounded-lg mb-12"
                    >
                        <div className="grid md:grid-cols-2 gap-8 items-center">
                            <div>
                                <h3 className="text-2xl font-bold text-white mb-4">
                                    <GraduationCap className="inline mr-2" size={24} />
                                    Education
                                </h3>
                                <div className="space-y-2 text-gray-200">
                                    <p className="text-lg font-semibold">University of Illinois at Urbana-Champaign</p>
                                    <p>Bachelor of Science in Computer Science</p>
                                    <p>Minor in Electrical Engineering</p>
                                    <p className="text-sm text-gray-300">Graduating May 2027 • GPA – 3.98</p>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-white mb-4">
                                    <MapPin className="inline mr-2" size={24} />
                                    Contact
                                </h3>
                                <div className="space-y-2 text-gray-200">
                                    <p>+1 217 372 8738</p>
                                    <p>advaittahilyani@gmail.com</p>
                                    <div className="flex space-x-4 mt-4">
                                        <a href="https://www.linkedin.com/in/advait-tahilyani/" target="_blank" className="text-blue-400 hover:text-blue-300">
                                            <Linkedin size={20} />
                                        </a>
                                        <a href="https://github.com/AdvaitTahilyani" target="_blank" className="text-blue-400 hover:text-blue-300">
                                            <Github size={20} />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="text-center"
                    >
                        <p className="text-lg text-gray-200 leading-relaxed mb-8">
                            I'm a passionate Computer Science student at the University of Illinois at Urbana-Champaign,
                            specializing in software engineering, machine learning, and distributed systems. My experience
                            spans from developing high-performance computing solutions to creating user-friendly mobile applications.
                        </p>
                        <p className="text-lg text-gray-200 leading-relaxed">
                            Currently, I'm advancing research in parallel programming frameworks and compiler optimization
                            while maintaining a strong focus on practical applications that solve real-world problems.
                        </p>
                    </motion.div>
                </div>
            </Section>

            <Section id="experience" title="Work Experience">
                <Timeline items={workExperience} />
            </Section>

            <Section id="research" title="Research Experience">
                <Timeline items={researchExperience} />
            </Section>

            <Section id="projects" title="Projects & Leadership">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project, index) => (
                        <ProjectCard key={index} {...project} index={index} />
                    ))}
                </div>
            </Section>

            <Section id="skills" title="Technical Skills">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {skills.map((skillCategory, index) => (
                        <SkillCard key={index} {...skillCategory} index={index} />
                    ))}
                </div>
            </Section>

            <Section id="contact" title="Let's Connect">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="max-w-2xl mx-auto text-center"
                >
                    <div className="glass-effect p-8 rounded-lg">
                        <p className="text-lg text-gray-200 mb-8">
                            I'm always interested in discussing new opportunities, innovative projects,
                            and potential collaborations. Feel free to reach out!
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <motion.a
                                href="mailto:advaittahilyani@gmail.com"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                            >
                                <Mail className="mr-2" size={20} />
                                Send Email
                            </motion.a>
                            <motion.a
                                href="https://www.linkedin.com/in/advait-tahilyani/"
                                target="_blank"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center justify-center px-6 py-3 border-2 border-white text-white rounded-full hover:bg-white hover:text-gray-900 transition-all"
                            >
                                <Linkedin className="mr-2" size={20} />
                                LinkedIn
                            </motion.a>
                        </div>
                    </div>
                </motion.div>
            </Section>

            <footer className="bg-black/20 backdrop-blur-sm py-8">
                <div className="container mx-auto px-6 text-center">
                    <p className="text-gray-300">
                        © 2024 Advait Tahilyani. Built with Next.js and deployed on Vercel.
                    </p>
                </div>
            </footer>
        </main>
    )
}
