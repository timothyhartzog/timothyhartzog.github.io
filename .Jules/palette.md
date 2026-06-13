## 2024-06-13 - Add ARIA Labels and keyboard focus styles
**Learning:** Found several UX/a11y improvements:
1. Modal close button (`<button class="modal-close" onclick="closeModal()">✕</button>`) lacks an `aria-label`.
2. Cards are interactive (they open modals) but they are just `<div>`s (`<div class="country-card">...</div>`). They lack `tabindex="0"` and keyboard events to trigger them using the 'Enter' key. Also focus outlines are missing on interactive elements like these cards and tabs.
3. Escape key doesn't close the modal.
4. Input label missing for search country. `aria-label="Search country"` could be used.

**Action:** Update `books/nato-spending/nato-dashboard.html` to improve accessibility by addressing these issues.
