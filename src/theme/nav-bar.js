/**
 * Hartzog.ai — Navigation Bar Web Component
 *
 * Usage in any HTML page:
 *   <script src="https://cdn.jsdelivr.net/gh/timothyhartzog/timothyhartzog.github.io@main/src/theme/nav-bar.js"></script>
 *   <hartzog-nav></hartzog-nav>
 *
 * Attributes:
 *   current   — URL of the current site (highlights in nav)
 *   parent    — URL of the parent site (shows back link)
 *   sites-url — URL to sites.json (defaults to main repo)
 */

class HartzogNav extends HTMLElement {
  static get observedAttributes() {
    return ['current', 'parent', 'sites-url'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._sites = [];
    this._menuOpen = false;
  }

  connectedCallback() {
    this._loadSites().then(() => this._render());
  }

  attributeChangedCallback() {
    if (this.shadowRoot.innerHTML) this._render();
  }

  async _loadSites() {
    const url = this.getAttribute('sites-url') ||
      'https://cdn.jsdelivr.net/gh/timothyhartzog/timothyhartzog.github.io@main/src/theme/sites.json';
    try {
      const res = await fetch(url);
      const data = await res.json();
      this._sites = data.sites || [];
    } catch {
      this._sites = [
        { name: 'Hartzog.ai', url: 'https://www.hartzog.dev', primary: true }
      ];
    }
  }

  _render() {
    const current = this.getAttribute('current') || window.location.origin;
    const parent = this.getAttribute('parent');
    const primary = this._sites.find(s => s.primary) || this._sites[0];
    const siblings = this._sites.filter(s => !s.primary);

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          position: sticky;
          top: 0;
          z-index: 1000;
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
        }

        nav {
          background: rgba(15, 23, 42, 0.92);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid #334155;
        }

        .nav-inner {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0.85rem 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }

        .nav-left {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }

        .back-link {
          font-size: 0.8rem;
          color: #94a3b8;
          border: 1px solid #334155;
          padding: 0.25rem 0.65rem;
          border-radius: 6px;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .back-link:hover {
          color: #38bdf8;
          border-color: #38bdf8;
        }

        .logo {
          font-size: 1.35rem;
          font-weight: 700;
          color: #e2e8f0;
          text-decoration: none;
        }

        .logo .dot {
          color: #38bdf8;
        }

        .nav-links {
          display: flex;
          list-style: none;
          gap: 1.5rem;
          margin: 0;
          padding: 0;
        }

        .nav-links a {
          color: #94a3b8;
          text-decoration: none;
          font-weight: 500;
          font-size: 0.95rem;
          transition: color 0.2s;
          white-space: nowrap;
        }

        .nav-links a:hover,
        .nav-links a[aria-current="page"] {
          color: #38bdf8;
        }

        .projects-dropdown {
          position: relative;
        }

        .projects-btn {
          background: none;
          border: none;
          color: #94a3b8;
          font-weight: 500;
          font-size: 0.95rem;
          cursor: pointer;
          font-family: inherit;
          display: flex;
          align-items: center;
          gap: 0.3rem;
          transition: color 0.2s;
          padding: 0;
        }

        .projects-btn:hover {
          color: #38bdf8;
        }

        .projects-btn svg {
          width: 12px;
          height: 12px;
          transition: transform 0.2s;
        }

        .projects-btn[aria-expanded="true"] svg {
          transform: rotate(180deg);
        }

        .dropdown-menu {
          display: none;
          position: absolute;
          top: calc(100% + 0.5rem);
          right: 0;
          background: #1e293b;
          border: 1px solid #334155;
          border-radius: 8px;
          padding: 0.5rem;
          min-width: 220px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
        }

        .dropdown-menu.open {
          display: block;
        }

        .dropdown-menu a {
          display: block;
          padding: 0.5rem 0.75rem;
          color: #e2e8f0;
          text-decoration: none;
          border-radius: 6px;
          font-size: 0.9rem;
          transition: background 0.15s;
        }

        .dropdown-menu a:hover {
          background: rgba(56, 189, 248, 0.1);
        }

        .dropdown-menu .desc {
          display: block;
          font-size: 0.75rem;
          color: #64748b;
          margin-top: 0.15rem;
        }

        /* Mobile hamburger */
        .menu-toggle {
          display: none;
          background: none;
          border: none;
          color: #e2e8f0;
          cursor: pointer;
          padding: 0.25rem;
        }

        .menu-toggle svg {
          width: 24px;
          height: 24px;
        }

        a { color: inherit; text-decoration: none; }

        @media (max-width: 640px) {
          .menu-toggle { display: block; }

          .nav-links {
            display: none;
            flex-direction: column;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: #1e293b;
            border-bottom: 1px solid #334155;
            padding: 1rem 1.5rem;
            gap: 0.75rem;
          }

          .nav-links.open { display: flex; }

          .dropdown-menu {
            position: static;
            box-shadow: none;
            border: none;
            padding: 0 0 0 1rem;
          }
        }
      </style>

      <nav>
        <div class="nav-inner">
          <div class="nav-left">
            ${parent ? `<a class="back-link" href="${parent}">&larr; Hartzog.ai</a>` : ''}
            <a class="logo" href="${primary ? primary.url : '/'}">
              ${primary ? primary.name.replace('.ai', '<span class="dot">.ai</span>') : 'Hartzog<span class="dot">.ai</span>'}
            </a>
          </div>

          <button class="menu-toggle" aria-label="Toggle menu">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 12h18M3 6h18M3 18h18"/>
            </svg>
          </button>

          <ul class="nav-links">
            <li><a href="${primary ? primary.url : '/'}" ${this._isCurrent(primary?.url, current) ? 'aria-current="page"' : ''}>Home</a></li>
            <li><a href="${primary ? primary.url : ''}/blog" ${current.includes('/blog') ? 'aria-current="page"' : ''}>Blog</a></li>
            <li><a href="${primary ? primary.url : ''}/analysis" ${current.includes('/analysis') ? 'aria-current="page"' : ''}>Analysis</a></li>
            <li><a href="${primary ? primary.url : ''}/resources" ${current.includes('/resources') ? 'aria-current="page"' : ''}>Resources</a></li>
            ${siblings.length > 0 ? `
              <li class="projects-dropdown">
                <button class="projects-btn" aria-expanded="false">
                  Projects
                  <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M2 4l4 4 4-4"/>
                  </svg>
                </button>
                <div class="dropdown-menu">
                  ${siblings.map(s => `
                    <a href="${s.url}">
                      ${s.name}
                      ${s.description ? `<span class="desc">${s.description}</span>` : ''}
                    </a>
                  `).join('')}
                  <a href="${primary ? primary.url : ''}/projects">
                    All Projects
                    <span class="desc">View all projects</span>
                  </a>
                </div>
              </li>
            ` : `
              <li><a href="${primary ? primary.url : ''}/projects" ${current.includes('/projects') ? 'aria-current="page"' : ''}>Projects</a></li>
            `}
          </ul>
        </div>
      </nav>
    `;

    this._attachEvents();
  }

  _isCurrent(url, current) {
    if (!url) return false;
    try {
      return new URL(url).origin === new URL(current).origin;
    } catch {
      return url === current;
    }
  }

  _attachEvents() {
    const toggle = this.shadowRoot.querySelector('.menu-toggle');
    const links = this.shadowRoot.querySelector('.nav-links');
    if (toggle && links) {
      toggle.addEventListener('click', () => {
        links.classList.toggle('open');
      });
    }

    const btn = this.shadowRoot.querySelector('.projects-btn');
    const menu = this.shadowRoot.querySelector('.dropdown-menu');
    if (btn && menu) {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const open = menu.classList.toggle('open');
        btn.setAttribute('aria-expanded', String(open));
      });
      document.addEventListener('click', () => {
        menu.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      });
    }
  }
}

if (!customElements.get('hartzog-nav')) {
  customElements.define('hartzog-nav', HartzogNav);
}
