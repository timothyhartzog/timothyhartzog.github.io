#!/usr/bin/env node

/**
 * Creates a new blog post with frontmatter in src/content/blog/.
 *
 * Usage:
 *   node scripts/new-blog-post.mjs "Title" "Description" "tag1,tag2" "2026-03-15"
 *   node scripts/new-blog-post.mjs   # prompts for all fields
 */

import { writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { createInterface } from 'readline';

const BLOG_DIR = join(import.meta.dirname, '..', 'src', 'content', 'blog');

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function today() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function createPost({ title, description, tags, date }) {
  const slug = slugify(title);
  const filePath = join(BLOG_DIR, `${slug}.md`);

  if (existsSync(filePath)) {
    console.error(`File already exists: ${filePath}`);
    process.exit(1);
  }

  const tagArray = tags
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);
  const tagStr = tagArray.length > 0
    ? `[${tagArray.map((t) => `"${t}"`).join(', ')}]`
    : '[]';

  const content = `---
title: "${title}"
description: "${description}"
date: ${date}
tags: ${tagStr}
draft: true
---

`;

  writeFileSync(filePath, content, 'utf-8');
  console.log(filePath);
}

// Args passed from VS Code task inputs
const [, , title, description, tags, date] = process.argv;

if (title) {
  createPost({
    title,
    description: description || '',
    tags: tags || '',
    date: date || today(),
  });
} else {
  const rl = createInterface({ input: process.stdin, output: process.stderr });
  const ask = (q) => new Promise((res) => rl.question(q, res));

  (async () => {
    const t = await ask('Title: ');
    if (!t.trim()) { console.error('Title is required.'); process.exit(1); }
    const d = await ask(`Description: `);
    const tg = await ask('Tags (comma-separated): ');
    const dt = await ask(`Date [${today()}]: `);
    rl.close();

    createPost({
      title: t.trim(),
      description: d.trim(),
      tags: tg.trim(),
      date: dt.trim() || today(),
    });
  })();
}
