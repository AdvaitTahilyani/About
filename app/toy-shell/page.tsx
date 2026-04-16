'use client'

import Header from '@/components/Header'
import ToyShellDemo from '@/components/ToyShellDemo'

export default function ToyShellPage() {
  return (
    <main className="min-h-screen">
      <Header />

      <div className="container mx-auto px-6 pt-24 pb-6">
        <div className="mb-2 text-xs opacity-30 tracking-wider">// interactive demo</div>
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Toy Shell</h1>
        <p className="text-sm opacity-40 max-w-2xl mb-1">
          A shell I wrote for CS 341 (Systems Programming) at UIUC, ported to run
          entirely in your browser. The original was written in C and supported history,
          logical operators, redirection, and process control.
        </p>
        <p className="text-sm opacity-25 max-w-2xl mb-8">
          This sandbox version operates on a virtual filesystem stored in your browser's
          local storage. Poke around — some commands might surprise you.
        </p>
      </div>

      <div className="container mx-auto px-6 pb-16">
        <ToyShellDemo />
      </div>
    </main>
  )
}
