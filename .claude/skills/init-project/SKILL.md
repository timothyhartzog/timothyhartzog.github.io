---
name: init-project
description: Scaffold a new Hartzog.ai ecosystem project repo with the shared theme, SEO, business components, and CI/CD. Creates a complete business-ready GitHub Pages project.
disable-model-invocation: true
argument-hint: "[repo-name] [display-name] [description]"
---

# Initialize a New Hartzog.ai Ecosystem Project

You are creating a fully scaffolded, business-ready GitHub Pages project that integrates
with the Hartzog.ai ecosystem.

## Input

The user provides: `$ARGUMENTS`

Parse the arguments:
- **$0**: Repo/directory name (e.g., `rust-data-viz`). Required.
- **$1**: Display name (e.g., `"Rust Data Viz"`). Optional — infer from repo name.
- **Remaining**: Description. Optional — ask if not provided.

## Steps

### 1. Determine output location

Ask where to create the project:
- Sibling directory to this repo (e.g., `../$0/`)
- Or a custom path

### 2. Create the project structure

Create the following files and directories:

```
<project-root>/
├── .hartzog.json              # Ecosystem flag file
├── .github/
│   └── workflows/
│       └── deploy.yml         # GitHub Pages deployment
├── index.html                 # Main page with shared theme
├── styles.css                 # Project-specific styles using --hz-* vars
├── robots.txt                 # SEO
├── 404.html                   # Custom 404 page with shared theme
├── .gitignore                 # Standard ignores
└── pkg/                       # WASM output directory (empty)
    └── .gitkeep
```

### 3. File contents

#### `.hartzog.json`
```json
{
  "parent": "https://www.hartzog.ai",
  "theme": true,
  "name": "<display-name>",
  "description": "<description>"
}
```

#### `index.html`
Use the template from `templates/child-repo/index.html` in the main repo.
Update all placeholder text:
- `<title>` → `<display-name> | Hartzog.ai`
- `<h1>` → display name
- `<meta description>` → description
- OG tags → filled in with project details

#### `404.html`
Create a styled 404 page that uses the shared theme:
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Page Not Found | Hartzog.ai</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/timothyhartzog/timothyhartzog.github.io@main/src/theme/base.css" />
  <script src="https://cdn.jsdelivr.net/gh/timothyhartzog/timothyhartzog.github.io@main/src/theme/nav-bar.js" defer></script>
  <script src="https://cdn.jsdelivr.net/gh/timothyhartzog/timothyhartzog.github.io@main/src/theme/footer.js" defer></script>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
</head>
<body>
  <hartzog-nav parent="https://www.hartzog.ai"></hartzog-nav>
  <main class="hz-container" style="padding: 4rem 1.5rem; text-align: center; flex: 1;">
    <h1 style="font-size: 4rem; color: var(--hz-accent);">404</h1>
    <p style="color: var(--hz-text-muted); margin-bottom: 1.5rem;">Page not found.</p>
    <a href="/" style="color: var(--hz-accent);">Go back home</a>
  </main>
  <hartzog-footer compact parent="https://www.hartzog.ai"></hartzog-footer>
</body>
</html>
```

#### `styles.css`
Copy from `templates/child-repo/styles.css` in the main repo.

#### `.github/workflows/deploy.yml`
```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
permissions:
  pages: write
  id-token: write
concurrency:
  group: pages
  cancel-in-progress: false
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

#### `robots.txt`
```
User-agent: *
Allow: /
```

#### `.gitignore`
```
node_modules/
pkg/
target/
.DS_Store
```

### 4. Register in the main repo

After creating the project files, also update `src/theme/sites.json` in the main
Hartzog.ai repo to add this project:

```json
{
  "name": "<display-name>",
  "url": "https://timothyhartzog.github.io/<repo-name>",
  "repo": "<repo-name>",
  "description": "<description>",
  "icon": "code"
}
```

### 5. Initialize git (if not already a repo)

```bash
cd <project-root>
git init
git add -A
git commit -m "Initial scaffold: Hartzog.ai ecosystem project"
```

### 6. Show summary

```
Created: <display-name>
Location: <path>

Files:
  index.html          Main page with shared theme, nav, footer, CTA, newsletter
  styles.css          Project styles using --hz-* CSS variables
  .hartzog.json       Ecosystem flag (links back to hartzog.ai)
  404.html            Custom 404 with shared theme
  robots.txt          SEO
  .github/workflows/  Auto-deploy on push to main
  pkg/                WASM output directory

Shared components available via CDN:
  <hartzog-nav>       Navigation bar
  <hartzog-footer>    Footer (use compact attribute for minimal)
  <hartzog-cta>       Call-to-action banner
  <hartzog-newsletter> Email signup form
  <hartzog-contact>   Contact form

Next steps:
  1. Create the GitHub repo: gh repo create timothyhartzog/<repo-name> --public
  2. Push: git remote add origin ... && git push -u origin main
  3. Enable GitHub Pages: Settings > Pages > Source: GitHub Actions
  4. The project will appear on hartzog.ai/projects automatically
```
