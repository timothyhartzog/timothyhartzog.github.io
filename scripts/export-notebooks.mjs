#!/usr/bin/env node

/**
 * Exports all Marimo notebooks to static HTML in public/notebooks/.
 * Also runs each notebook to generate chart JSON exports.
 *
 * Usage:
 *   node scripts/export-notebooks.mjs              # export all
 *   node scripts/export-notebooks.mjs my-analysis  # export one by slug
 */

import { readdirSync, existsSync, mkdirSync } from 'fs';
import { join, basename } from 'path';
import { execSync } from 'child_process';

const NOTEBOOKS_DIR = join(import.meta.dirname, '..', 'notebooks');
const OUTPUT_DIR = join(import.meta.dirname, '..', 'public', 'notebooks');

if (!existsSync(OUTPUT_DIR)) {
  mkdirSync(OUTPUT_DIR, { recursive: true });
}

const targetSlug = process.argv[2];

const notebooks = readdirSync(NOTEBOOKS_DIR)
  .filter((f) => f.endsWith('.py'))
  .filter((f) => !targetSlug || f === `${targetSlug}.py`);

if (notebooks.length === 0) {
  console.error(targetSlug ? `Notebook not found: ${targetSlug}.py` : 'No notebooks found.');
  process.exit(1);
}

for (const nb of notebooks) {
  const slug = basename(nb, '.py');
  const inputPath = join(NOTEBOOKS_DIR, nb);
  const outputPath = join(OUTPUT_DIR, `${slug}.html`);

  console.log(`Exporting: ${nb} → public/notebooks/${slug}.html`);

  try {
    // Run the notebook to generate chart exports
    execSync(`marimo run "${inputPath}" --headless`, {
      cwd: join(import.meta.dirname, '..'),
      timeout: 60000,
      stdio: 'pipe',
    });
  } catch {
    // Running may fail in headless if notebook has UI elements — that's OK
    console.log(`  (headless run skipped — export charts manually via marimo edit)`);
  }

  try {
    // Export to static HTML (WASM-powered, runs Python in browser)
    execSync(`marimo export html "${inputPath}" -o "${outputPath}" --no-include-code`, {
      cwd: join(import.meta.dirname, '..'),
      timeout: 120000,
      stdio: 'pipe',
    });
    console.log(`  ✓ ${outputPath}`);
  } catch (e) {
    console.error(`  ✗ Export failed: ${e.message}`);
  }
}

console.log('\nDone. Notebooks available at /notebooks/<slug>.html');
