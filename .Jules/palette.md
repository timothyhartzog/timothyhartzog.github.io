## 2026-06-18 - Missing ARIA Labels in Quarto Icon Links
**Learning:** Quarto's default configuration for icon links (like `icon: github`) in navbars and footers does not automatically generate `aria-label` attributes. Without explicit configuration, this creates an accessibility issue where screen reader users encounter icon-only links without descriptive text.
**Action:** Always manually define `aria-label` for any icon-only elements in `_quarto.yml` configurations, especially in `navbar` and `page-footer` sections.
