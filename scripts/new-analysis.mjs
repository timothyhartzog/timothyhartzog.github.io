#!/usr/bin/env node

/**
 * Creates a new interactive analysis article in src/content/analysis/.
 *
 * Usage:
 *   node scripts/new-analysis.mjs "Title" "Description" "tag1,tag2" "2026-03-15"
 *   node scripts/new-analysis.mjs   # prompts for all fields
 */

import { writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { createInterface } from 'readline';

const ANALYSIS_DIR = join(import.meta.dirname, '..', 'src', 'content', 'analysis');

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

function createAnalysis({ title, description, tags, date }) {
  const slug = slugify(title);
  const filePath = join(ANALYSIS_DIR, `${slug}.mdx`);

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
    : '["data", "analysis"]';

  const content = `---
title: "${title}"
description: "${description}"
date: ${date}
tags: ${tagStr}
draft: true
---

import InteractiveChart from '../../components/InteractiveChart.tsx';
import DataTable from '../../components/DataTable.tsx';
import PlotlyChart from '../../components/PlotlyChart.tsx';
import D3Container from '../../components/D3Container.tsx';

{/* ---- Data imports (pick the format you need) ---- */}

{/* JSON: */}
{/* import jsonData from '../../data/sample-revenue.json'; */}

{/* CSV: */}
{/* import { loadCsv } from '../../data/load-csv'; */}
{/* import csvText from '../../data/sample-projects.csv?raw'; */}
{/* export const csvData = loadCsv(csvText); */}

{/* TypeScript: */}
{/* import { monthlyMetrics } from '../../data/sample-metrics'; */}

{/* ---- Recharts — standard charts (line, bar, pie, area) ---- */}

## Chart

<InteractiveChart
  client:load
  title="Chart Title"
  data={[
    { name: 'Jan', value: 100 },
    { name: 'Feb', value: 150 },
    { name: 'Mar', value: 130 },
    { name: 'Apr', value: 200 },
  ]}
  dataKeys={[
    { key: 'value', color: '#38bdf8' },
  ]}
/>

{/* ---- Data table ---- */}

## Data

<DataTable
  client:load
  title="Table Title"
  columns={[
    { key: 'name', label: 'Name' },
    { key: 'value', label: 'Value' },
  ]}
  data={[
    { name: 'Item A', value: 100 },
    { name: 'Item B', value: 200 },
  ]}
/>

{/* ---- Plotly — charts exported from Python/Marimo (uncomment to use) ---- */}

{/*
## Plotly Chart

<PlotlyChart client:load src="/data/charts/your-chart.json" title="Chart from Python" />
*/}

{/* ---- D3.js — complex/custom visualizations (uncomment to use) ---- */}

{/*
## D3 Visualization

<D3Container
  client:load
  label="Custom D3 Chart"
  height="400px"
  renderFn={(container, width, height) => {
    // D3 code here — import d3 in a <script> or use dynamic import
    // Example: create an SVG, binds data, draw shapes
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', width);
    svg.setAttribute('height', height);
    container.appendChild(svg);
    // ... your D3 drawing code
  }}
/>
*/}
`;

  writeFileSync(filePath, content, 'utf-8');
  console.log(filePath);
}

// Args passed from VS Code task inputs
const [, , title, description, tags, date] = process.argv;

if (title) {
  createAnalysis({
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
    const d = await ask('Description: ');
    const tg = await ask('Tags (comma-separated): ');
    const dt = await ask(`Date [${today()}]: `);
    rl.close();

    createAnalysis({
      title: t.trim(),
      description: d.trim(),
      tags: tg.trim(),
      date: dt.trim() || today(),
    });
  })();
}
