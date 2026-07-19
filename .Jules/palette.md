## 2024-07-19 - Semantic Active States in Navigation
**Learning:** In Astro navigation components, active visual states (like `.active` classes) often lack semantic parity for screen readers, leading to confusing navigation experiences for users who rely on assistive technologies.
**Action:** Always ensure that visual active states are accompanied by the semantic `aria-current="page"` attribute to maintain accessibility parity.
