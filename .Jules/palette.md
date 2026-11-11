## 2026-07-22 - [HeaderLink Active State Accessibility]
**Learning:** In Astro navigation components, applying an `.active` class for visual indication is not enough for screen readers. They need semantic attributes like `aria-current="page"` to understand which link represents the currently active page.
**Action:** Ensure active visual states are always accompanied by `aria-current="page"` attributes to maintain accessibility parity.

## 2024-05-18 - Missing focus indicators on Astro templates
**Learning:** Default Astro templates often omit explicit `:focus-visible` styles for interactive elements, relying on inconsistent browser defaults which hurts keyboard accessibility.
**Action:** Always verify and add `:focus-visible` styles to `a`, `button`, `input`, and `textarea` elements (usually in a global stylesheet) when working with fresh Astro templates to ensure consistent and visible focus states for keyboard users.

## 2025-02-12 - Missing tooltips for icon-only links with `.sr-only` text
**Learning:** Default Astro templates often include `.sr-only` span tags inside icon-only anchor elements (like social links) which is great for screen readers, but they often lack native `title` attributes on the parent anchor, leaving sighted users without tooltips when hovering.
**Action:** Always complement `.sr-only` text within icon-only `<a>` or `<button>` elements with a corresponding native `title` attribute on the parent tag to provide on-hover tooltips for sighted users while maintaining screen reader parity.

## 2026-08-02 - [Navigation ARIA Labels]
**Learning:** Default Astro templates often omit `aria-label` on navigation `<nav>` elements. Since sites can have multiple navigation regions (main, footer, breadcrumbs, etc.), providing a descriptive ARIA label helps screen reader users understand the purpose of each navigation region.
**Action:** Always verify and add an appropriate `aria-label` (e.g., `aria-label="Main"`) to `<nav>` elements in Astro templates to improve screen reader accessibility.
## 2025-02-12 - Explicit Link Hover States & Invalid CSS Colors
**Learning:** In the default Astro template, CSS color variables are often defined as comma-separated RGB values (e.g., `--black: 15, 18, 25`). Using these directly without the `rgb()` or `rgba()` function results in invalid CSS syntax which can silently fail to apply styling. Furthermore, default link tags (`<a>`) and explicit component navigation links (`nav a`) frequently omit explicit `:hover` styles, leading to poor user visual feedback and interactions.
**Action:** When working with Astro default templates, always explicitly verify that variables are wrapped in `rgb()` or `rgba()` when used for colors or transparency (e.g., `rgba(var(--black), 0.1)`). Consistently implement explicit `:hover` styles with smooth transitions for interactive elements to provide clear visual feedback to users.
