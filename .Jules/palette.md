## 2024-05-24 - Missing ARIA Labels in Embedded/Raw HTML
**Learning:** Embedded interactive components (like raw HTML within Quarto `.qmd` files or custom dashboard HTML files) frequently lack proper ARIA labels for icon-only buttons (like `+`, `-`, `X`) or inputs without visible labels. These aren't caught by typical component-library defaults because they are raw HTML.
**Action:** When adding or reviewing custom interactive widgets, calculators, or dashboards in raw HTML/MDX, specifically check and add `aria-label` attributes to any icon-only buttons or stand-alone inputs.
