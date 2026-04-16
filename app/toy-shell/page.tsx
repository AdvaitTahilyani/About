'use client'

import Header from '@/components/Header'
import Section from '@/components/Section'
import ToyShellDemo from '@/components/ToyShellDemo'

export default function ToyShellPage() {
  return (
    <main className="min-h-screen">
      <Header />

      <Section id="toy-shell" title="Toy Shell Environment" className="pt-16 sm:pt-20">
        <ToyShellDemo />
      </Section>
    </main>
  )
}
