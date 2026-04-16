'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { useState, useEffect } from 'react'

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="p-2 w-9 h-9" />
    )
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2 opacity-40 hover:opacity-100 transition-opacity duration-200"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun className="w-4 h-4" />
      ) : (
        <Moon className="w-4 h-4" />
      )}
    </button>
  )
}

export default ThemeToggle
