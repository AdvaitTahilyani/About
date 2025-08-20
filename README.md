# Advait Tahilyani - Portfolio Website

A modern, animated personal portfolio website showcasing my work experience, research, projects, and technical skills.

## Features

- 🎨 **Modern Design**: Sleek glassmorphism design with gradient backgrounds
- ⚡ **Smooth Animations**: Framer Motion animations and transitions
- 📱 **Responsive**: Works perfectly on desktop, tablet, and mobile devices
- 🚀 **Performance**: Built with Next.js 14 and optimized for speed
- 🎯 **SEO Optimized**: Proper meta tags and structured data

## Tech Stack

- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS with custom animations
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ installed on your machine
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd About
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Deployment on Vercel

This project is optimized for deployment on Vercel. Follow these steps:

### Option 1: Deploy via Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy from your project directory:
```bash
vercel
```

3. Follow the prompts to deploy your site.

### Option 2: Deploy via Vercel Dashboard

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Go to [vercel.com](https://vercel.com) and sign up/login
3. Click "New Project" and import your repository
4. Vercel will automatically detect it's a Next.js project and configure the build settings
5. Click "Deploy" and your site will be live!

### Option 3: Deploy via GitHub Integration

1. Push your code to GitHub
2. Connect your GitHub account to Vercel
3. Import your repository on Vercel
4. Every push to main branch will automatically deploy

## Project Structure

```
├── app/
│   ├── globals.css          # Global styles and animations
│   ├── layout.tsx           # Root layout component
│   └── page.tsx             # Main page component
├── components/
│   ├── Header.tsx           # Navigation header
│   ├── Hero.tsx             # Hero section with typing animation
│   ├── Section.tsx          # Reusable section wrapper
│   ├── Timeline.tsx         # Timeline component for experience
│   ├── ProjectCard.tsx      # Project showcase cards
│   └── SkillCard.tsx        # Skills display cards
├── next.config.js           # Next.js configuration
├── tailwind.config.ts       # Tailwind CSS configuration
└── package.json             # Dependencies and scripts
```

## Customization

### Updating Content

1. **Personal Information**: Edit the contact details and social links in `app/page.tsx`
2. **Work Experience**: Update the `workExperience` array in `app/page.tsx`
3. **Projects**: Modify the `projects` array in `app/page.tsx`
4. **Skills**: Update the `skills` array in `app/page.tsx`
5. **Research**: Edit the `researchExperience` array in `app/page.tsx`

### Styling

1. **Colors**: Modify the color scheme in `tailwind.config.ts`
2. **Animations**: Customize animations in `app/globals.css` and component files
3. **Fonts**: Change fonts by updating the Google Fonts import in `app/globals.css`

## Performance Optimizations

- Static site generation with Next.js
- Optimized images and assets
- Lazy loading for animations
- Minimal bundle size with tree shaking
- Responsive design for all devices

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is open source and available under the [MIT License](LICENSE).

## Contact

- **Email**: advaittahilyani@gmail.com
- **LinkedIn**: [linkedin.com/in/advait-tahilyani](https://www.linkedin.com/in/advait-tahilyani/)
- **GitHub**: [github.com/AdvaitTahilyani](https://github.com/AdvaitTahilyani)
