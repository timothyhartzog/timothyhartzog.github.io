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

## 2024-05-14 - Fix Link Hover Feedback & Invalid CSS Color variables
**Learning:** The default Astro blog template has identical styling for un-hovered and hovered global links, which makes the links less obvious. Also, when color variables are stored as comma separated lists (e.g. `15, 18, 25` for `--black`), CSS rules like `color: var(--black);` become invalid because they lack the `rgb()` wrapping function.
**Action:** Consistently verify and wrap comma-separated RGB variables in `rgb(var(--variable))` across `.astro` style tags. Add explicit visual feedback (e.g., color transitions or background/border changes) on `a:hover` inside header and global styles.
