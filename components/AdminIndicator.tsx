'use client'

import { useAdmin } from '@/contexts/AdminContext'
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
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1.5 px-2 py-1 border border-green-500/20 rounded text-xs text-green-400/80">
        <Shield className="w-3 h-3" />
        admin
      </div>
      <button
        onClick={logout}
        className="p-1.5 opacity-40 hover:opacity-100 hover:text-red-400 transition-all duration-200"
        title="Logout"
      >
        <LogOut className="w-3 h-3" />
      </button>
    </div>
  )
}

export default AdminIndicator
