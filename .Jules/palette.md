## 2026-06-21 - Quarto `_quarto.yml` icon-only links accessibility
**Learning:** In Quarto (`_quarto.yml`), icon-only links in navbars and footers do not automatically generate `aria-label` attributes; these must be manually defined for accessibility.
**Action:** When adding or modifying icon-only links in Quarto configuration files, always explicitly add an `aria-label` attribute with a descriptive text.
