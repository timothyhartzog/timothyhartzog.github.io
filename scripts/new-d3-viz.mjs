#!/usr/bin/env node

/**
 * Creates a new D3 visualization module in src/d3/.
 *
 * Usage:
 *   node scripts/new-d3-viz.mjs "My Bar Chart" "A custom bar chart" "chart,bar"
 *   node scripts/new-d3-viz.mjs   # prompts for all fields
 */

import { writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { createInterface } from 'readline';

const D3_DIR = join(import.meta.dirname, '..', 'src', 'd3');

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function createViz({ title, description, tags }) {
  const slug = slugify(title);
  const filePath = join(D3_DIR, `${slug}.ts`);

  if (existsSync(filePath)) {
    console.error(`File already exists: ${filePath}`);
    process.exit(1);
  }

  const tagArray = tags
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);
  const tagStr = tagArray.length > 0
    ? `[${tagArray.map((t) => `'${t}'`).join(', ')}]`
    : "['visualization']";

  const content = `/**
 * ${title}
 *
 * ${description}
 */

import * as d3 from 'd3';
import type { D3RenderFn, D3VizMeta } from './types';

export const meta: D3VizMeta = {
  title: '${title}',
  description: '${description}',
  tags: ${tagStr},
};

const render: D3RenderFn = (container, width, height) => {
  const margin = { top: 20, right: 20, bottom: 40, left: 50 };
  const innerW = width - margin.left - margin.right;
  const innerH = height - margin.top - margin.bottom;

  const svg = d3
    .select(container)
    .append('svg')
    .attr('width', width)
    .attr('height', height);

  const g = svg
    .append('g')
    .attr('transform', \`translate(\${margin.left},\${margin.top})\`);

  // TODO: Add your D3 visualization code here
  // Example: scales, axes, shapes, transitions

  g.append('text')
    .attr('x', innerW / 2)
    .attr('y', innerH / 2)
    .attr('text-anchor', 'middle')
    .attr('fill', '#94a3b8')
    .text('${title} — edit src/d3/${slug}.ts');

  return () => {
    svg.remove();
  };
};

export default render;
`;

  writeFileSync(filePath, content, 'utf-8');
  console.log(filePath);
}

// Args passed from VS Code task inputs
const [, , title, description, tags] = process.argv;

if (title) {
  createViz({
    title,
    description: description || '',
    tags: tags || '',
  });
} else {
  const rl = createInterface({ input: process.stdin, output: process.stderr });
  const ask = (q) => new Promise((res) => rl.question(q, res));

  (async () => {
    const t = await ask('Visualization title: ');
    if (!t.trim()) { console.error('Title is required.'); process.exit(1); }
    const d = await ask('Description: ');
    const tg = await ask('Tags (comma-separated): ');
    rl.close();

    createViz({
      title: t.trim(),
      description: d.trim(),
      tags: tg.trim(),
    });
  })();
}
