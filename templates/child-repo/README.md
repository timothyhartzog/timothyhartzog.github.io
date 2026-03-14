# Child Repo Template — Hartzog.ai

This template sets up a new GitHub Pages project that integrates with the Hartzog.ai ecosystem.

## Quick Start

1. **Copy these files** into your new repository
2. **Edit `.hartzog.json`** — set your project name and description
3. **Edit `index.html`** — update the title and content
4. **Register your project** — add an entry to `src/theme/sites.json` in the main `timothyhartzog.github.io` repo

## Shared Theme

The theme is loaded via CDN (jsDelivr serves directly from the main GitHub repo):

```html
<!-- CSS variables and base styles -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/timothyhartzog/timothyhartzog.github.io@main/src/theme/base.css" />

<!-- Navigation bar (Web Component) -->
<script src="https://cdn.jsdelivr.net/gh/timothyhartzog/timothyhartzog.github.io@main/src/theme/nav-bar.js" defer></script>

<!-- Footer (Web Component) -->
<script src="https://cdn.jsdelivr.net/gh/timothyhartzog/timothyhartzog.github.io@main/src/theme/footer.js" defer></script>
```

All `--hz-*` CSS variables are available for consistent styling. See `styles.css` for examples.

## Rust/WASM + D3.js Setup

### Prerequisites

```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Add WASM target
rustup target add wasm32-unknown-unknown

# Install wasm-pack
cargo install wasm-pack
```

### Create a Rust WASM project

```bash
cargo init --lib
```

Add to `Cargo.toml`:

```toml
[lib]
crate-type = ["cdylib"]

[dependencies]
wasm-bindgen = "0.2"
web-sys = { version = "0.3", features = ["Document", "Element", "HtmlElement", "Window"] }
js-sys = "0.3"
```

### Build

```bash
wasm-pack build --target web --out-dir ./pkg
```

### Use in index.html

```html
<script type="module">
  import init from './pkg/your_project.js';
  await init();
</script>
```

### D3.js Integration

Your WASM module can interact with D3 via `web-sys` DOM manipulation, or you can
use D3 in JavaScript alongside WASM-computed data:

```javascript
// Fetch data computed by WASM
const data = wasm_module.compute_data();

// Render with D3
d3.select('#chart')
  .selectAll('rect')
  .data(data)
  .join('rect')
  .attr('fill', 'var(--hz-accent)')
  // ...
```

## .hartzog.json Flag File

The `.hartzog.json` file signals that this repo is part of the Hartzog.ai ecosystem:

```json
{
  "parent": "https://www.hartzog.ai",
  "theme": true,
  "name": "Project Name",
  "description": "Short description"
}
```

The `<hartzog-nav>` Web Component reads the `parent` attribute to show a back link.

## GitHub Actions Deployment

Add this workflow as `.github/workflows/deploy.yml` to deploy on push:

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
permissions:
  pages: write
  id-token: write
jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/configure-pages@v4
      - uses: actions/upload-pages-artifact@v3
        with:
          path: '.'
      - id: deployment
        uses: actions/deploy-pages@v4
```
