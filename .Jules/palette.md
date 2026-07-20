## 2026-07-20 - [Semantic State Parity]
**Learning:** Visual state indicators (like `.active` classes on navigation links) need semantic equivalents for screen readers to convey the same information about the current state.
**Action:** Always add `aria-current="page"` (or appropriate ARIA attributes) to active elements in Astro navigation components to maintain accessibility parity with visual styles.
