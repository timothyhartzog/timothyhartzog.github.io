# Implementation Plan

## Goal
Build an ecosystem of interconnected GitHub Pages repos with a shared design system,
cross-linking mechanism, and support for Rust/WASM + D3.js interactive content.

---

## Phase 1: Shared Design System Package

Create a standalone package (`hartzog-theme`) that any repo can import for consistent styling.

### Files to create: `src/theme/` directory
- **`src/theme/colors.css`** — CSS custom properties defining the full color palette
- **`src/theme/base.css`** — Reset, typography, and shared component styles
- **`src/theme/nav-bar.js`** — Web Component (`<hartzog-nav>`) that renders a consistent
  navigation bar with links to all sites. Uses Shadow DOM so it works in any framework.
- **`src/theme/footer.js`** — Web Component (`<hartzog-footer>`) for consistent footer
- **`src/theme/package.json`** — Publishable as a GitHub npm package or usable via CDN
  (jsDelivr serves directly from GitHub repos)

### Why Web Components?
- Framework-agnostic: works in plain HTML, Astro, Rust/WASM apps, anything
- Self-contained with Shadow DOM — styles won't conflict
- A single `<script>` tag in any repo adds the nav and footer

---

## Phase 2: Site Registry & Cross-Linking

### `src/theme/sites.json` — Central registry of all repos/sites
```json
{
  "sites": [
    { "name": "Hartzog.ai", "url": "https://www.hartzog.ai", "repo": "timothyhartzog.github.io", "description": "Main blog & resources" },
    { "name": "Project Name", "url": "https://timothyhartzog.github.io/repo-name", "repo": "repo-name", "description": "..." }
  ]
}
```

### Main site (`/projects` page)
- New page that reads `sites.json` and renders cards linking to all project sites
- Auto-generated from the registry

### Child repos (flag file)
- Each child repo includes a `.hartzog.json` flag file:
  ```json
  { "parent": "https://www.hartzog.ai", "theme": true }
  ```
- The shared nav Web Component reads this and shows a "← Back to Hartzog.ai" link
- The shared nav also links to sibling projects from `sites.json`

---

## Phase 3: Rust/WASM + D3.js Integration

### `src/components/WasmLoader.astro` — Astro component that loads WASM modules
- Accepts a `wasmUrl` prop pointing to a `.wasm` file
- Handles loading state, error state
- Passes a DOM container ref to the WASM module for D3 rendering

### `src/components/D3Container.tsx` — React component for D3.js visualizations
- Provides a ref-based container for D3 to render into
- Supports both pure D3 and Rust/WASM-driven D3 scenarios

### `public/wasm/` — Directory for compiled WASM binaries
- `.gitkeep` for now; child repos will compile Rust to WASM and host here

### Template files for child repos:
- **`templates/child-repo/index.html`** — Starter HTML that imports the shared theme
  via CDN (`<script src="https://cdn.jsdelivr.net/gh/timothyhartzog/timothyhartzog.github.io@main/src/theme/nav-bar.js">`)
- **`templates/child-repo/.hartzog.json`** — Flag file template
- **`templates/child-repo/rust-wasm-setup.md`** — Instructions for setting up
  `wasm-pack` + D3.js in a new project

---

## Phase 4: Update Main Site

### Refactor existing styles
- Extract current CSS custom properties into the shared `colors.css`
- Import `hartzog-theme` into BaseLayout.astro
- Replace hardcoded nav/footer with the Web Components (with Astro SSR fallback)

### Add `/projects` page
- Grid of cards from `sites.json`
- Each card shows name, description, and status

### Update GitHub Actions
- Build step validates `sites.json` schema
- Optionally trigger rebuilds of child repos when theme changes

---

## Phase 5: Infrastructure Improvements (from earlier plan)
- Pagefind search
- RSS feed (`@astrojs/rss`)
- Tag/category filtering pages
- Dark/light mode toggle
- Giscus comments
- Plausible analytics
- SEO (Open Graph, structured data)
- CI linting and link checking

---

## File Summary

New/modified files in this repo:
1. `src/theme/colors.css` — Shared color palette
2. `src/theme/base.css` — Shared base styles
3. `src/theme/nav-bar.js` — Navigation Web Component
4. `src/theme/footer.js` — Footer Web Component
5. `src/theme/sites.json` — Site registry
6. `src/pages/projects/index.astro` — Projects listing page
7. `src/components/WasmLoader.astro` — WASM loading component
8. `src/components/D3Container.tsx` — D3.js container component
9. `public/wasm/.gitkeep` — WASM binary directory
10. `templates/child-repo/index.html` — Child repo starter
11. `templates/child-repo/.hartzog.json` — Flag file template
12. `templates/child-repo/styles.css` — Shows how to import shared theme
13. Refactor `src/styles/global.css` → imports from `src/theme/colors.css`
14. Update `src/layouts/BaseLayout.astro` to use shared components
