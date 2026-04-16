import type { Config } from 'tailwindcss'

const config: Config = {
    darkMode: 'class',
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './contexts/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                dark: {
                    bg: '#000000',
                    surface: '#0a0a0a',
                    border: '#1a1a1a',
                    text: '#ffffff',
                    muted: '#666666',
                },
                light: {
                    bg: '#fafafa',
                    surface: '#f5f5f5',
                    border: '#e5e5e5',
                    text: '#0a0a0a',
                    muted: '#737373',
                },
                accent: {
                    DEFAULT: '#ffffff',
                    dark: '#0a0a0a',
                }
            },
            fontFamily: {
                sans: ['JetBrains Mono', 'Monaco', 'Courier New', 'monospace'],
                mono: ['JetBrains Mono', 'Monaco', 'Courier New', 'monospace'],
            },
            animation: {
                'fade-in': 'fadeIn 0.3s ease-out',
                'blink': 'blink 1s step-end infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                blink: {
                    '0%, 49%': { opacity: '1' },
                    '50%, 100%': { opacity: '0' },
                },
            },
            boxShadow: {
                'glow': '0 0 20px rgba(102, 126, 234, 0.5)',
                'glow-lg': '0 0 40px rgba(102, 126, 234, 0.6)',
            },
        },
    },
    plugins: [],
}
export default config
