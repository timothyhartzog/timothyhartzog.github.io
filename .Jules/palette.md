
## 2024-05-18 - [Add aria-current attribute for Astro active links]
**Learning:** The active styling for navigation links using the `active` class is visual-only and lacks semantic meaning for screen readers. Using conditional rendering of `aria-current="page"` solves this elegantly without altering existing markup.
**Action:** Always verify if active state visual indicators on navigation links are accompanied by the proper `aria-current` attributes to ensure semantic parity for screen reader users.
