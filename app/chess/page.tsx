'use client'

import Header from '@/components/Header'
import ChessGame from '@/components/ChessGame'
import Section from '@/components/Section'

export default function ChessPage() {
  return (
    <main className="min-h-screen">
      <Header />

      {/* Minimal grid background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      <Section id="chess" title="Chess Challenge">
        <ChessGame />
      </Section>
    </main>
  )
}
