## 2024-05-18 - Missing ARIA Labels on Quarto Icon Links
**Learning:** In Quarto (`_quarto.yml`), icon-only links in navbars and footers do not automatically generate `aria-label` attributes when only an `icon` and `href` are provided. This causes an accessibility issue for screen readers.
**Action:** Always manually define the `aria-label` attribute for any icon-only links (e.g., social links) in Quarto navigation configurations.
