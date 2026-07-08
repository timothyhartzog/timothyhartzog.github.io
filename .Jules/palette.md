## 2026-04-03 - Quarto Configuration and Embedded Artifact Accessibility

**Learning:** Quarto's `_quarto.yml` file does not auto-generate `aria-label` attributes for icon-only links located in the `page-footer` (unlike in the `navbar`). Furthermore, raw HTML snippets embedded in Markdown (e.g., interactive Claude artifacts) often lack proper ARIA labels for icon-only buttons (like `+` and `-`).
**Action:** When working on Quarto projects, manually inspect `page-footer` configurations and raw embedded HTML artifacts for missing `aria-label` attributes, especially on icon-only buttons and links.
