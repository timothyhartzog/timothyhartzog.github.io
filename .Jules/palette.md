## 2026-06-25 - Quarto Icon-only Links Accessibility
**Learning:** In Quarto, icon-only links in navbars and footers do not automatically generate `aria-label` attributes for screen readers.
**Action:** Always manually define `aria-label` for any icon-only links in `_quarto.yml` (e.g., in the navbar or page-footer).
