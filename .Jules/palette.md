## 2026-07-12 - Missing auto-generated aria-labels for icon-only links in Quarto footer/navbar
**Learning:** In Quarto (`_quarto.yml`), icon-only links in navbars and footers do not automatically generate `aria-label` attributes; these must be manually defined for accessibility.
**Action:** Always manually verify and add `aria-label` to any `icon:` entries in `_quarto.yml` `navbar` and `page-footer` sections.
