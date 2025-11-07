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
                    bg: '#0a0a0a',
                    surface: '#111111',
                    border: '#1a1a1a',
                    text: '#ffffff',
                    muted: '#a1a1a1',
                },
                light: {
                    bg: '#ffffff',
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
                'fade-in': 'fadeIn 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                'fade-in-up': 'fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                'fade-in-down': 'fadeInDown 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                'slide-up': 'slideUp 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                'slide-down': 'slideDown 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                'slide-left': 'slideLeft 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                'slide-right': 'slideRight 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                'scale-in': 'scaleIn 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                'float': 'float 6s ease-in-out infinite',
                'float-slow': 'float 8s ease-in-out infinite',
                'pulse-slow': 'pulse 3s ease-in-out infinite',
                'bounce-slow': 'bounce 2s infinite',
                'spin-slow': 'spin 3s linear infinite',
                'gradient': 'gradient 8s ease-in-out infinite',
                'glow': 'glow 2s ease-in-out infinite alternate',
                'shimmer': 'shimmer 2s linear infinite',
                'typewriter': 'typewriter 4s steps(40) 1s both',
                'blink': 'blink 1s step-end infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(30px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                fadeInDown: {
                    '0%': { opacity: '0', transform: 'translateY(-30px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(100%)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                slideDown: {
                    '0%': { transform: 'translateY(-100%)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                slideLeft: {
                    '0%': { transform: 'translateX(100%)', opacity: '0' },
                    '100%': { transform: 'translateX(0)', opacity: '1' },
                },
                slideRight: {
                    '0%': { transform: 'translateX(-100%)', opacity: '0' },
                    '100%': { transform: 'translateX(0)', opacity: '1' },
                },
                scaleIn: {
                    '0%': { transform: 'scale(0.8)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                gradient: {
                    '0%, 100%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                },
                glow: {
                    '0%': { boxShadow: '0 0 20px rgba(102, 126, 234, 0.5)' },
                    '100%': { boxShadow: '0 0 40px rgba(102, 126, 234, 0.8)' },
                },
                shimmer: {
                    '0%': { transform: 'translateX(-100%)' },
                    '100%': { transform: 'translateX(100%)' },
                },
                typewriter: {
                    '0%': { width: '0' },
                    '100%': { width: '100%' },
                },
                blink: {
                    '0%, 50%': { borderColor: 'transparent' },
                    '51%, 100%': { borderColor: 'currentColor' },
                },
            },
            backdropBlur: {
                'xs': '2px',
                'xl': '24px',
                '2xl': '40px',
                '3xl': '64px',
            },
            boxShadow: {
                'glow': '0 0 20px rgba(102, 126, 234, 0.5)',
                'glow-lg': '0 0 40px rgba(102, 126, 234, 0.6)',
                'inner-glow': 'inset 0 0 20px rgba(255, 255, 255, 0.1)',
                'glass': '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                'card': '0 10px 30px rgba(0, 0, 0, 0.1), 0 1px 8px rgba(0, 0, 0, 0.2)',
                'card-hover': '0 20px 40px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.1)',
            },
            spacing: {
                '18': '4.5rem',
                '88': '22rem',
                '128': '32rem',
            },
        },
    },
    plugins: [],
}
export default config
