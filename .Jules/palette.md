## 2026-07-05 - [Add ARIA labels to Quarto icon-only links]
**Learning:** Quarto's `_quarto.yml` requires manual `aria-label` attributes for icon-only links in navbars and footers to ensure screen reader accessibility. They are not generated automatically.
**Action:** Always manually define `aria-label` attributes for icon-only elements configured in Quarto configuration files like `_quarto.yml`.