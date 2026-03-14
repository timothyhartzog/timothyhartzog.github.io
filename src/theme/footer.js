/**
 * Hartzog.ai — Footer Web Component
 *
 * Usage in any HTML page:
 *   <script src="https://cdn.jsdelivr.net/gh/timothyhartzog/timothyhartzog.github.io@main/src/theme/footer.js"></script>
 *   <hartzog-footer></hartzog-footer>
 */

class HartzogFooter extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    const year = new Date().getFullYear();
    const parent = this.getAttribute('parent') || 'https://www.hartzog.ai';

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          margin-top: auto;
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
        }

        footer {
          border-top: 1px solid #334155;
          background: rgba(15, 23, 42, 0.5);
        }

        .footer-inner {
          max-width: 1100px;
          margin: 0 auto;
          padding: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .copyright {
          color: #94a3b8;
          font-size: 0.85rem;
        }

        .footer-links {
          display: flex;
          gap: 1.25rem;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .footer-links a {
          color: #64748b;
          text-decoration: none;
          font-size: 0.8rem;
          transition: color 0.2s;
        }

        .footer-links a:hover {
          color: #38bdf8;
        }

        @media (max-width: 640px) {
          .footer-inner {
            flex-direction: column;
            text-align: center;
          }
        }
      </style>

      <footer>
        <div class="footer-inner">
          <span class="copyright">&copy; ${year} Hartzog.ai — All rights reserved.</span>
          <ul class="footer-links">
            <li><a href="${parent}">Home</a></li>
            <li><a href="${parent}/blog">Blog</a></li>
            <li><a href="${parent}/projects">Projects</a></li>
            <li><a href="${parent}/resources">Resources</a></li>
          </ul>
        </div>
      </footer>
    `;
  }
}

if (!customElements.get('hartzog-footer')) {
  customElements.define('hartzog-footer', HartzogFooter);
}
