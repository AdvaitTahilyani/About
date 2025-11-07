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
          <li>• <strong>LiveViz Development:</strong> Architected and implemented real-time aggregated visualizations across distributed computing nodes within Charm++, enabling researchers to monitor large-scale parallel applications</li>
          <li>• <strong>NumPy Enhancement:</strong> Extended Charm++-based NumPy abstraction by implementing intuitive unary, binary, and ternary operators, improving developer productivity by 40%</li>
          <li>• <strong>Infrastructure Contribution:</strong> Contributed to Reconverse, a comprehensive rewrite of Charm++'s core infrastructure, significantly improving performance and maintainability</li>
          <li>• <strong>Research Impact:</strong> Collaborated with PhD students and faculty on cutting-edge parallel programming research, contributing to publications and conference presentations</li>
        </ul>
      ),
      technologies: ["Charm++", "C++", "Distributed Computing", "NumPy", "Visualization", "MPI", "CUDA"]
    },
    {
      title: "Software Development Intern",
      company: "Glance",
      period: "June 2024 – August 2024",
      description: (
        <ul className="space-y-2">
          <li>• <strong>Full-Stack Development:</strong> Architected and developed comprehensive web solutions using Java Spring Boot, React.js, Redis, and PostgreSQL, serving 4.5M+ monthly active users</li>
          <li>• <strong>E-commerce Platform:</strong> Deployed critical features and performance improvements to Glance's e-commerce platform (Roposo Clout), directly impacting revenue generation and user experience</li>
          <li>• <strong>Search Implementation:</strong> Designed and implemented an efficient search autocomplete system with Redis caching, reducing search response time by 60% and improving user engagement</li>
          <li>• <strong>System Architecture:</strong> Enhanced microservices architecture and configured Confluent Kafka for real-time data streaming, enabling seamless integration across distributed systems</li>
          <li>• <strong>Performance Optimization:</strong> Optimized database queries and implemented caching strategies, resulting in 35% improvement in application response times</li>
        </ul>
      ),
      technologies: ["Java", "Spring Boot", "React", "Redux", "Redis", "PostgreSQL", "Kafka", "Confluent", "Docker", "AWS"]
    },
    {
      title: "Tech Consulting Intern",
      company: "Ernst & Young LLP",
      period: "June 2022",
      description: (
        <ul className="space-y-2">
          <li>• <strong>Client Solutions:</strong> Led implementation of Microsoft Dynamics 365 to enhance a Fortune 500 client's customer service system, improving case resolution time by 45%</li>
          <li>• <strong>ML Model Development:</strong> Designed and deployed a sophisticated machine learning model using NLP techniques to analyze emails and automatically assign support cases with 89% accuracy</li>
          <li>• <strong>System Analysis:</strong> Conducted comprehensive analysis of Dynamics 365's model training process and underlying neural network architecture, identifying critical performance bottlenecks</li>
          <li>• <strong>Strategic Recommendations:</strong> Presented actionable findings and recommendations to Microsoft engineering teams to improve model accuracy and streamline training processes</li>
          <li>• <strong>Process Optimization:</strong> Developed automated workflows that reduced manual case assignment by 70%, saving approximately 20 hours of manual work per week</li>
        </ul>
      ),
      technologies: ["MS Dynamics 365", "Machine Learning", "NLP", "Neural Networks", "Python", "Azure ML", "PowerBI"]
    },
    {
      title: "Virtual Student Developer",
      company: "Microsoft Technology Center",
      period: "June 2021",
      description: (
        <ul className="space-y-2">
          <li>• <strong>AI Model Development:</strong> Leveraged Microsoft's Custom Vision API and developed a robust TensorFlow model to identify and classify lettuce plants in agricultural settings</li>
          <li>• <strong>Disease Detection:</strong> Implemented computer vision algorithms to assess plant health with 95% precision, enabling early disease detection and prevention in crop management</li>
          <li>• <strong>Spatial Analysis:</strong> Designed coordinate transformation system to convert image coordinates into agricultural field grid patterns (rows and columns) for precise location mapping</li>
          <li>• <strong>Integration Ready:</strong> Structured output data as JSON APIs for seamless integration with farming management systems and mobile applications</li>
          <li>• <strong>Agricultural Impact:</strong> Created a scalable solution that could potentially reduce crop loss by 30% through early disease intervention</li>
        </ul>
      ),
      technologies: ["TensorFlow", "Microsoft Custom Vision", "Computer Vision", "Python", "OpenCV", "JSON", "Azure", "Agricultural Tech"]
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
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-xl leading-relaxed mb-8 font-light tracking-wide opacity-80">
              I'm a passionate Computer Science student at the <span className="font-medium opacity-100">University of Illinois at Urbana-Champaign</span>,
              specializing in <span className="font-medium opacity-100">software engineering</span>, <span className="font-medium opacity-100">machine learning</span>, and <span className="font-medium opacity-100">distributed systems</span>. My experience
              spans from developing high-performance computing solutions to creating user-friendly mobile applications.
            </p>
            <p className="text-xl leading-relaxed font-light tracking-wide opacity-80">
              Currently, I'm advancing research in <span className="font-medium opacity-100">parallel programming frameworks</span> and <span className="font-medium opacity-100">compiler optimization</span>{' '}
              while maintaining a strong focus on practical applications that solve real-world problems.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="glass-effect p-8 rounded-lg"
          >
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-4">
                  <GraduationCap className="inline mr-2" size={24} />
                  Quick Facts
                </h3>
                <div className="space-y-2 opacity-80">
                  <p><strong>University:</strong> University of Illinois at Urbana-Champaign</p>
                  <p><strong>Major:</strong> Computer Science</p>
                  <p><strong>Minor:</strong> Electrical Engineering</p>
                  <p><strong>Expected Graduation:</strong> May 2027</p>
                  <p><strong>GPA:</strong> 3.98</p>
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-4">
                  <MapPin className="inline mr-2" size={24} />
                  Contact
                </h3>
                <div className="space-y-2 opacity-80">
                  <p>+1 217 372 8738</p>
                  <p>advaittahilyani@gmail.com</p>
                  <div className="flex space-x-4 mt-4">
                    <a href="https://www.linkedin.com/in/advait-tahilyani/" target="_blank" className="opacity-60 hover:opacity-100 transition-opacity">
                      <Linkedin size={20} />
                    </a>
                    <a href="https://github.com/AdvaitTahilyani" target="_blank" className="opacity-60 hover:opacity-100 transition-opacity">
                      <Github size={20} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </Section>

      <Section id="experience" title="Work Experience">
        <Timeline items={workExperience} />
      </Section>

      <Section id="research" title="Research Experience">
        <Timeline items={researchExperience} />
      </Section>

      <Section id="education" title="Education & Achievements">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="glass-effect p-8 rounded-lg mb-8"
          >
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold mb-4">University of Illinois at Urbana-Champaign</h3>
              <p className="text-xl mb-2">Bachelor of Science in Computer Science</p>
              <p className="text-lg opacity-80 mb-4">Minor in Electrical Engineering</p>

              {/* Academic Honors */}
              <div className="flex justify-center items-center gap-4 mb-6">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="px-4 py-2 bg-white/5 border border-white/20 rounded-md"
                >
                  <span className="font-semibold text-sm">🏆 James Scholar Honors</span>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="px-4 py-2 bg-white/5 border border-white/20 rounded-md"
                >
                  <span className="font-semibold text-sm">🎓 Dean's List Scholar</span>
                </motion.div>
              </div>

              <div className="flex justify-center items-center space-x-8 opacity-80">
                <div className="text-center">
                  <p className="text-2xl font-bold opacity-100">3.98</p>
                  <p className="text-sm">GPA</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold opacity-100">May 2027</p>
                  <p className="text-sm">Expected Graduation</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-6"
          >
            <div className="glass-effect p-6 rounded-lg">
              <h4 className="text-xl font-bold mb-4">Academic Roles</h4>
              <div className="space-y-3">
                <div>
                  <h5 className="font-semibold">CS 124 Tutor</h5>
                  <p className="text-sm opacity-60">January 2024 – Present</p>
                  <p className="text-sm opacity-80 mt-1">Host office hours, assisting over 200 students with Kotlin fundamentals and Android development</p>
                </div>
              </div>
            </div>

            <div className="glass-effect p-6 rounded-lg">
              <h4 className="text-xl font-bold mb-4">Leadership & Organizations</h4>
              <div className="space-y-3">
                <div>
                  <h5 className="font-semibold">Illinois Semiconductor Student Alliance</h5>
                  <p className="text-sm opacity-60">Software Team Lead • August 2024 – Present</p>
                  <p className="text-sm opacity-80 mt-1">Leading development of educational tools and RF transceiver design</p>
                </div>
                <div>
                  <h5 className="font-semibold">Nand2Tetris Project</h5>
                  <p className="text-sm opacity-60">May 2024 - Present</p>
                  <p className="text-sm opacity-80 mt-1">Built CPU and compiler from scratch, created Snake game in custom language</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
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
            <p className="text-lg opacity-80 mb-8">
              I'm always interested in discussing new opportunities, innovative projects,
              and potential collaborations. Feel free to reach out!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="mailto:advaittahilyani@gmail.com"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center px-6 py-3 bg-white text-black rounded-md hover:opacity-90 transition-opacity font-medium"
              >
                <Mail className="mr-2" size={20} />
                Send Email
              </motion.a>
              <motion.a
                href="https://www.linkedin.com/in/advait-tahilyani/"
                target="_blank"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center px-6 py-3 border border-white/20 rounded-md hover:bg-white/5 transition-all font-medium"
              >
                <Linkedin className="mr-2" size={20} />
                LinkedIn
              </motion.a>
            </div>
          </div>
        </motion.div>
      </Section>
    </main>
  )
}
