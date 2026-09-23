# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Static personal landing page / resume for Maksym Soltyk (Frontend Engineer), deployed to GitHub Pages at `88Maxwell.github.io`. One HTML page with SCSS styling, a few lines of inline JS and a PWA service worker. No framework, no test suite.

## Commands

- `npm run dev` — Vite dev server on port 8000
- `npm run build` — production bundle from `src/` into `build/` with relative URLs (`base: "./"`)
- `npm run preview` — serve `build/` locally (post-build smoke test)
- `npm run deploy` — manual publish of `build/` to the `master` branch via `gh-pages` (this pushes to the live GitHub Pages site — confirm with the user before running)
- `npm run snapshots` — rebuild, then regenerate `src/public/cv.pdf` (print styles) and `src/public/og.jpg` (social preview) with headless Chrome; run after changing resume content

No unit tests. `.github/workflows/lighthouse.yml` runs Lighthouse CI on PRs with thresholds from `lighthouserc.json`; locally: `npx @lhci/cli autorun` after a build.

## Branches

`development` is the source branch (default on GitHub). Every push to it deploys: `.github/workflows/deploy.yml` builds and publishes to `master`, which holds only the built site. Never commit source to `master`.

## Architecture

- `vite.config.js` sets `root: "src"` and builds two pages: `src/index.html` (English) and `src/uk/index.html` (Ukrainian). They are full copies with translated text — any markup or content change must be made in both. Shared JS lives in `src/main.js`.
- `src/public/` is copied to `build/` as-is: `manifest.webmanifest`, `pwabuilder-sw.js`, `cv.pdf`, `og.jpg` and the `img/cv*.png` icons. Reference these with absolute paths (`/manifest.webmanifest`); Vite rewrites them for the relative base. Other images live in `src/img/` and are hashed by Vite via `url()` in SCSS.
- Fonts (Geist latin + cyrillic woff2) are self-hosted in `src/fonts/`; the hero photo ships as AVIF with a JPEG fallback via `image-set()`.
- `src/sass/index.scss` only `@use`s partials; `print.scss` turns the page into an A4 resume (also the source of `cv.pdf`). Every block file starts with `@use "../variables" as *; @use "../mixins" as *;` (Sass module system, not `@import`).
- `src/sass/blocks/*.scss` follow BEM: one file per block used in `index.html` (`.hero__title`, `.job__card`, `.pill--accent`, …).
- `src/sass/variables.scss` holds the forest-green palette (`$bg`, `$font`, `$muted`, `$accent`, `$glow`, `$glass*`) — reuse these rather than hardcoding colors.
- Animations:
  - Scroll-driven effects use native CSS `animation-timeline` (`view()` or the hero's named `--hero` timeline). Wrap them in the `scroll-driven` mixin so unsupported browsers and `prefers-reduced-motion` users get the static final state.
  - The hero is a 200vh wrapper with a sticky 100vh stage. Its photo focuses and its name fades in while you scroll through it.
  - The cursor spotlight is `.app::before`, driven by `--x`/`--y` that `main.js` sets on `pointermove`. `main.js` also drives the nav scrollspy, email copy button, card tilt and magnetic pills.
- `src/public/pwabuilder-sw.js` (PWABuilder, Workbox from CDN) caches all routes stale-while-revalidate. A Vite plugin replaces `__BUILD__` in its cache name on every build, and the worker deletes old caches on activate.
- Resume content comes from local, gitignored PDFs in the repo root (LinkedIn export `Profile.pdf`, older CV `SOLTYK-MAKSYM-FE-CV-*.pdf`).
