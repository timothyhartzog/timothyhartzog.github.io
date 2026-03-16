import { test, expect } from '@playwright/test';

// ---- Page load tests ----

const pages = [
  { path: '/', title: 'Hartzog', heading: 'Decisions' },
  { path: '/services', title: 'Services', heading: 'What We Build' },
  { path: '/about', title: 'About', heading: 'About' },
  { path: '/blog', title: 'Blog', heading: 'Blog' },
  { path: '/analysis', title: 'Analysis', heading: 'Analysis' },
  { path: '/resources', title: 'Resources', heading: 'Resources' },
  { path: '/projects', title: 'Projects', heading: 'Projects' },
  { path: '/contact', title: 'Contact', heading: 'Contact' },
  { path: '/privacy', title: 'Privacy', heading: 'Privacy' },
  { path: '/terms', title: 'Terms', heading: 'Terms' },
];

for (const page of pages) {
  test(`${page.path} loads and has correct heading`, async ({ page: p }) => {
    const response = await p.goto(page.path);

    // Page returns 200
    expect(response?.status()).toBe(200);

    // Title contains expected text
    await expect(p).toHaveTitle(new RegExp(page.title, 'i'));

    // Main heading is visible
    const heading = p.locator('h1').first();
    await expect(heading).toBeVisible();
    await expect(heading).toContainText(new RegExp(page.heading, 'i'));
  });
}

// ---- Navigation tests ----

test('navigation links work', async ({ page }) => {
  await page.goto('/');

  // Nav bar is visible
  const nav = page.locator('nav');
  await expect(nav).toBeVisible();

  // Logo links to home
  const logo = nav.locator('a').first();
  await expect(logo).toHaveAttribute('href', '/');

  // Key nav links exist
  const navLinks = nav.locator('.nav-links a');
  const hrefs = await navLinks.evaluateAll((links) =>
    links.map((l) => l.getAttribute('href'))
  );
  expect(hrefs).toContain('/services');
  expect(hrefs).toContain('/blog');
  expect(hrefs).toContain('/about');
  expect(hrefs).toContain('/contact');
});

test('footer is present on all pages', async ({ page }) => {
  for (const path of ['/', '/services', '/about', '/blog']) {
    await page.goto(path);
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
  }
});

// ---- SEO tests ----

test('homepage has correct meta tags', async ({ page }) => {
  await page.goto('/');

  // Meta description exists
  const description = page.locator('meta[name="description"]');
  await expect(description).toHaveAttribute('content', /.+/);

  // OG tags exist
  const ogTitle = page.locator('meta[property="og:title"]');
  await expect(ogTitle).toHaveAttribute('content', /.+/);

  const ogType = page.locator('meta[property="og:type"]');
  await expect(ogType).toHaveAttribute('content', 'website');

  // Canonical URL
  const canonical = page.locator('link[rel="canonical"]');
  await expect(canonical).toHaveAttribute('href', /hartzog\.dev/);
});

test('robots.txt is accessible', async ({ page }) => {
  const response = await page.goto('/robots.txt');
  expect(response?.status()).toBe(200);
  const text = await response?.text();
  expect(text).toContain('Sitemap');
  expect(text).toContain('hartzog.dev');
});

test('sitemap is accessible', async ({ page }) => {
  const response = await page.goto('/sitemap-index.xml');
  expect(response?.status()).toBe(200);
});

// ---- Content tests ----

test('blog listing shows posts', async ({ page }) => {
  await page.goto('/blog');

  // At least one blog post card or empty message
  const cards = page.locator('.card, .empty');
  await expect(cards.first()).toBeVisible();
});

test('services page shows service cards', async ({ page }) => {
  await page.goto('/services');

  const cards = page.locator('.service-card');
  const count = await cards.count();
  expect(count).toBe(4);
});

test('homepage services section has 4 cards', async ({ page }) => {
  await page.goto('/');

  const cards = page.locator('.service-card');
  const count = await cards.count();
  expect(count).toBe(4);
});

// ---- Accessibility tests ----

test('pages have no accessibility violations in basic structure', async ({ page }) => {
  await page.goto('/');

  // HTML lang attribute
  const html = page.locator('html');
  await expect(html).toHaveAttribute('lang', 'en');

  // Viewport meta tag
  const viewport = page.locator('meta[name="viewport"]');
  await expect(viewport).toHaveAttribute('content', /width=device-width/);

  // Images have alt text (if any exist)
  const images = page.locator('img');
  const imgCount = await images.count();
  for (let i = 0; i < imgCount; i++) {
    await expect(images.nth(i)).toHaveAttribute('alt', /.*/);
  }
});

test('nav toggle has aria attributes for mobile', async ({ page }) => {
  await page.goto('/');
  const toggle = page.locator('.nav-toggle');
  await expect(toggle).toHaveAttribute('aria-label', /menu/i);
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
});

// ---- RSS feed test ----

test('RSS feed is valid XML', async ({ page }) => {
  const response = await page.goto('/rss.xml');
  expect(response?.status()).toBe(200);
  const contentType = response?.headers()['content-type'];
  expect(contentType).toContain('xml');
});
