## 2026-06-22 - Quarto Icon-Only Links Missing ARIA Labels
**Learning:** In Quarto (`_quarto.yml`), icon-only links in navbars and footers do not automatically generate `aria-label` attributes; these must be manually defined for accessibility.
**Action:** Always manually define `aria-label` for icon-only links (e.g. `aria-label: GitHub` alongside `icon: github` and `href`) in Quarto configurations.
