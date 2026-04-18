'use client'

import { motion, useScroll, useSpring } from 'framer-motion'

const ScrollProgress = () => {
    const { scrollYProgress } = useScroll()
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 120,
        damping: 28,
        mass: 0.4,
    })

    return (
        <motion.div
            className="fixed top-0 left-0 right-0 h-[2px] origin-left z-[60] pointer-events-none"
            style={{
                scaleX,
                backgroundColor: 'var(--progress-color)',
            }}
            aria-hidden
        />
    )
}

export default ScrollProgress
