'use client'

import Header from '@/components/Header'
import Nand2TetrisSnakeDemo from '@/components/Nand2TetrisSnakeDemo'
import Section from '@/components/Section'

export default function Nand2TetrisSnakePage() {
  return (
    <main className="min-h-screen">
      <Header />

      <div className="pointer-events-none absolute inset-0 opacity-[0.03]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      <Section id="nand2tetris-snake" title="Snake on nand2tetris" className="pt-16 sm:pt-20">
        <Nand2TetrisSnakeDemo />
      </Section>
    </main>
  )
}
