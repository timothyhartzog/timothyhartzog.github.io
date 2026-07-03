## 2024-05-24 - Quarto icon-only links missing ARIA labels
**Learning:** In Quarto (`_quarto.yml`), icon-only links in navbars and footers do not automatically generate `aria-label` attributes. This presents an accessibility issue for screen readers.
**Action:** Always verify and manually add `aria-label` attributes to icon-only links in Quarto configuration files to ensure accessibility.
