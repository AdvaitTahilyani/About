'use client'

import { useAdmin } from '@/contexts/AdminContext'
import { motion } from 'framer-motion'
import { Shield, LogOut } from 'lucide-react'
import { useState, useEffect } from 'react'

const AdminIndicator = () => {
  const { isAdmin, logout } = useAdmin()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !isAdmin) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center space-x-2"
    >
      <div className="flex items-center space-x-2 px-3 py-1.5 bg-green-500/10 border border-green-500/30 rounded-md">
        <Shield className="w-4 h-4 text-green-400" />
        <span className="text-xs text-green-400 font-medium">Admin</span>
      </div>

      <motion.button
        onClick={logout}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="p-2 rounded-lg bg-white/5 border border-white/20 hover:border-red-500/50 hover:bg-red-500/10 transition-colors"
        title="Logout"
      >
        <LogOut className="w-4 h-4 text-red-400" />
      </motion.button>
    </motion.div>
  )
}

export default AdminIndicator
