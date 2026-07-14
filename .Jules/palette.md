## 2026-07-14 - Quarto Navbar and Footer Icon Accessibility
**Learning:** Quarto does not automatically generate `aria-label` attributes for icon-only links in navbars and footers configuration (`_quarto.yml`). Without manual labels, screen readers will read these links improperly (e.g. as empty links or full URLs).
**Action:** Always manually define `aria-label` for icon-only links in `_quarto.yml` navbars and page-footers to ensure accessibility for screen reader users.
