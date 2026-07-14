---
title: "Example Book"
description: "A starter book template showing how to write and publish books with Quarto."
date: "2026-04-03"
---

# Example Book {.unnumbered}

This is a sample book to demonstrate Quarto's book-style content. You can use this
as a template for your own books.

## How Books Work

Each book lives in its own folder under `books/`. A book is just a collection of
`.qmd` files with a sidebar for navigation (configured in `_quarto.yml`).

### Adding a New Book

1. Create a folder: `books/my-book/`
2. Add `index.qmd` (preface/intro) and chapter files (`chapter1.qmd`, etc.)
3. Add the sidebar configuration to `_quarto.yml`:

```yaml
sidebar:
  - id: my-book
    title: "My Book Title"
    style: floating
    contents:
      - books/my-book/index.qmd
      - section: "Part I"
        contents:
          - books/my-book/chapter1.qmd
          - books/my-book/chapter2.qmd
```

### Using Claude Artifacts in Books

You can embed Claude artifacts in book chapters the same way as blog posts —
use inline `.claude-artifact` divs or the `{{< claude-artifact >}}` shortcode.
