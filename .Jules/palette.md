## 2024-05-15 - [Quarto Footer Links Missing ARIA Labels]
**Learning:** Icon-only links in Quarto's `_quarto.yml` configuration do not automatically receive ARIA labels, causing accessibility issues for screen readers.
**Action:** Always manually define `aria-label` for icon-only links in Quarto configurations (e.g., `page-footer`, `navbar`).
