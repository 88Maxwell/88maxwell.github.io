# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Static personal landing page / resume for Maksym Soltyk (Frontend Engineer), deployed to GitHub Pages at `88Maxwell.github.io`. One HTML page with SCSS styling, a few lines of inline JS and a PWA service worker. No framework, no test suite.

## Commands

- `npm run dev` — Vite dev server on port 8000
- `npm run build` — production bundle from `src/` into `build/` with relative URLs (`base: "./"`)
- `npm run preview` — serve `build/` locally (post-build smoke test)
- `npm run deploy` — publish `build/` to the `master` branch via `gh-pages` (this pushes to the live GitHub Pages site — confirm with the user before running)

There is no lint or test command.

## Branches

`development` is the source branch (default on GitHub). `master` holds only the built site and is overwritten by `npm run deploy` — never commit source there.

## Architecture

- `vite.config.js` sets `root: "src"`, so `src/index.html` is the entry and `build/` lives one level up.
- `src/public/` is copied to `build/` as-is: `manifest.webmanifest`, `pwabuilder-sw.js` and the `img/cv*.png` icons. Reference these with absolute paths (`/manifest.webmanifest`); Vite rewrites them for the relative base. Other images live in `src/img/` and are hashed by Vite via `url()` in SCSS.
- `src/sass/index.scss` only `@use`s partials. Every block file starts with `@use "../variables" as *; @use "../mixins" as *;` (Sass module system, not `@import`).
- `src/sass/blocks/*.scss` follow BEM: one file per block used in `index.html` (`.hero__title`, `.job__card`, `.pill--accent`, …).
- `src/sass/variables.scss` holds the forest-green palette (`$bg`, `$font`, `$muted`, `$accent`, `$glow`, `$glass*`) — reuse these rather than hardcoding colors.
- Animations:
  - Scroll-driven effects use native CSS `animation-timeline` (`view()` or the hero's named `--hero` timeline). Wrap them in the `scroll-driven` mixin so unsupported browsers and `prefers-reduced-motion` users get the static final state.
  - The hero is a 200vh wrapper with a sticky 100vh stage. Its photo focuses and its name fades in while you scroll through it.
  - The cursor spotlight is `.app::before`, driven by `--x`/`--y` that the inline script in `index.html` sets on `pointermove`.
- `src/public/pwabuilder-sw.js` (PWABuilder, Workbox from CDN) caches all routes stale-while-revalidate, so returning visitors see the previous deploy once before the update.
- Resume content comes from local, gitignored PDFs in the repo root (LinkedIn export `Profile.pdf`, older CV `SOLTYK-MAKSYM-FE-CV-*.pdf`).
