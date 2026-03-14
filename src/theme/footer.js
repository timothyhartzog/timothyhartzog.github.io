/**
 * Hartzog.ai — Footer Web Component
 *
 * Usage in any HTML page:
 *   <script src="https://cdn.jsdelivr.net/gh/timothyhartzog/timothyhartzog.github.io@main/src/theme/footer.js"></script>
 *   <hartzog-footer></hartzog-footer>
 *
 * Attributes:
 *   parent  — URL of the main site (default: https://www.hartzog.ai)
 *   compact — Add this attribute for a single-line footer
 */

class HartzogFooter extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    const year = new Date().getFullYear();
    const parent = this.getAttribute('parent') || 'https://www.hartzog.ai';
    const compact = this.hasAttribute('compact');

    if (compact) {
      this.shadowRoot.innerHTML = `
        <style>
          :host { display: block; margin-top: auto; font-family: 'Inter', system-ui, -apple-system, sans-serif; }
          footer { border-top: 1px solid #334155; background: rgba(15, 23, 42, 0.5); }
          .inner { max-width: 1100px; margin: 0 auto; padding: 1.25rem 1.5rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem; }
          .copy { color: #94a3b8; font-size: 0.8rem; }
          .links { display: flex; gap: 1rem; list-style: none; margin: 0; padding: 0; }
          .links a { color: #64748b; text-decoration: none; font-size: 0.8rem; transition: color 0.2s; }
          .links a:hover { color: #38bdf8; }
          @media (max-width: 640px) { .inner { flex-direction: column; text-align: center; } }
        </style>
        <footer>
          <div class="inner">
            <span class="copy">&copy; ${year} Hartzog.ai</span>
            <ul class="links">
              <li><a href="${parent}">Home</a></li>
              <li><a href="${parent}/services">Services</a></li>
              <li><a href="${parent}/contact">Contact</a></li>
              <li><a href="${parent}/privacy">Privacy</a></li>
            </ul>
          </div>
        </footer>
      `;
      return;
    }

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; margin-top: auto; font-family: 'Inter', system-ui, -apple-system, sans-serif; }
        a { color: inherit; text-decoration: none; }
        footer { border-top: 1px solid #334155; background: rgba(15, 23, 42, 0.5); }
        .inner { max-width: 1100px; margin: 0 auto; padding: 2.5rem 1.5rem 1.25rem; }
        .grid { display: grid; grid-template-columns: 1.5fr 1fr 1fr; gap: 2.5rem; margin-bottom: 2rem; }
        .brand-name { font-size: 1.1rem; font-weight: 700; color: #e2e8f0; }
        .brand-name .dot { color: #38bdf8; }
        .brand p { color: #94a3b8; font-size: 0.8rem; margin-top: 0.5rem; max-width: 28ch; line-height: 1.5; }
        .col h4 { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.08em; color: #e2e8f0; margin: 0 0 0.65rem; }
        .col ul { list-style: none; margin: 0; padding: 0; }
        .col li { margin-bottom: 0.35rem; }
        .col a { color: #94a3b8; font-size: 0.8rem; transition: color 0.2s; }
        .col a:hover { color: #38bdf8; }
        .bottom { border-top: 1px solid #334155; padding-top: 1.25rem; text-align: center; color: #64748b; font-size: 0.75rem; }
        @media (max-width: 640px) { .grid { grid-template-columns: 1fr; gap: 1.5rem; } }
      </style>

      <footer>
        <div class="inner">
          <div class="grid">
            <div class="brand">
              <a href="${parent}" class="brand-name">Hartzog<span class="dot">.ai</span></a>
              <p>AI-powered data analysis, research, and educational resources.</p>
            </div>
            <div class="col">
              <h4>Content</h4>
              <ul>
                <li><a href="${parent}/blog">Blog</a></li>
                <li><a href="${parent}/analysis">Analysis</a></li>
                <li><a href="${parent}/resources">Resources</a></li>
                <li><a href="${parent}/projects">Projects</a></li>
              </ul>
            </div>
            <div class="col">
              <h4>Business</h4>
              <ul>
                <li><a href="${parent}/services">Services</a></li>
                <li><a href="${parent}/contact">Contact</a></li>
                <li><a href="${parent}/privacy">Privacy</a></li>
                <li><a href="${parent}/terms">Terms</a></li>
              </ul>
            </div>
          </div>
          <div class="bottom">
            &copy; ${year} Hartzog.ai — All rights reserved.
          </div>
        </div>
      </footer>
    `;
  }
}

if (!customElements.get('hartzog-footer')) {
  customElements.define('hartzog-footer', HartzogFooter);
}
