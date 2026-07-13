## 2025-02-14 - Quarto Navbar/Footer Icon Links Missing ARIA Labels
**Learning:** In Quarto (`_quarto.yml`), icon-only links configured in the `navbar` or `page-footer` sections (e.g., `- icon: github`) do not automatically generate `aria-label` attributes in the rendered HTML output. This creates accessibility issues for screen reader users who cannot identify the purpose of the link.
**Action:** Always manually define `aria-label: "[Name]"` alongside the `icon` and `href` properties for all icon-only links in Quarto configurations to ensure screen reader accessibility.
