## 2025-02-23 - Astro Header Navigation Accessibility
**Learning:** Astro navigation components (e.g., `HeaderLink.astro`) visually denote the active page using CSS classes like `.active`, but missing semantic indicators mean screen readers won't announce the current page.
**Action:** Always ensure that active visual states in navigation links are accompanied by semantic `aria-current="page"` attributes to maintain accessibility parity for screen reader users.
