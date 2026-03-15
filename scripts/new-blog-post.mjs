#!/usr/bin/env node

/**
 * Creates a new blog post with frontmatter in src/content/blog/.
 *
 * Usage:
 *   node scripts/new-blog-post.mjs "My Post Title"
 *   node scripts/new-blog-post.mjs            # prompts for title
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

function createPost(title) {
  const slug = slugify(title);
  const filePath = join(BLOG_DIR, `${slug}.md`);

  if (existsSync(filePath)) {
    console.error(`File already exists: ${filePath}`);
    process.exit(1);
  }

  const content = `---
title: "${title}"
description: ""
date: ${today()}
tags: []
draft: true
---

`;

  writeFileSync(filePath, content, 'utf-8');
  console.log(filePath);
}

const title = process.argv[2];

if (title) {
  createPost(title);
} else {
  const rl = createInterface({ input: process.stdin, output: process.stderr });
  rl.question('Post title: ', (answer) => {
    rl.close();
    if (!answer.trim()) {
      console.error('Title is required.');
      process.exit(1);
    }
    createPost(answer.trim());
  });
}
