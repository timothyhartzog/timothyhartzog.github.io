# Hartzog.ai — Project Context & Development Guidelines

## Project Overview

This is the main site for **Hartzog.ai**, an AI business built as a static site
using Astro + React + MDX, deployed on Azure Static Web Apps (primary) with
GitHub Pages as a backup mirror.

- **Domain**: www.hartzog.ai
- **Stack**: Astro 5, React 19, MDX, Recharts, Rust/WASM, D3.js
- **Primary Hosting**: Azure Static Web Apps
- **Backup Hosting**: GitHub Pages (identical build from same repo)
- **Repo**: timothyhartzog/timothyhartzog.github.io

## Architecture Principles

### 1. Static-First, Server-Ready
All pages are statically generated. Never add server-side rendering unless
explicitly requested. Astro's `output: 'static'` mode must remain the default.
Azure SWA supports API routes via Azure Functions if server features are needed later.

### 2. Azure Static Web Apps + GitHub Pages Dual Deploy
**Every decision must consider both hosting targets.** The deploy workflow
(`.github/workflows/deploy.yml`) builds once and deploys to both:

- **Azure SWA** (primary) — serves `www.hartzog.ai` with global CDN, free SSL,
  and PR preview environments.
- **GitHub Pages** (backup) — serves `timothyhartzog.github.io` as an identical
  mirror.

Key rules:

- **Do NOT hardcode hosting-specific URLs** in application code. Use relative paths
  or `Astro.site` for internal links.
- **Web Components in `src/theme/`** are served via jsDelivr CDN. This works on
  any hosting. Do NOT change to a hosting-specific CDN.
- **Environment-specific config** goes in `astro.config.mjs` (site URL) or
  environment variables — never inline.
- **Azure SWA routing** is configured in `staticwebapp.config.json` at the repo root.
  This file controls cache headers, security headers, and fallback routing.
- **Static assets** should use hashed filenames (Astro does this by default in
  `_astro/`). This enables aggressive CDN caching on both hosts.

### 3. Subdomain App Ecosystem
This repo is the hub of an ecosystem of subdomain applications. Each app is a
separate repo with its own Azure SWA instance.

- **Main site**: `www.hartzog.ai` (this repo)
- **Subdomain apps**: `<app-name>.hartzog.ai` (separate repos)
- **Shared theme** (`src/theme/`) — CSS variables, Web Components (nav, footer,
  contact form, newsletter, CTA banner). Served via jsDelivr CDN.
- **Site registry** (`src/theme/sites.json`) — Central list of all projects and apps.
  The `/projects` page and homepage apps section are auto-generated from this.
- **`.hartzog.json` flag file** — Present in child repos to link back to main site.
  Includes `subdomain`, `type`, and `hosting` fields.
- **Consistent `--hz-*` CSS variables** — All styling uses these. Do NOT introduce
  new color values without adding them to `src/theme/colors.css` first.
- **Web Components use Shadow DOM** — They are framework-agnostic and work in plain
  HTML, Astro, React, Rust/WASM apps, anything. Do NOT convert them to React-only.

### 4. Portable Business Components
Forms use Formspree (replaceable with Azure Functions API later). Analytics uses
Plausible (replaceable with self-hosted or Application Insights). Newsletter uses
Formspree (replaceable with Resend + Azure Functions). **Never lock into a vendor
without an exit path.**

## File Structure

```
src/
├── components/        # Astro + React components (site-specific)
├── content/           # Blog posts (md) and analysis articles (mdx)
│   ├── blog/
│   └── analysis/
├── layouts/           # BaseLayout.astro (uses SEOHead, shared styles)
├── pages/             # All routes
├── styles/            # global.css (imports theme/base.css)
└── theme/             # SHARED across all repos via CDN
    ├── colors.css     # --hz-* CSS variables (single source of truth)
    ├── base.css       # Reset, typography, utilities
    ├── nav-bar.js     # <hartzog-nav> Web Component
    ├── footer.js      # <hartzog-footer> Web Component
    ├── contact-form.js
    ├── newsletter.js
    ├── cta-banner.js
    └── sites.json     # Project & app registry
infrastructure/
└── azure/             # Azure SWA setup documentation
templates/
└── child-repo/        # Starter files for new subdomain apps
    ├── .hartzog.json
    ├── staticwebapp.config.json
    └── README.md
staticwebapp.config.json  # Azure SWA routing & headers (repo root)
```

## Development Rules

### Adding New Features
- Add new colors to `src/theme/colors.css` as `--hz-*` variables
- Reusable UI that child repos need → Web Component in `src/theme/`
- Site-specific UI → Astro/React component in `src/components/`
- Interactive content → MDX in `src/content/analysis/`
- New page → `src/pages/` (and add nav link in BaseLayout.astro)

### Adding New Subdomain Apps
1. Create a new GitHub repo for the app
2. Copy `templates/child-repo/` files into it
3. Edit `.hartzog.json` with the app name and subdomain
4. Create an Azure SWA resource and configure the subdomain DNS
5. Add entry to `src/theme/sites.json` with `"type": "app"` and `"subdomain": "<name>"`
6. The app will automatically appear on the homepage and `/projects` page

Use `/link-project <repo-name>` or `/init-project <repo-name>` skills for automation.

### Content
- Blog posts: `src/content/blog/<slug>.md` with frontmatter (title, description, date, tags)
- Analysis articles: `src/content/analysis/<slug>.mdx` (can import React components)
- Resources: Drop files in `public/resources/` — auto-linked on build

### SEO
Every page gets SEO via `SEOHead.astro` component in BaseLayout. Article pages
pass `type="article"`, `publishedDate`, and `tags`. Do NOT remove or skip SEO props.

### Infrastructure
- Azure SWA setup docs are in `infrastructure/azure/`
- Each subdomain app gets its own Azure SWA instance
- `staticwebapp.config.json` at repo root controls Azure SWA behavior
- The deploy workflow builds once and deploys to both Azure SWA and GitHub Pages
- DNS is managed externally (add CNAME records for each subdomain)

## Available Skills

| Skill | Purpose |
|---|---|
| `/link-project <repo>` | Register existing repo in ecosystem |
| `/init-project <repo>` | Scaffold new subdomain app |
| `/list-projects` | Show all linked projects |
| `/unlink-project <repo>` | Remove project from registry |

## Tech Stack Quick Reference

| Tool | Version | Purpose |
|---|---|---|
| Astro | 5.x | Static site generator |
| React | 19.x | Interactive islands |
| MDX | via @astrojs/mdx | Interactive articles |
| Recharts | 2.x | Charts in analysis articles |
| Rust/WASM | wasm-pack | High-perf computation |
| D3.js | 7.x | Data visualization |
| Azure SWA | - | Primary hosting + CDN |
| GitHub Pages | - | Backup hosting |
| Formspree | SaaS | Forms (portable) |
| Plausible | SaaS | Analytics (portable) |
