/**
 * Hartzog.ai — Call-to-Action Banner Web Component
 *
 * Usage in any HTML page:
 *   <script src="https://cdn.jsdelivr.net/gh/timothyhartzog/timothyhartzog.github.io@main/src/theme/cta-banner.js"></script>
 *   <hartzog-cta
 *     heading="Need help with your data?"
 *     text="Let's build something great together."
 *     button-text="Get Started"
 *     button-url="https://www.hartzog.ai/contact">
 *   </hartzog-cta>
 */

class HartzogCTA extends HTMLElement {
  connectedCallback() {
    const heading = this.getAttribute('heading') || 'Ready to get started?';
    const text = this.getAttribute('text') || 'Let Hartzog.ai help with your next project.';
    const btnText = this.getAttribute('button-text') || 'Contact Us';
    const btnUrl = this.getAttribute('button-url') || 'https://www.hartzog.ai/contact';

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
          margin: 2rem 0;
        }

        .banner {
          background: linear-gradient(135deg, #1e293b 0%, rgba(56, 189, 248, 0.08) 100%);
          border: 1px solid rgba(56, 189, 248, 0.2);
          border-radius: 12px;
          padding: 2.5rem;
          text-align: center;
        }

        h3 {
          font-size: 1.5rem;
          color: #e2e8f0;
          margin: 0 0 0.5rem;
        }

        p {
          color: #94a3b8;
          font-size: 0.95rem;
          margin: 0 0 1.5rem;
        }

        a {
          display: inline-block;
          padding: 0.7rem 2rem;
          background: #38bdf8;
          color: #0f172a;
          border-radius: 8px;
          font-weight: 700;
          font-size: 0.95rem;
          text-decoration: none;
          transition: opacity 0.2s;
        }

        a:hover { opacity: 0.85; }
      </style>

      <div class="banner">
        <h3>${heading}</h3>
        <p>${text}</p>
        <a href="${btnUrl}">${btnText}</a>
      </div>
    `;
  }
}

if (!customElements.get('hartzog-cta')) {
  customElements.define('hartzog-cta', HartzogCTA);
}
