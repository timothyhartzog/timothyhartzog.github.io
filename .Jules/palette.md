## 2026-07-22 - [HeaderLink Active State Accessibility]
**Learning:** In Astro navigation components, applying an `.active` class for visual indication is not enough for screen readers. They need semantic attributes like `aria-current="page"` to understand which link represents the currently active page.
**Action:** Ensure active visual states are always accompanied by `aria-current="page"` attributes to maintain accessibility parity.
## 2024-07-23 - Link Focus States in Base Astro Templates
**Learning:** Default templates often rely entirely on browser-default focus indicators, which can look broken or provide poor contrast across different browsers (especially when links are icon-only SVGs or have custom active states).
**Action:** When inspecting default templates, always explicitly define `:focus-visible` states to match or exceed the contrast of existing `:hover` states, ensuring cross-browser keyboard accessibility parity.
