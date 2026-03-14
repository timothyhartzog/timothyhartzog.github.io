/**
 * Hartzog.ai — Newsletter Signup Web Component
 *
 * Usage in any HTML page:
 *   <script src="https://cdn.jsdelivr.net/gh/timothyhartzog/timothyhartzog.github.io@main/src/theme/newsletter.js"></script>
 *   <hartzog-newsletter form-id="YOUR_FORMSPREE_ID"></hartzog-newsletter>
 *
 * Attributes:
 *   form-id  — Formspree form ID
 *   heading  — Heading text (default: "Stay Updated")
 *   text     — Description text
 */

class HartzogNewsletter extends HTMLElement {
  connectedCallback() {
    const formId = this.getAttribute('form-id') || 'YOUR_FORM_ID';
    const heading = this.getAttribute('heading') || 'Stay Updated';
    const text = this.getAttribute('text') || 'Get notified about new articles, analysis, and resources.';

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
        }

        .wrapper {
          background: linear-gradient(135deg, #1e293b, rgba(56, 189, 248, 0.05));
          border: 1px solid #334155;
          border-radius: 12px;
          padding: 2rem;
          text-align: center;
          max-width: 500px;
        }

        h3 {
          font-size: 1.15rem;
          color: #e2e8f0;
          margin: 0 0 0.4rem;
        }

        p {
          color: #94a3b8;
          font-size: 0.85rem;
          margin: 0 0 1rem;
        }

        form {
          display: flex;
          gap: 0.5rem;
        }

        input {
          flex: 1;
          padding: 0.55rem 0.75rem;
          background: #0f172a;
          border: 1px solid #334155;
          border-radius: 6px;
          color: #e2e8f0;
          font-size: 0.85rem;
          font-family: inherit;
          min-width: 0;
          transition: border-color 0.2s;
        }

        input:focus {
          outline: none;
          border-color: #38bdf8;
        }

        button {
          padding: 0.55rem 1.1rem;
          background: #38bdf8;
          color: #0f172a;
          border: none;
          border-radius: 6px;
          font-weight: 700;
          font-size: 0.85rem;
          cursor: pointer;
          font-family: inherit;
          white-space: nowrap;
          transition: opacity 0.2s;
        }

        button:hover { opacity: 0.85; }

        .success {
          color: #34d399;
          font-size: 0.9rem;
          padding: 0.5rem 0;
        }
      </style>

      <div class="wrapper">
        <h3>${heading}</h3>
        <p>${text}</p>
        <form action="https://formspree.io/f/${formId}" method="POST">
          <input type="email" name="email" required placeholder="you@email.com" aria-label="Email address" />
          <input type="hidden" name="_subject" value="Newsletter signup from Hartzog.ai" />
          <button type="submit">Subscribe</button>
        </form>
      </div>
    `;

    const form = this.shadowRoot.querySelector('form');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = this.shadowRoot.querySelector('button');
      btn.textContent = 'Subscribing...';
      btn.disabled = true;

      try {
        const res = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' },
        });

        if (res.ok) {
          form.outerHTML = '<div class="success">Subscribed! You\'ll hear from us soon.</div>';
        } else {
          btn.textContent = 'Try Again';
          btn.disabled = false;
        }
      } catch {
        btn.textContent = 'Try Again';
        btn.disabled = false;
      }
    });
  }
}

if (!customElements.get('hartzog-newsletter')) {
  customElements.define('hartzog-newsletter', HartzogNewsletter);
}
