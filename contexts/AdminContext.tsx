'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import Cookies from 'js-cookie'

// Password hash for "Equilibrium1@"
const PASSWORD_HASH = '$2b$10$OAbt9IRYDc2o/9fkvk9wHOaD23UhGdrbYkmYpsxJL9krmcO6ScFga'
const ADMIN_COOKIE_NAME = 'admin_session'
const COOKIE_EXPIRY_DAYS = 7

interface AdminContextType {
  isAdmin: boolean
  login: (password: string) => Promise<boolean>
  logout: () => void
  checkAdminStatus: () => boolean
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

// Simple bcrypt compare implementation for browser
async function compareBcrypt(password: string, hash: string): Promise<boolean> {
  try {
    const bcrypt = await import('bcryptjs')
    return await bcrypt.compare(password, hash)
  } catch (error) {
    console.error('Bcrypt import error:', error)
    return false
  }
}

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Check if admin cookie exists on mount
    const adminCookie = Cookies.get(ADMIN_COOKIE_NAME)
    if (adminCookie === 'true') {
      setIsAdmin(true)
    }
  }, [])

  const login = async (password: string): Promise<boolean> => {
    try {
      const isValid = await compareBcrypt(password, PASSWORD_HASH)

      if (isValid) {
        setIsAdmin(true)
        // Set cookie with 7 day expiry
        Cookies.set(ADMIN_COOKIE_NAME, 'true', { expires: COOKIE_EXPIRY_DAYS })
        return true
      }
      return false
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }

  const logout = () => {
    setIsAdmin(false)
    Cookies.remove(ADMIN_COOKIE_NAME)
  }

  const checkAdminStatus = (): boolean => {
    const adminCookie = Cookies.get(ADMIN_COOKIE_NAME)
    return adminCookie === 'true'
  }

  if (!mounted) {
    return <>{children}</>
  }

  return (
    <AdminContext.Provider value={{ isAdmin, login, logout, checkAdminStatus }}>
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (context === undefined) {
    return {
      isAdmin: false,
      login: async () => false,
      logout: () => {},
      checkAdminStatus: () => false
    }
  }
  return context
}
