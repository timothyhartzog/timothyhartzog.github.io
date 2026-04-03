# Hartzog.ai — Project Context & Development Guidelines

## Project Overview

This is the main site for **Timothy Hartzog / Hartzog.ai**, built as a static site
using **Quarto**, deployed on GitHub Pages.

- **Domain**: www.hartzog.dev
- **Stack**: Quarto 1.6+, SCSS, Lua shortcodes
- **Hosting**: GitHub Pages
- **Repo**: timothyhartzog/timothyhartzog.github.io

## Architecture

### Static Quarto Website
The site uses `project: type: website` in `_quarto.yml`. All pages are `.qmd`
files rendered to static HTML. Output goes to `_site/`.

### GitHub Pages Deploy
The deploy workflow (`.github/workflows/deploy.yml`) builds with
`quarto render` and deploys to GitHub Pages.

### Key Rules
- Do NOT hardcode hosting-specific URLs — use relative paths
- All styling uses `styles/custom.scss` (dark theme based on Darkly)

## File Structure

```
_quarto.yml              # Main Quarto config (site, navbar, sidebars)
index.qmd                # Homepage
about.qmd                # About page
blog/
├── index.qmd            # Blog listing page (auto-generates from posts/)
└── posts/
    └── <slug>/
        └── index.qmd    # Blog post (with optional artifact .html files)
books/
├── index.qmd            # Books listing page
└── <book-name>/
    ├── index.qmd        # Book intro/preface
    ├── chapter1.qmd     # Chapters
    └── chapter2.qmd
styles/
├── custom.scss          # Site-wide SCSS theme overrides
└── claude-artifacts.css # Styling for Claude artifact embeds
_extensions/
└── claude-artifact/     # Shortcode for embedding Claude artifacts
    ├── _extension.yml
    └── claude-artifact.lua
images/                  # Site images (favicon, etc.)
.github/workflows/
└── deploy.yml           # CI: quarto render → deploy to GitHub Pages
```

## Development

### Commands
- `quarto preview` — local dev server with hot reload
- `quarto render` — build site to `_site/`

### Adding a Blog Post
1. Create `blog/posts/<slug>/index.qmd`
2. Add YAML frontmatter: `title`, `description`, `date`, `categories`
3. Write content in Markdown/QMD
4. The blog listing page auto-discovers posts

### Adding a Book
1. Create `books/<book-name>/` with `index.qmd` and chapter files
2. Add sidebar config to `_quarto.yml`:
```yaml
sidebar:
  - id: my-book
    title: "Book Title"
    style: floating
    contents:
      - books/my-book/index.qmd
      - books/my-book/chapter1.qmd
```

### Embedding Claude Artifacts

**Method 1: Inline HTML** — paste artifact HTML in a fenced div:
```markdown
::: {.claude-artifact}
<div>Your artifact HTML here</div>
<script>// Your artifact JS here</script>
:::
```

**Method 2: External file** — save artifact as `.html`, embed via shortcode:
```markdown
{{< claude-artifact file="my-artifact.html" height="400px" title="My Widget" >}}
```

Drop the `.html` file in the same folder as the post's `index.qmd`.

### Adding Pages
- Create a new `.qmd` file in the root
- Add it to the navbar in `_quarto.yml`

## Styling
- Theme: Darkly (Bootstrap dark) + `styles/custom.scss`
- Brand colors: `#0f172a` (bg), `#1e293b` (card), `#38bdf8` (accent)
- Artifact styles: `styles/claude-artifacts.css`
