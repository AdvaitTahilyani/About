'use client'

import { ThemeProvider } from '@/contexts/ThemeContext'
import { AdminProvider } from '@/contexts/AdminContext'
import { ChessProvider } from '@/contexts/ChessContext'
import { usePathname } from 'next/navigation'

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const content = pathname === '/chess' ? <ChessProvider>{children}</ChessProvider> : children

  return (
    <ThemeProvider>
      <AdminProvider>
        {content}
      </AdminProvider>
    </ThemeProvider>
  )
}
