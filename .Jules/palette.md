## 2024-05-18 - Missing ARIA Labels on Quarto Icon Links
**Learning:** In Quarto (`_quarto.yml`), icon-only links in footers and navbars do not automatically generate `aria-label` attributes, which creates accessibility barriers for screen reader users.
**Action:** Always manually define `aria-label` attributes for any icon-only links in Quarto configuration files.
