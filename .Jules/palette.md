## 2024-07-09 - Missing ARIA Labels on Quarto Footers and Raw HTML Components
**Learning:** Icon-only interactive elements in raw HTML components within Quarto files (e.g., custom dashboards) and the `page-footer` configuration in `_quarto.yml` frequently lack proper accessible names (`aria-label`) by default.
**Action:** Always manually audit and add `aria-label` attributes to icon-only buttons (`<button>`) in raw HTML and icon-only links in `_quarto.yml` headers/footers to ensure accessibility for screen readers.
