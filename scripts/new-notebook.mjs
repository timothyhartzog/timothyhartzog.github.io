#!/usr/bin/env node

/**
 * Creates a new Marimo notebook in notebooks/.
 * Marimo notebooks are plain .py files — perfect for git.
 *
 * Usage:
 *   node scripts/new-notebook.mjs "My Analysis"
 *   node scripts/new-notebook.mjs            # prompts for title
 */

import { writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { createInterface } from 'readline';

const NOTEBOOKS_DIR = join(import.meta.dirname, '..', 'notebooks');

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function createNotebook(title) {
  const slug = slugify(title);
  const filePath = join(NOTEBOOKS_DIR, `${slug}.py`);

  if (existsSync(filePath)) {
    console.error(`File already exists: ${filePath}`);
    process.exit(1);
  }

  const content = `import marimo

__generated_with = "0.10.0"
app = marimo.App(width="medium")


@app.cell
def _(mo):
    mo.md(
        """
        # ${title}

        *Description of this analysis.*
        """
    )
    return


@app.cell
def _():
    import marimo as mo
    import plotly.express as px
    import plotly.io as pio
    import pandas as pd
    import numpy as np
    return mo, np, pd, pio, px


@app.cell
def _(pd):
    # Load or create your data
    # df = pd.read_csv("src/data/your-data.csv")
    df = pd.DataFrame({
        "x": range(10),
        "y": range(10),
    })
    df
    return (df,)


@app.cell
def _(df, px):
    # Create your visualization
    fig = px.line(df, x="x", y="y", title="Chart Title")
    fig.update_layout(template="plotly_dark")
    fig
    return (fig,)


@app.cell
def _(fig, mo, pio):
    # Export chart JSON for embedding in Astro MDX pages
    from pathlib import Path

    export_dir = Path("public/data/charts")
    export_dir.mkdir(parents=True, exist_ok=True)

    pio.write_json(fig, str(export_dir / "${slug}.json"))

    mo.md(
        f"""
        **Exported:** \`public/data/charts/${slug}.json\`

        Embed in MDX:
        \\\`\\\`\\\`mdx
        import PlotlyChart from '../../components/PlotlyChart.tsx';
        <PlotlyChart client:load src="/data/charts/${slug}.json" title="Chart Title" />
        \\\`\\\`\\\`
        """
    )
    return


if __name__ == "__main__":
    app.run()
`;

  writeFileSync(filePath, content, 'utf-8');
  console.log(filePath);
}

const title = process.argv[2];

if (title) {
  createNotebook(title);
} else {
  const rl = createInterface({ input: process.stdin, output: process.stderr });
  rl.question('Notebook title: ', (answer) => {
    rl.close();
    if (!answer.trim()) {
      console.error('Title is required.');
      process.exit(1);
    }
    createNotebook(answer.trim());
  });
}
