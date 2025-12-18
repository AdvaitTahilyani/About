# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a modern, animated personal portfolio website built with Next.js 14, showcasing work experience, research, projects, and technical skills. The site is configured for static export deployment on Vercel.

**Key Technologies:**
- Next.js 14 with TypeScript
- Tailwind CSS with extensive custom animations
- Framer Motion for animations
- Lucide React for icons

## Common Commands

### Development
```bash
npm run dev          # Start development server on http://localhost:3000
npm run build        # Build for production (creates static export in /out)
npm start            # Start production server
npm run lint         # Run ESLint
```

### Preview
```bash
npm run preview      # Serve the static export locally using npx serve
```

## Architecture & Key Patterns

### Static Export Configuration
The site uses Next.js static export mode (`output: 'export'`) configured in `next.config.js`. This means:
- All pages are pre-rendered at build time
- Images must be unoptimized (`unoptimized: true`)
- Output goes to `/out` directory
- Trailing slashes are enabled
- No server-side rendering or API routes

### Component Structure
The codebase follows a simple two-tier architecture:

**Main Page (`app/page.tsx`):**
- Single-page application with all content in one file
- Contains all data arrays: `workExperience`, `researchExperience`, `projects`, `skills`
- Uses client-side rendering (`'use client'`)
- Organized into sections: About, Experience, Research, Education, Projects, Skills, Contact

**Reusable Components (`components/`):**
- `Hero.tsx` - Landing section with typewriter effect and animated background orbs
- `Header.tsx` - Navigation header
- `Section.tsx` - Wrapper for main sections
- `Timeline.tsx` - Used for both work and research experience
- `ProjectCard.tsx` - Individual project cards
- `SkillCard.tsx` - Skill category cards
- `ParallaxSection.tsx` - Parallax effects
- `LoadingSpinner.tsx` - Loading states

### Styling System

**Tailwind Configuration (`tailwind.config.ts`):**
- Custom color palettes: `primary` (blue), `accent` (purple), `gradient`
- Extensive custom animations defined in keyframes
- Custom shadow utilities: `glow`, `glass`, `card`, `card-hover`
- Custom backdrop blur sizes

**Global CSS (`app/globals.css`):**
- Custom utility classes:
  - `.glass-effect` - Glassmorphism with blur and transparency
  - `.gradient-text` - Animated gradient text
  - `.card-hover` - Advanced hover with shimmer effect
  - `.btn-shine` - Button shine animation
  - `.floating-1` / `.floating-2` - Floating background elements
- Custom scrollbar styling
- Focus and selection states

### Animation Patterns

**Framer Motion:**
- Initial/animate pattern for scroll-triggered animations
- `whileInView` with `viewport={{ once: true }}` for one-time reveals
- Standard transitions use `{ duration: 0.8 }` for consistency
- Staggered delays (0.2s increments) for sequential reveals

**Typewriter Effect:**
- Implemented in `Hero.tsx` using `useState` and `useEffect`
- 100ms interval per character
- Blinking cursor using Framer Motion opacity animation

**Background Animations:**
- Multiple animated orbs in `Hero.tsx` with different durations (25s, 30s, 35s, 40s)
- Particle effects using array mapping with staggered delays
- Floating particles with coordinated x/y movements

## Content Management

All content is hardcoded in `app/page.tsx` as TypeScript arrays. To update:

**Work Experience** (`workExperience` array):
- Includes title, company, period, description (JSX with bullet points), technologies

**Research Experience** (`researchExperience` array):
- Same structure as work experience

**Projects** (`projects` array):
- Includes title, description, period, technologies

**Skills** (`skills` array):
- Organized by category with array of skill strings

## TypeScript Configuration

- Strict mode enabled
- Path alias: `@/*` maps to project root
- Target: ES5 with ES6 libs
- JSX: preserve (handled by Next.js)

## Deployment Notes

**Vercel Deployment:**
- Push to main branch triggers automatic deployment
- Vercel auto-detects Next.js and uses correct build settings
- No environment variables required
- Static export deploys to edge network

**Build Process:**
1. Next.js compiles TypeScript
2. Static pages generated for all routes
3. Assets optimized and copied to `/out`
4. Result is fully static site

## Important Constraints

- No dynamic routes or server-side rendering
- No Next.js Image optimization (must use `<img>` or unoptimized images)
- No API routes or server actions
- All data must be static or fetched client-side
- All components under `app/` must be client components (`'use client'`)

## Design System

**Colors:**
- Primary gradient: Purple (#667eea) to Blue (#764ba2)
- Accent colors: Blue and Purple variations
- Text: White/gray scale for readability on dark background

**Spacing:**
- Sections use consistent padding and gaps
- Cards use `.glass-effect` with rounded corners
- Max-width constraints (2xl, 4xl, 5xl) for readability

**Typography:**
- Font: Inter (sans-serif) with weights 300-900
- Mono: JetBrains Mono for code
- Hierarchy: Consistent heading sizes and spacing
