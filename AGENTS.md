# Repository Guidelines

This repository contains a Next.js app for generating and playing quiz games from PDFs, plus static game templates.

## Project Structure & Module Organization
- `quizgames/` — Next.js (TypeScript) app.
  - `src/app/` — App Router pages (e.g., `page.tsx`, `play/page.tsx`).
  - `src/components/` — UI components (e.g., `GameShell.tsx`, `GameRuntimeIframe.tsx`).
  - `src/lib/` — core logic (PDF parsing, session store, templates, types).
  - `public/games/` — embeddable HTML mini‑games (e.g., `mcq-shooter.html`).
  - `src/styles/` — global styles (e.g., `globals.css`).
- `generate-games/` — static HTML templates and prompts for game variations.
- `.env.local.example` — environment template (copy to `quizgames/.env.local`).

## Build, Test, and Development Commands
- Install: `cd quizgames && npm install`
- Develop: `npm run dev` — start Next.js dev server.
- Build: `npm run build` — production build.
- Start: `npm start` — serve built app.
- Lint: `npm run lint` — run ESLint (Next config).

## Coding Style & Naming Conventions
- Language: TypeScript with strict mode; ES modules.
- Indentation: 2 spaces; use Prettier defaults if configured by your editor (no repo config).
- Components: PascalCase files in `src/components` (e.g., `GameShell.tsx`).
- Lib utilities/types: camelCase files in `src/lib` (e.g., `pdfQuiz.ts`).
- Routes: `src/app/.../page.tsx`; keep server/client components explicit (`"use client"`).
- Run `npm run lint` before pushing; fix or justify warnings.

## Testing Guidelines
- No test suite is configured yet. Contributions adding tests are welcome.
- Suggested setup: Jest + React Testing Library for units, Playwright for e2e.
- Suggested naming: place tests alongside modules or in `src/__tests__/`, using `*.test.ts(x)`.
- Keep tests deterministic; mock external services (e.g., Supabase).

## Commit & Pull Request Guidelines
- Commit style: Prefer Conventional Commits (e.g., `feat:`, `fix:`, `docs:`, `refactor:`). Existing history mixes styles; consistency is valued.
- PRs must include: clear description, linked issues, steps to reproduce/verify, and screenshots for UI changes.
- Keep PRs small and focused; include `npm run lint` output or note exceptions.

## Security & Configuration
- Copy `quizgames/.env.local.example` to `quizgames/.env.local`; never commit secrets.
- Validate user inputs from PDFs; avoid introducing eval/dynamic code.
- Static game HTML lives under `public/games/`; prefer sandboxed iframes for embedding.

