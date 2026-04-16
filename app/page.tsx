'use client'

import Header from '@/components/Header'
import Hero from '@/components/Hero'
import Section from '@/components/Section'
import Timeline from '@/components/Timeline'
import ProjectCard from '@/components/ProjectCard'
import SkillCard from '@/components/SkillCard'
import { motion } from 'framer-motion'
import { Mail, Linkedin, Github } from 'lucide-react'

export default function Home() {
  const workExperience = [
    {
      title: "Incoming Software Development Intern",
      company: "Amazon",
      period: "May 2026 – August 2026",
      description: (
        <ul className="space-y-1.5">
          <li>Incoming SDE intern for Summer 2026</li>
        </ul>
      ),
      technologies: []
    },
    {
      title: "Research Intern",
      company: "Parallel Programming Lab",
      period: "April 2025 – Present",
      description: (
        <ul className="space-y-1.5">
          <li>Architected real-time aggregated visualizations across distributed computing nodes within Charm++</li>
          <li>Extended Charm++-based NumPy abstraction with unary, binary, and ternary operators, improving developer productivity by 40%</li>
          <li>Contributed to Reconverse, a comprehensive rewrite of Charm++'s core infrastructure</li>
          <li>Collaborated with PhD students and faculty on parallel programming research</li>
        </ul>
      ),
      technologies: ["Charm++", "C++", "Distributed Computing", "NumPy", "MPI", "CUDA"]
    },
    {
      title: "Software Development Intern",
      company: "Glance",
      period: "June 2024 – August 2024",
      description: (
        <ul className="space-y-1.5">
          <li>Built web solutions using Java Spring Boot, React.js, Redis, and PostgreSQL, serving 4.5M+ monthly active users</li>
          <li>Deployed features and performance improvements to Roposo Clout e-commerce platform</li>
          <li>Designed search autocomplete with Redis caching, reducing response time by 60%</li>
          <li>Configured Confluent Kafka for real-time data streaming across distributed systems</li>
        </ul>
      ),
      technologies: ["Java", "Spring Boot", "React", "Redis", "PostgreSQL", "Kafka", "Docker", "AWS"]
    },
    {
      title: "Tech Consulting Intern",
      company: "Ernst & Young LLP",
      period: "June 2022",
      description: (
        <ul className="space-y-1.5">
          <li>Led implementation of Microsoft Dynamics 365 for a Fortune 500 client, improving case resolution by 45%</li>
          <li>Designed ML model using NLP to auto-assign support cases with 89% accuracy</li>
          <li>Developed automated workflows reducing manual case assignment by 70%</li>
        </ul>
      ),
      technologies: ["MS Dynamics 365", "Machine Learning", "NLP", "Python", "Azure ML"]
    },
    {
      title: "Virtual Student Developer",
      company: "Microsoft Technology Center",
      period: "June 2021",
      description: (
        <ul className="space-y-1.5">
          <li>Developed TensorFlow model to classify lettuce plants with 95% precision for disease detection</li>
          <li>Designed coordinate transformation system for agricultural field grid mapping</li>
          <li>Created scalable solution to reduce crop loss by 30% through early disease intervention</li>
        </ul>
      ),
      technologies: ["TensorFlow", "Computer Vision", "Python", "OpenCV", "Azure"]
    }
  ]

  const researchExperience = [
    {
      title: "Research Assistant",
      company: "Adapt Lab",
      period: "May 2025 – December 2025",
      description: (
        <ul className="space-y-1.5">
          <li>Designed a rule-based DNN operator fusion layer for Google's XLA compiler</li>
          <li>Used mapping-type taxonomy to reduce compilation latency and improve kernel performance</li>
        </ul>
      ),
      technologies: ["XLA", "DNN", "Compiler Optimization", "Kernel Performance"]
    },
    {
      title: "Research Assistant",
      company: "Shajahan Lab",
      period: "January 2025 – May 2025",
      description: (
        <ul className="space-y-1.5">
          <li>Trained YOLOv8 segmentation model to detect corn ears in agricultural footage</li>
          <li>Implemented object tracking system for automated yield estimation</li>
        </ul>
      ),
      technologies: ["YOLOv8", "Computer Vision", "Object Tracking", "Agricultural AI"]
    }
  ]

  const featuredProjects = [
    {
      title: "Nand2Tetris",
      description: "Constructed a CPU and compiler from scratch. Designed a Snake game using a custom-created programming language, running on a simulated hardware stack.",
      period: "May 2024 – Present",
      technologies: ["Computer Architecture", "Compiler Design", "Assembly", "Game Development"],
      liveUrl: "/nand2tetris-snake"
    },
    {
      title: "Aether",
      description: "AI-powered email client emphasizing privacy. Uses a lightweight local LLM for summaries, context-sensitive responses, and intelligent offline search.",
      period: "February 2025",
      technologies: ["React Native", "PostgreSQL", "Local LLM", "AI", "Privacy-focused"]
    },
    {
      title: "Toy Shell",
      description: "Browser-safe port of my CS 341 shell. Includes history, path navigation, redirection, and a virtual filesystem where visitors can create, inspect, and delete files.",
      period: "Spring 2025",
      technologies: ["C", "Systems Programming", "React", "Sandboxed Filesystem"],
      liveUrl: "/toy-shell"
    }
  ]

  const otherProjects = [
    {
      title: "NoteTaker",
      description: "Swift app with Whisper + Phi-3 for local transcription and summarization, expandable to RPi server with Google Drive sync.",
      period: "Jan 2024 – May 2025",
      technologies: ["Swift", "Whisper", "Phi-3", "Raspberry Pi"]
    },
    {
      title: "Roomie Match",
      description: "HackIllinois web app for college freshmen to find compatible roommates with filters, chat, and recommendations.",
      period: "February 2024",
      technologies: ["React", "Recommendation Systems", "Real-time Chat"]
    },
    {
      title: "Illinois Semiconductor Alliance",
      description: "Software Team Lead. Built wafer-defect classification pipeline using transfer learning with 95% accuracy. Developed 3D Unity game for semiconductor education. Designed RF transceiver using BJTs.",
      period: "Aug 2024 – Present",
      technologies: ["Unity", "Transfer Learning", "3D Game Development", "RF Design"]
    }
  ]

  const skills = [
    {
      category: "Languages",
      skills: ["C++", "C", "Java", "JavaScript", "Python", "Kotlin", "Swift", "TypeScript"]
    },
    {
      category: "Frameworks",
      skills: ["React", "React Native", "Node.js", "Express", "Next.js", "TensorFlow", "Unity"]
    },
    {
      category: "Tools",
      skills: ["PostgreSQL", "Redis", "MongoDB", "Git", "Docker", "Kafka", "ElasticSearch"]
    },
    {
      category: "Focus Areas",
      skills: ["Machine Learning", "Computer Vision", "Distributed Systems", "Compiler Design", "Mobile Development"]
    }
  ]

  return (
    <main className="min-h-screen">
      <Header />
      <Hero />

      <Section id="about" title="about">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.6 }}
          transition={{ duration: 0.3 }}
          viewport={{ once: true }}
          className="text-sm leading-relaxed max-w-2xl"
        >
          CS student at UIUC with a minor in Electrical Engineering. I build things
          across the stack — from parallel computing frameworks and compiler optimizations
          to mobile apps and ML pipelines. Currently researching at the Parallel Programming
          Lab and Adapt Lab.
        </motion.p>
      </Section>

      <Section id="experience" title="experience">
        <Timeline items={workExperience} />
      </Section>

      <Section id="research" title="research">
        <Timeline items={researchExperience} />
      </Section>

      <Section id="projects" title="projects">
        <div className="space-y-4 mb-10">
          {featuredProjects.map((project, index) => (
            <ProjectCard key={project.title} {...project} index={index} featured={true} />
          ))}
        </div>

        <div>
          {otherProjects.map((project, index) => (
            <ProjectCard key={project.title} {...project} index={index} />
          ))}
        </div>
      </Section>

      <Section id="education" title="education">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          viewport={{ once: true }}
          className="max-w-3xl"
        >
          <h3 className="text-lg font-semibold mb-1">University of Illinois at Urbana-Champaign</h3>
          <p className="text-sm opacity-50 mb-2">B.S. Computer Science, Minor in Electrical Engineering</p>
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs opacity-30">
            <span>GPA: 3.98</span>
            <span>Expected May 2027</span>
            <span>James Scholar Honors</span>
            <span>Dean's List</span>
          </div>
          <div className="mt-4 text-sm opacity-40">
            CS 124 Course Tutor (Jan 2024 – Dec 2025) — office hours for 200+ students on Kotlin and Android development.
          </div>
        </motion.div>
      </Section>

      <Section id="skills" title="skills">
        <div className="max-w-3xl">
          {skills.map((skillCategory, index) => (
            <SkillCard key={skillCategory.category} {...skillCategory} index={index} />
          ))}
        </div>
      </Section>

      {/* Footer-style contact */}
      <footer className="border-t mt-16" style={{ borderColor: 'var(--border-subtle)' }}>
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <span className="text-xs opacity-25">advait tahilyani</span>
            <div className="flex items-center gap-6">
              <a
                href="mailto:advaittahilyani@gmail.com"
                className="flex items-center gap-1.5 text-xs opacity-30 hover:opacity-100 transition-opacity duration-200"
              >
                <Mail size={12} />
                email
              </a>
              <a
                href="https://github.com/AdvaitTahilyani"
                target="_blank"
                className="flex items-center gap-1.5 text-xs opacity-30 hover:opacity-100 transition-opacity duration-200"
              >
                <Github size={12} />
                github
              </a>
              <a
                href="https://www.linkedin.com/in/advait-tahilyani/"
                target="_blank"
                className="flex items-center gap-1.5 text-xs opacity-30 hover:opacity-100 transition-opacity duration-200"
              >
                <Linkedin size={12} />
                linkedin
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
