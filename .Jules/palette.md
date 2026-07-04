## 2026-07-04 - [Quarto Page Footer Icon Links]
**Learning:** In Quarto (`_quarto.yml`), icon-only links in navbars and footers do not automatically generate `aria-label` attributes. They must be manually defined for accessibility.
**Action:** Always verify and manually add `aria-label` attributes to icon-only links in `_quarto.yml` configurations for both `navbar` and `page-footer` sections.
