## 2026-07-22 - [HeaderLink Active State Accessibility]
**Learning:** In Astro navigation components, applying an `.active` class for visual indication is not enough for screen readers. They need semantic attributes like `aria-current="page"` to understand which link represents the currently active page.
**Action:** Ensure active visual states are always accompanied by `aria-current="page"` attributes to maintain accessibility parity.

## 2024-05-18 - Missing focus indicators on Astro templates
**Learning:** Default Astro templates often omit explicit `:focus-visible` styles for interactive elements, relying on inconsistent browser defaults which hurts keyboard accessibility.
**Action:** Always verify and add `:focus-visible` styles to `a`, `button`, `input`, and `textarea` elements (usually in a global stylesheet) when working with fresh Astro templates to ensure consistent and visible focus states for keyboard users.

## 2024-07-29 - [Icon-Only Sighted Accessibility]
**Learning:** This app correctly uses `.sr-only` spans inside SVG anchor tags to ensure screen reader compatibility, but ignores sighted users without screen readers who depend on native tooltips to identify what an obscure icon does.
**Action:** When adding or verifying icon-only links that rely on `.sr-only` spans for text, always add a matching `title` attribute to the parent tag so sighted users using mice also get the context via a tooltip.
