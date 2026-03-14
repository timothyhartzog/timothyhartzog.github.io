# Hartzog.ai — Project Context & Development Guidelines

## Project Overview

This is the main site for **Hartzog.ai**, an AI business built as a static site
using Astro + React + MDX, deployed on GitHub Pages with a planned migration
path to Google Cloud Platform.

- **Domain**: www.hartzog.ai
- **Stack**: Astro 5, React 19, MDX, Recharts, Rust/WASM, D3.js
- **Hosting**: GitHub Pages (current), Google Cloud (future)
- **Repo**: timothyhartzog/timothyhartzog.github.io

## Architecture Principles

### 1. Static-First, Server-Ready
All pages are statically generated. Never add server-side rendering unless
explicitly requested. Astro's `output: 'static'` mode must remain the default.
When server features are needed, they will run on Cloud Run behind the same CDN.

### 2. Google Cloud Migration Readiness
**Every decision must consider future GCP deployment.** The infrastructure is
defined in `infrastructure/terraform/` but is NOT active yet. Key rules:

- **Do NOT hardcode GitHub Pages URLs** in application code. Use relative paths
  or `Astro.site` for internal links.
- **Web Components in `src/theme/`** are served via jsDelivr CDN. This works on
  any hosting. Do NOT change to a hosting-specific CDN.
- **Environment-specific config** goes in `astro.config.mjs` (site URL) or
  environment variables — never inline.
- **The GitHub Actions workflow** (`.github/workflows/deploy.yml`) has commented-out
  GCP dual-deploy steps. Do NOT remove them. When GCP is activated, both deploys
  run simultaneously.
- **Cloud Build** (`infrastructure/cloudbuild.yaml`) mirrors the GitHub Actions
  pipeline. If you change the build process, update both.
- **Static assets** should use hashed filenames (Astro does this by default in
  `_astro/`). This enables aggressive CDN caching on Cloud CDN.

### 3. Cross-Repo Ecosystem
This repo is the hub of an ecosystem of GitHub Pages projects. All repos share:

- **Shared theme** (`src/theme/`) — CSS variables, Web Components (nav, footer,
  contact form, newsletter, CTA banner). Served via jsDelivr CDN.
- **Site registry** (`src/theme/sites.json`) — Central list of all projects.
  The `/projects` page and nav dropdown are auto-generated from this.
- **`.hartzog.json` flag file** — Present in child repos to link back to main site.
- **Consistent `--hz-*` CSS variables** — All styling uses these. Do NOT introduce
  new color values without adding them to `src/theme/colors.css` first.
- **Web Components use Shadow DOM** — They are framework-agnostic and work in plain
  HTML, Astro, React, Rust/WASM apps, anything. Do NOT convert them to React-only.

### 4. Portable Business Components
Forms use Formspree (replaceable with Cloud Run API later). Analytics uses
Plausible (replaceable with self-hosted or GCP). Newsletter uses Formspree
(replaceable with Resend + Cloud Run). **Never lock into a vendor without an
exit path.**

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
    └── sites.json     # Project registry
infrastructure/
├── terraform/         # GCP infrastructure (NOT active yet)
└── cloudbuild.yaml    # GCP build pipeline (NOT active yet)
templates/
└── child-repo/        # Starter files for new ecosystem projects
```

## Development Rules

### Adding New Features
- Add new colors to `src/theme/colors.css` as `--hz-*` variables
- Reusable UI that child repos need → Web Component in `src/theme/`
- Site-specific UI → Astro/React component in `src/components/`
- Interactive content → MDX in `src/content/analysis/`
- New page → `src/pages/` (and add nav link in BaseLayout.astro)

### Adding New Projects to the Ecosystem
Use `/link-project <repo-name>` or `/init-project <repo-name>` skills.
Manually: add entry to `src/theme/sites.json` and create `.hartzog.json` in child repo.

### Content
- Blog posts: `src/content/blog/<slug>.md` with frontmatter (title, description, date, tags)
- Analysis articles: `src/content/analysis/<slug>.mdx` (can import React components)
- Resources: Drop files in `public/resources/` — auto-linked on build

### SEO
Every page gets SEO via `SEOHead.astro` component in BaseLayout. Article pages
pass `type="article"`, `publishedDate`, and `tags`. Do NOT remove or skip SEO props.

### Infrastructure
- Terraform files are in `infrastructure/terraform/` — do NOT apply without explicit request
- Cloud Run is togglable via `enable_cloud_run` variable — defaults to `false`
- Child site buckets are managed via `child_sites` variable map
- `.tfvars` files are gitignored (contain secrets)

## Available Skills

| Skill | Purpose |
|---|---|
| `/link-project <repo>` | Register existing repo in ecosystem |
| `/init-project <repo>` | Scaffold new business-ready project |
| `/list-projects` | Show all linked projects |
| `/unlink-project <repo>` | Remove project from registry |
| `/gcp-deploy <cmd>` | Manage GCP infrastructure (init/plan/apply/status) |

## Tech Stack Quick Reference

| Tool | Version | Purpose |
|---|---|---|
| Astro | 5.x | Static site generator |
| React | 19.x | Interactive islands |
| MDX | via @astrojs/mdx | Interactive articles |
| Recharts | 2.x | Charts in analysis articles |
| Rust/WASM | wasm-pack | High-perf computation |
| D3.js | 7.x | Data visualization |
| Terraform | >= 1.5 | GCP infrastructure |
| Formspree | SaaS | Forms (portable) |
| Plausible | SaaS | Analytics (portable) |
