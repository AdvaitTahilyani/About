'use client'

import { motion } from 'framer-motion'

const LoadingSpinner = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-black">
            <div className="relative">
                {/* Outer rotating ring */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-24 h-24 border-4 border-transparent border-t-blue-500 border-r-purple-500 rounded-full"
                />

                {/* Inner pulsing circle */}
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                />

                {/* Center dot */}
                <motion.div
                    animate={{ scale: [0.8, 1.1, 0.8] }}
                    transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-8 bg-white rounded-full"
                />
            </div>
        </div>
    )
}

export default LoadingSpinner
