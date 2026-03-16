#!/usr/bin/env node

/**
 * Lists all draft posts and publishes the selected one by setting draft: false.
 *
 * Usage:
 *   node scripts/publish-draft.mjs                    # lists drafts, prompts to pick
 *   node scripts/publish-draft.mjs my-post-slug       # publish by slug directly
 */

import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { join, basename } from 'path';
import { createInterface } from 'readline';

const CONTENT_DIRS = [
  { dir: join(import.meta.dirname, '..', 'src', 'content', 'blog'), type: 'blog' },
  { dir: join(import.meta.dirname, '..', 'src', 'content', 'analysis'), type: 'analysis' },
];

function findDrafts() {
  const drafts = [];
  for (const { dir, type } of CONTENT_DIRS) {
    let files;
    try {
      files = readdirSync(dir).filter((f) => f.endsWith('.md') || f.endsWith('.mdx'));
    } catch {
      continue;
    }
    for (const file of files) {
      const filePath = join(dir, file);
      const content = readFileSync(filePath, 'utf-8');
      if (/^draft:\s*true/m.test(content)) {
        const titleMatch = content.match(/^title:\s*"?([^"\n]+)"?/m);
        const title = titleMatch ? titleMatch[1] : file;
        drafts.push({
          slug: basename(file, file.endsWith('.mdx') ? '.mdx' : '.md'),
          title,
          type,
          filePath,
        });
      }
    }
  }
  return drafts;
}

function publish(filePath, title) {
  let content = readFileSync(filePath, 'utf-8');
  content = content.replace(/^draft:\s*true/m, 'draft: false');
  writeFileSync(filePath, content, 'utf-8');
  console.log(`Published: "${title}" → draft: false`);
  console.log(filePath);
}

const targetSlug = process.argv[2];
const drafts = findDrafts();

if (drafts.length === 0) {
  console.log('No drafts found. All posts are published.');
  process.exit(0);
}

if (targetSlug) {
  const draft = drafts.find((d) => d.slug === targetSlug);
  if (!draft) {
    console.error(`Draft not found: ${targetSlug}`);
    console.error('Available drafts:', drafts.map((d) => d.slug).join(', '));
    process.exit(1);
  }
  publish(draft.filePath, draft.title);
} else {
  console.error('\nDrafts:\n');
  drafts.forEach((d, i) => {
    console.error(`  ${i + 1}. [${d.type}] ${d.title} (${d.slug})`);
  });
  console.error('');

  const rl = createInterface({ input: process.stdin, output: process.stderr });
  rl.question(`Pick a draft to publish (1-${drafts.length}): `, (answer) => {
    rl.close();
    const idx = parseInt(answer, 10) - 1;
    if (isNaN(idx) || idx < 0 || idx >= drafts.length) {
      console.error('Invalid selection.');
      process.exit(1);
    }
    publish(drafts[idx].filePath, drafts[idx].title);
  });
}
