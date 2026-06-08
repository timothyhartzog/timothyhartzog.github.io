# Timothy Hartzog Personal Publishing Site

A personal publishing platform for blogs, interactive articles, books, audio, and Rust/WebAssembly experiments.

## Stack

- Astro for the static site
- MDX for interactive articles
- TypeScript for site logic
- Rust/WebAssembly for heavier browser experiments
- Cloudflare Pages for future hosting
- Cloudflare R2 later for larger audio or downloadable assets

## Local development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Main sections

- `/blog/` — personal posts, notes, technology, experiments
- `/articles/` — long-form essays and interactive articles
- `/books/` — serialized books and long-form projects
- `/audio/` — spoken essays, audio notes, and audiobook-style entries
- `/apps/` — interactive HTML, JavaScript, and Rust/WASM projects

## Repository layout

```text
src/content/      Markdown and MDX content collections
src/pages/        Astro routes
src/layouts/      Shared page layouts
src/components/   Site components
src/styles/       Global styles
public/           Static files copied as-is
wasm-apps/        Rust/WebAssembly application crates
```
