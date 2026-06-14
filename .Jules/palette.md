## 2024-06-14 - A11y Canvas Elements
**Learning:** Found several `<canvas>` elements missing `aria-label` or `role="img"` attributes in `debt-dashboard.html` which creates an accessibility gap for screen reader users who miss chart content.
**Action:** Add `role="img"` and `aria-label` to canvas elements specifically in the interactive dashboards.
