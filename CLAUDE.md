# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Important: Documentation First

**ALWAYS refer to the relevant documentation files in the `/docs` directory before generating any code.** The docs contain project-specific patterns, conventions, and implementation details that must be followed:

- /docs/auth.md
- /docs/data-fetching.md
- /docs/data-mutations.md
- /docs/routing.md
- /docs/ui.md

## Project Overview

Lifting Diary Course - A Next.js 16 application with React 19, TypeScript, and Tailwind CSS v4.

## Development Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Architecture

- **App Router**: Uses Next.js App Router (`app/` directory) with file-based routing
- **Server Components**: React Server Components by default
- **Styling**: Tailwind CSS v4 with PostCSS integration
- **Fonts**: Geist font family via `next/font` with CSS variables

## Path Aliases

- `@/*` maps to project root (e.g., `import { Component } from '@/components/Component'`)
