## 2024-06-25 - Quarto Navbar/Footer Icon Accessibility
**Learning:** In Quarto (`_quarto.yml`), icon-only links in navbars and footers do not automatically generate `aria-label` attributes. These must be manually defined in the YAML configuration for accessibility.
**Action:** Always verify that icon-only links in `_quarto.yml` (such as in `navbar` or `page-footer` sections) include an explicit `aria-label` key to ensure screen reader support.
