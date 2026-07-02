## 2024-11-20 - Quarto Footer Icon Accessibility
**Learning:** In Quarto (`_quarto.yml`), icon-only links in page footers do not automatically generate `aria-label` attributes for screen readers, potentially failing accessibility checks.
**Action:** Always manually define `aria-label` attributes for icon-only links in Quarto configuration files (e.g., `navbar`, `page-footer`) to ensure accessibility.
