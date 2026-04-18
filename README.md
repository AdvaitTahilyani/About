# advaittahilyani.com

This is the source for my personal site — a single-page portfolio with a handful of interactive side-experiments wired into it. It's built with Next.js 14 and written to be opinionated about feel: a monochrome terminal aesthetic, a cursor-following spotlight, a status bar at the bottom that tells you where you are on the page, and a command palette (`⌘K`) that is the fastest way to jump around.

The site is deployed at **[advaittahilyani.com](https://advaittahilyani.com)**.

## What's in here

Most portfolios are a static scroll. This one is a few small apps held together by one:

- **`/` — Portfolio.** About, experience, research, projects, education, skills, contact. Content lives in arrays in `app/page.tsx`.
- **`/toy-shell` — a browser-safe port of my CS 341 shell** in C, re-implemented in TypeScript. Virtual filesystem, history, redirection, path navigation, and a bunch of easter eggs. Persists to `localStorage`.
- **`/nand2tetris-snake` — the Snake game I wrote in Jack**, running on a WebAssembly build of the Hack VM emulator. Part of my [Nand2Tetris project](https://github.com/AdvaitTahilyani/nand2tetris).
- **`/chess` — a shared live chess game.** The board state is stored server-side (via Vercel KV through `/api/chess`), so multiple visitors play *together* against me. The related [Chess Mimic Bot](https://github.com/AdvaitTahilyani/Chess) is a separate Python project.
- **`/admin` — an admin panel** for managing the shared chess game state, gated by the `AdminContext`.

## Interaction details

A few things that are easy to miss:

- **`⌘K` / `Ctrl+K`** opens a command palette for jumping between sections, toggling the theme, copying my email, and more.
- **Cursor spotlight** — a subtle radial glow follows your cursor on desktop. Disabled automatically for touch devices and `prefers-reduced-motion`.
- **Status bar** — a vim/tmux-style bar at the bottom shows the current section, scroll progress, local time in CST, and a `⌘K` shortcut.
- **Rotating live status** in the hero cycles between role, location, and local time.
- **Click-to-copy email** in the hero — tap the email address and it copies to clipboard with a small confirmation.
- **Light / dark theme** with persisted preference.
- **Konami code** (`↑ ↑ ↓ ↓ ← → ← → B A`) — a hidden canvas effect.
- **Scroll progress bar** at the top of the viewport.

## Tech Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 14, React 18, TypeScript |
| Styling | Tailwind CSS (custom animations, glassmorphism utilities) |
| Animations | Framer Motion |
| Icons | Lucide React |
| Chess board | `react-chessboard` + `chess.js` |
| Persistent state | Vercel KV (for `/api/chess`) |
| Hosting | Vercel |

The site **was** configured as a static export, but the shared-state chess game required API routes, so `next.config.js` now builds a server app. The rest of the site is still trivially statically renderable.

## Project Structure

```
About/
├── app/
│   ├── layout.tsx              # Root layout + metadata
│   ├── page.tsx                # Portfolio (data + sections live here)
│   ├── globals.css             # Theme vars, utility classes, light-mode tweaks
│   ├── toy-shell/page.tsx      # Hosts the ToyShellDemo
│   ├── nand2tetris-snake/      # Hack VM Snake demo
│   ├── chess/page.tsx          # Shared live chess board
│   ├── admin/page.tsx          # Admin controls for the chess game
│   └── api/chess/              # REST endpoints backing the chess state (KV)
├── components/
│   ├── Hero.tsx                # Landing section with LiveStatus + copy-to-clipboard
│   ├── Header.tsx              # Top navigation
│   ├── ClientLayout.tsx        # Wires providers + global UI chrome
│   ├── CommandPalette.tsx      # ⌘K palette
│   ├── StatusBar.tsx           # Bottom vim-style status bar
│   ├── CursorSpotlight.tsx     # Cursor-following radial spotlight
│   ├── KonamiMatrix.tsx        # Easter-egg canvas effect
│   ├── ScrollProgress.tsx      # Top progress bar
│   ├── LiveStatus.tsx          # Rotating hero status
│   ├── ThemeToggle.tsx         # Light / dark toggle
│   ├── TextScramble.tsx        # Glitchy text reveal
│   ├── Timeline.tsx            # Work + research entries
│   ├── ProjectCard.tsx         # Featured + compact project cards
│   ├── SkillCard.tsx           # Skill category rows
│   ├── Section.tsx             # Shared section wrapper
│   ├── ToyShellDemo.tsx        # Interactive shell on /toy-shell
│   ├── Nand2TetrisSnakeDemo.tsx# Hack VM Snake on /nand2tetris-snake
│   ├── ChessGame.tsx           # Chessboard UI for /chess
│   └── AdminIndicator.tsx      # Small badge when admin mode is on
├── contexts/
│   ├── ThemeContext.tsx        # html.light class + persistence
│   ├── AdminContext.tsx        # Admin auth + token handling
│   └── ChessContext.tsx        # Fetches / mutates shared chess state
├── next.config.js              # Note: static export intentionally disabled
├── tailwind.config.ts
└── package.json
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install and run

```bash
git clone https://github.com/AdvaitTahilyani/About.git
cd About
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Next.js dev server with hot reload. |
| `npm run build` | Production build. |
| `npm start` | Serve the production build. |
| `npm run lint` | ESLint. |
| `npm run preview` | Serve the built output with `serve`. |

### Vercel KV (for the shared chess game)

The `/api/chess` route reads and writes shared board state in [Vercel KV](https://vercel.com/docs/storage/vercel-kv). If you deploy a fork, provision a KV store and set the standard KV env vars:

```env
KV_URL=...
KV_REST_API_URL=...
KV_REST_API_TOKEN=...
KV_REST_API_READ_ONLY_TOKEN=...
```

Locally, the chess page falls back to a fresh in-memory board if those are missing — the rest of the site works fine without any configuration.

## Updating Content

Everything visible on `/` is data in `app/page.tsx`:

- `workExperience`, `researchExperience` — timeline items
- `featuredProjects`, `otherProjects` — the two project card styles
- `skills` — grouped skill lists

Descriptions accept JSX so bullet lists are written inline. The `ProjectCard` component supports `liveUrl` and `githubUrl` independently.

## Design Notes

- **Monochrome** intentional — accents come from opacity rather than color. The light mode overrides in `globals.css` bump effective opacity on muted text so it stays legible on a pale background.
- **CSS custom properties** drive the theme: `--border-primary`, `--bg-header`, `--statusbar-bg`, `--spotlight-color`, `--cmdk-bg`, and friends are defined twice — once on `html` (dark) and once on `html.light`.
- **Framer Motion** is used sparingly: one-shot reveals via `whileInView` + `viewport={{ once: true }}`, staggered delays for sequential content, and `AnimatePresence` for small transitions like the copy-to-clipboard toast.
- **Typography** — Inter for UI, JetBrains Mono for anything terminal-adjacent.

## Deployment

The site auto-deploys to Vercel on every push to `main`. Vercel detects Next.js, runs the build, provisions the runtime for the API routes, and ships the static assets to the edge.

## Contact

- **Email** — advaittahilyani@gmail.com
- **LinkedIn** — [linkedin.com/in/advait-tahilyani](https://www.linkedin.com/in/advait-tahilyani/)
- **GitHub** — [github.com/AdvaitTahilyani](https://github.com/AdvaitTahilyani)

## License

No license file yet. If you want to reuse something specific, open an issue and we can sort it out.
