'use client'

import { ThemeProvider } from '@/contexts/ThemeContext'
import { AdminProvider } from '@/contexts/AdminContext'
import { ChessProvider } from '@/contexts/ChessContext'
import { usePathname } from 'next/navigation'
import CommandPalette from './CommandPalette'
import ScrollProgress from './ScrollProgress'
import StatusBar from './StatusBar'
import CursorSpotlight from './CursorSpotlight'
import KonamiMatrix from './KonamiMatrix'

const routeLabels: Record<string, string> = {
  '/toy-shell': 'toy-shell',
  '/chess': 'chess',
  '/nand2tetris-snake': 'snake',
  '/admin': 'admin',
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const content = pathname === '/chess' ? <ChessProvider>{children}</ChessProvider> : children
  const routeLabel = pathname ? routeLabels[pathname] : undefined

  return (
    <ThemeProvider>
      <AdminProvider>
        <CursorSpotlight />
        <ScrollProgress />
        {content}
        <StatusBar routeLabel={routeLabel} />
        <CommandPalette />
        <KonamiMatrix />
      </AdminProvider>
    </ThemeProvider>
  )
}
