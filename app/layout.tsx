import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
    title: 'Advait Tahilyani - Software Engineer & Researcher',
    description: 'Personal portfolio of Advait Tahilyani - Software Engineer, Researcher, and Computer Science graduate from University of Illinois at Urbana-Champaign',
    keywords: 'Advait Tahilyani, Software Engineer, Computer Science, UIUC, Research, Web Development',
    authors: [{ name: 'Advait Tahilyani' }],
    viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    )
}
