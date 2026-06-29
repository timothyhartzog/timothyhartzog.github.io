## 2024-05-13 - [Quarto Footer Accessibility]
**Learning:** In Quarto (`_quarto.yml`), icon-only links in navbars and footers do not automatically generate `aria-label` attributes; these must be manually defined for accessibility.
**Action:** Always add `aria-label` to icon-only buttons/links in `_quarto.yml` configuration files to ensure they are readable by screen readers.
