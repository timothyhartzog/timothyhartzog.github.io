# Project Plan: WASM-Powered Interactive Platform on Cloudflare

## 1. Vision & Objectives
Transform the existing Quarto-based website into a high-performance, WebAssembly (WASM) powered personal platform. It will be hosted on Cloudflare, capable of hosting multiple distinct blogs, interactive HTML/JS computational essays, multi-chapter books, and audio files (podcasts/narrations).

## 2. Architecture & Tech Stack
- **Core Generator**: Quarto (Static Site Generator)
- **Hosting & Edge**: Cloudflare Pages (migrating from Azure SWA)
- **Computational Engine (WASM)**:
  - **Observable JS (OJS)** for reactive HTML/JS essays.
  - **Pyodide / Shinylive / WebR** (WebAssembly) to run Python/R directly in the browser.
- **Media**: HTML5 audio integration + shortcodes.

## 3. Implementation Phases

### Phase 1: Cloudflare Hosting Migration (Infrastructure)
- **Objective**: Move deployment to Cloudflare Pages for fast, edge-cached delivery of WASM assets.
- **Tasks**:
  - Remove Azure `staticwebapp.config.json` and old deployment workflows.
  - Create a new GitHub Actions workflow (`.github/workflows/cloudflare.yml`) using `cloudflare/wrangler-action`.
  - Add a `wrangler.toml` (if needed for Cloudflare specific headers/routing).
  - Update `CLAUDE.md` and README to reflect the new infrastructure.

### Phase 2: Multiple Blogs Architecture
- **Objective**: Support distinct blogs (e.g., Tech, Personal, Essays) instead of a single feed.
- **Tasks**:
  - Create distinct directories (e.g., `blogs/tech/`, `blogs/personal/`).
  - Create listing pages (`index.qmd`) for each blog with custom metadata.
  - Update `_quarto.yml` to feature a "Blogs" dropdown in the navigation bar.

### Phase 3: Interactive Computational Essays (WASM / JS)
- **Objective**: Enable interactive code execution entirely in the browser.
- **Tasks**:
  - Set up a Quarto template/example for an Observable JS (OJS) essay.
  - Add WASM-based code execution capabilities (e.g., using `quarto-webr` or `shinylive` extensions) so users can run scripts without a backend server.
  - Build an initial "Computational Essay" demonstrating live data manipulation.

### Phase 4: Audio Files & Media Integration
- **Objective**: First-class support for audio playback.
- **Tasks**:
  - Create an audio shortcode (`_extensions/audio/`) or leverage HTML5 `<audio>` tags styled with custom SCSS.
  - Create an example post featuring an embedded audio track/podcast.

### Phase 5: Enhanced Books
- **Objective**: Integrate the interactive elements into the existing book structure.
- **Tasks**:
  - Maintain the existing `books/` routing.
  - Inject WASM/interactive components into book chapters.

## 4. Proposed Action Plan
We can begin executing this iteratively. **Phase 1** (Cloudflare Migration) and **Phase 2** (Multiple Blogs) can be implemented immediately, followed by adding the WASM computational examples.
