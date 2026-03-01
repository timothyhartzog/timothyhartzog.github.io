/* ============================================
   Interactive GitHub Pages - app.js
   All client-side interactivity for the site
   ============================================ */

(function () {
  'use strict';

  // ---- Theme Toggle ----
  const html = document.documentElement;
  const themeToggle = document.getElementById('theme-toggle');
  const stored = localStorage.getItem('theme');
  if (stored) html.setAttribute('data-theme', stored);

  themeToggle.addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });

  // ---- Mobile Navigation ----
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');

  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });

  // ---- Navbar scroll effect & active section ----
  const navbar = document.getElementById('navbar');
  const sections = document.querySelectorAll('.section, .hero');

  function updateNavbar() {
    navbar.classList.toggle('scrolled', window.scrollY > 50);

    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 200) {
        current = sec.getAttribute('id');
      }
    });

    navLinks.querySelectorAll('a').forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  }

  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();

  // ---- Scroll Reveal ----
  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  reveals.forEach(el => revealObserver.observe(el));

  // ---- Typed Greeting ----
  const greetings = [
    'Hello, world!',
    'Welcome to my site.',
    'Built for GitHub Pages.',
    'Powered by vanilla JS.'
  ];

  const typedEl = document.getElementById('typed-greeting');
  let gIdx = 0;
  let cIdx = 0;
  let deleting = false;

  function typeGreeting() {
    const text = greetings[gIdx];
    if (!deleting) {
      typedEl.textContent = text.substring(0, cIdx + 1);
      cIdx++;
      if (cIdx === text.length) {
        deleting = true;
        setTimeout(typeGreeting, 2000);
        return;
      }
      setTimeout(typeGreeting, 80);
    } else {
      typedEl.textContent = text.substring(0, cIdx - 1);
      cIdx--;
      if (cIdx === 0) {
        deleting = false;
        gIdx = (gIdx + 1) % greetings.length;
        setTimeout(typeGreeting, 400);
        return;
      }
      setTimeout(typeGreeting, 40);
    }
  }
  typeGreeting();

  // ---- Terminal Typing ----
  const terminalLines = [
    '> git clone github.com/timothyhartzog.github.io',
    '> cd portfolio',
    '> echo "Interactivity: HTML + CSS + JS"',
    'Interactivity: HTML + CSS + JS',
    '> echo "No server needed"',
    'No server needed',
    '> npm run deploy',
    'Deployed to GitHub Pages!'
  ];

  const terminalBody = document.getElementById('terminal-body');
  const terminalTyped = document.getElementById('terminal-typed');
  let tLine = 0;
  let tChar = 0;
  let terminalStarted = false;

  function typeTerminal() {
    if (tLine >= terminalLines.length) {
      // Restart after delay
      setTimeout(() => {
        terminalBody.innerHTML = '<p><span class="prompt">$</span> <span class="terminal-typed" id="terminal-typed"></span><span class="cursor">|</span></p>';
        tLine = 0;
        tChar = 0;
        typeTerminal();
      }, 3000);
      return;
    }

    const currentTyped = document.getElementById('terminal-typed');
    if (!currentTyped) return;

    const line = terminalLines[tLine];
    const isCommand = line.startsWith('>');
    const displayText = isCommand ? line.substring(2) : line;

    if (isCommand) {
      currentTyped.textContent = displayText.substring(0, tChar);
      tChar++;
      if (tChar <= displayText.length) {
        setTimeout(typeTerminal, 50);
      } else {
        tLine++;
        tChar = 0;
        // Add new line
        const p = document.createElement('p');
        p.innerHTML = '<span class="prompt">$</span> <span class="terminal-typed" id="terminal-typed"></span><span class="cursor">|</span>';
        terminalBody.appendChild(p);
        // Remove cursor from previous line
        const cursors = terminalBody.querySelectorAll('.cursor');
        if (cursors.length > 1) cursors[0].remove();
        setTimeout(typeTerminal, 300);
      }
    } else {
      // Output line - print instantly
      currentTyped.remove();
      const cursor = terminalBody.querySelector('.cursor');
      if (cursor) cursor.remove();

      const last = terminalBody.lastElementChild;
      if (last) last.innerHTML = '<span style="color:#58a6ff">' + displayText + '</span>';

      tLine++;
      tChar = 0;
      const p = document.createElement('p');
      p.innerHTML = '<span class="prompt">$</span> <span class="terminal-typed" id="terminal-typed"></span><span class="cursor">|</span>';
      terminalBody.appendChild(p);
      setTimeout(typeTerminal, 500);
    }
  }

  // Start terminal when visible
  const terminalObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !terminalStarted) {
      terminalStarted = true;
      typeTerminal();
    }
  }, { threshold: 0.3 });
  terminalObserver.observe(document.querySelector('.terminal'));

  // ---- Stat Counter ----
  const statEls = document.querySelectorAll('.stat');
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.dataset.target, 10);
        const suffix = entry.target.dataset.suffix || '';
        const numEl = entry.target.querySelector('.stat-number');
        animateCount(numEl, 0, target, 1500, suffix);
        statObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statEls.forEach(s => statObserver.observe(s));

  function animateCount(el, start, end, duration, suffix) {
    const range = end - start;
    const startTime = performance.now();
    function step(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(start + range * ease) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // ---- Skill Bars ----
  const skillCards = document.querySelectorAll('.skill-fill');
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.width = entry.target.dataset.level + '%';
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  skillCards.forEach(s => skillObserver.observe(s));

  // ---- Tabs (Skills) ----
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById('panel-' + tab.dataset.tab).classList.add('active');

      // Re-trigger skill bar animations for the new panel
      const panel = document.getElementById('panel-' + tab.dataset.tab);
      panel.querySelectorAll('.skill-fill').forEach(fill => {
        fill.style.width = '0';
        requestAnimationFrame(() => {
          fill.style.width = fill.dataset.level + '%';
        });
      });
    });
  });

  // ---- Project Filter ----
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      document.querySelectorAll('.project-card').forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // ---- Color Mixer Demo ----
  const sliders = document.querySelectorAll('.color-slider');
  const colorPreview = document.getElementById('color-preview');
  const colorValue = document.getElementById('color-value');

  function updateColor() {
    const r = document.querySelector('[data-color="r"]').value;
    const g = document.querySelector('[data-color="g"]').value;
    const b = document.querySelector('[data-color="b"]').value;
    const hex = '#' + [r, g, b].map(v => parseInt(v, 10).toString(16).padStart(2, '0')).join('');
    colorPreview.style.background = hex;
    colorValue.textContent = hex.toUpperCase();
  }

  sliders.forEach(s => s.addEventListener('input', updateColor));
  updateColor();

  // ---- Drawing Pad ----
  const drawCanvas = document.getElementById('draw-canvas');
  const drawCtx = drawCanvas.getContext('2d');
  const drawColorInput = document.getElementById('draw-color');
  const drawSizeInput = document.getElementById('draw-size');
  const drawClearBtn = document.getElementById('draw-clear');
  let drawing = false;

  function resizeDrawCanvas() {
    const rect = drawCanvas.getBoundingClientRect();
    const data = drawCtx.getImageData(0, 0, drawCanvas.width, drawCanvas.height);
    drawCanvas.width = rect.width;
    drawCanvas.height = rect.height;
    drawCtx.putImageData(data, 0, 0);
  }

  resizeDrawCanvas();
  window.addEventListener('resize', resizeDrawCanvas);

  function getDrawPos(e) {
    const rect = drawCanvas.getBoundingClientRect();
    const touch = e.touches ? e.touches[0] : e;
    return { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
  }

  function startDraw(e) {
    drawing = true;
    const pos = getDrawPos(e);
    drawCtx.beginPath();
    drawCtx.moveTo(pos.x, pos.y);
  }

  function draw(e) {
    if (!drawing) return;
    e.preventDefault();
    const pos = getDrawPos(e);
    drawCtx.lineTo(pos.x, pos.y);
    drawCtx.strokeStyle = drawColorInput.value;
    drawCtx.lineWidth = drawSizeInput.value;
    drawCtx.lineCap = 'round';
    drawCtx.lineJoin = 'round';
    drawCtx.stroke();
  }

  function stopDraw() { drawing = false; }

  drawCanvas.addEventListener('mousedown', startDraw);
  drawCanvas.addEventListener('mousemove', draw);
  drawCanvas.addEventListener('mouseup', stopDraw);
  drawCanvas.addEventListener('mouseleave', stopDraw);
  drawCanvas.addEventListener('touchstart', startDraw, { passive: false });
  drawCanvas.addEventListener('touchmove', draw, { passive: false });
  drawCanvas.addEventListener('touchend', stopDraw);

  drawClearBtn.addEventListener('click', () => {
    drawCtx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
  });

  // ---- Sorting Visualizer ----
  const sortBarsContainer = document.getElementById('sort-bars');
  const sortShuffleBtn = document.getElementById('sort-shuffle');
  const sortStartBtn = document.getElementById('sort-start');
  const BAR_COUNT = 30;
  let sortArray = [];
  let sorting = false;

  function initBars() {
    sortArray = Array.from({ length: BAR_COUNT }, (_, i) => ((i + 1) / BAR_COUNT) * 100);
    shuffleArray(sortArray);
    renderBars();
  }

  function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  function renderBars(comparing, sorted) {
    comparing = comparing || [];
    sorted = sorted || [];
    sortBarsContainer.innerHTML = sortArray
      .map((h, i) => {
        let cls = 'sort-bar';
        if (comparing.includes(i)) cls += ' comparing';
        if (sorted.includes(i)) cls += ' sorted';
        return '<div class="' + cls + '" style="height:' + h + '%"></div>';
      })
      .join('');
  }

  async function bubbleSort() {
    sorting = true;
    sortStartBtn.disabled = true;
    sortShuffleBtn.disabled = true;

    for (let i = 0; i < sortArray.length; i++) {
      for (let j = 0; j < sortArray.length - i - 1; j++) {
        if (!sorting) return;
        renderBars([j, j + 1]);
        if (sortArray[j] > sortArray[j + 1]) {
          [sortArray[j], sortArray[j + 1]] = [sortArray[j + 1], sortArray[j]];
        }
        await sleep(20);
      }
    }

    // Mark all sorted
    renderBars([], Array.from({ length: BAR_COUNT }, (_, i) => i));
    sorting = false;
    sortStartBtn.disabled = false;
    sortShuffleBtn.disabled = false;
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  sortShuffleBtn.addEventListener('click', () => {
    if (sorting) return;
    shuffleArray(sortArray);
    renderBars();
  });

  sortStartBtn.addEventListener('click', () => {
    if (sorting) return;
    bubbleSort();
  });

  initBars();

  // ---- Contact Form (client-side only demo) ----
  const contactForm = document.getElementById('contact-form');
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('Message sent! (Demo - connect a backend to go live)');
    contactForm.reset();
  });

  function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.add('visible');
    setTimeout(() => toast.classList.remove('visible'), 3500);
  }

  // ---- Footer Year ----
  document.getElementById('year').textContent = new Date().getFullYear();

  // ---- Particle Background ----
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let mouse = { x: null, y: null };

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.5;
      this.speedY = (Math.random() - 0.5) * 0.5;
      this.opacity = Math.random() * 0.5 + 0.1;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (mouse.x !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          this.x -= dx * 0.01;
          this.y -= dy * 0.01;
        }
      }

      if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
      if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }

    draw() {
      const theme = html.getAttribute('data-theme');
      const color = theme === 'dark' ? '100, 150, 255' : '59, 108, 231';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + color + ',' + this.opacity + ')';
      ctx.fill();
    }
  }

  function initParticles() {
    const count = Math.min(80, Math.floor((canvas.width * canvas.height) / 15000));
    particles = Array.from({ length: count }, () => new Particle());
  }

  function drawLines() {
    const theme = html.getAttribute('data-theme');
    const color = theme === 'dark' ? '100, 150, 255' : '59, 108, 231';

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = 'rgba(' + color + ',' + (0.08 * (1 - dist / 150)) + ')';
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    drawLines();
    requestAnimationFrame(animateParticles);
  }

  initParticles();
  animateParticles();
  window.addEventListener('resize', initParticles);

})();
