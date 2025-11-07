'use client'

import { ThemeProvider } from '@/contexts/ThemeContext'
import { AdminProvider } from '@/contexts/AdminContext'
import { ChessProvider } from '@/contexts/ChessContext'

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider>
      <AdminProvider>
        <ChessProvider>{children}</ChessProvider>
      </AdminProvider>
    </ThemeProvider>
  )
}
