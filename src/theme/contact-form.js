/**
 * Hartzog.ai — Contact Form Web Component
 *
 * Usage in any HTML page:
 *   <script src="https://cdn.jsdelivr.net/gh/timothyhartzog/timothyhartzog.github.io@main/src/theme/contact-form.js"></script>
 *   <hartzog-contact form-id="YOUR_FORMSPREE_ID"></hartzog-contact>
 *
 * Attributes:
 *   form-id  — Formspree form ID (required)
 *   heading  — Form heading (default: "Get in Touch")
 */

class HartzogContact extends HTMLElement {
  connectedCallback() {
    const formId = this.getAttribute('form-id') || 'YOUR_FORM_ID';
    const heading = this.getAttribute('heading') || 'Get in Touch';

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
        }

        .wrapper {
          background: #1e293b;
          border: 1px solid #334155;
          border-radius: 12px;
          padding: 2rem;
          max-width: 500px;
        }

        h2 {
          font-size: 1.35rem;
          color: #e2e8f0;
          margin: 0 0 1.25rem;
        }

        .form-group {
          margin-bottom: 1rem;
        }

        label {
          display: block;
          font-size: 0.8rem;
          font-weight: 600;
          color: #e2e8f0;
          margin-bottom: 0.3rem;
        }

        input, textarea, select {
          width: 100%;
          padding: 0.55rem 0.75rem;
          background: #0f172a;
          border: 1px solid #334155;
          border-radius: 6px;
          color: #e2e8f0;
          font-size: 0.9rem;
          font-family: inherit;
          box-sizing: border-box;
          transition: border-color 0.2s;
        }

        input:focus, textarea:focus, select:focus {
          outline: none;
          border-color: #38bdf8;
        }

        textarea { resize: vertical; min-height: 80px; }

        button {
          width: 100%;
          padding: 0.65rem;
          background: #38bdf8;
          color: #0f172a;
          border: none;
          border-radius: 6px;
          font-weight: 700;
          font-size: 0.9rem;
          cursor: pointer;
          font-family: inherit;
          transition: opacity 0.2s;
          margin-top: 0.25rem;
        }

        button:hover { opacity: 0.85; }

        .success {
          text-align: center;
          padding: 2rem 1rem;
          color: #34d399;
        }

        .success h3 {
          margin: 0 0 0.5rem;
          font-size: 1.1rem;
        }

        .success p {
          color: #94a3b8;
          font-size: 0.9rem;
        }
      </style>

      <div class="wrapper">
        <h2>${heading}</h2>
        <form action="https://formspree.io/f/${formId}" method="POST">
          <div class="form-group">
            <label for="hz-name">Name</label>
            <input type="text" id="hz-name" name="name" required placeholder="Your name" />
          </div>
          <div class="form-group">
            <label for="hz-email">Email</label>
            <input type="email" id="hz-email" name="email" required placeholder="you@email.com" />
          </div>
          <div class="form-group">
            <label for="hz-message">Message</label>
            <textarea id="hz-message" name="message" rows="4" required placeholder="Tell us about your project..."></textarea>
          </div>
          <input type="hidden" name="_subject" value="Inquiry from Hartzog.ai project" />
          <button type="submit">Send Message</button>
        </form>
      </div>
    `;

    const form = this.shadowRoot.querySelector('form');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = this.shadowRoot.querySelector('button');
      btn.textContent = 'Sending...';
      btn.disabled = true;

      try {
        const res = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' },
        });

        const wrapper = this.shadowRoot.querySelector('.wrapper');
        if (res.ok) {
          wrapper.innerHTML = `
            <div class="success">
              <h3>Message Sent</h3>
              <p>Thank you! We'll get back to you within 24 hours.</p>
            </div>
          `;
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

if (!customElements.get('hartzog-contact')) {
  customElements.define('hartzog-contact', HartzogContact);
}
