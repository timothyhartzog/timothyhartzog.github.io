/**
 * CSV loader — parses CSV text into typed arrays.
 *
 * Usage in MDX:
 *   import { loadCsv } from '../../data/load-csv';
 *   import csvText from '../../data/my-data.csv?raw';
 *   const data = loadCsv(csvText);
 *
 * Usage in Astro:
 *   import { loadCsvFile } from '../../data/load-csv';
 *   const data = await loadCsvFile('src/data/my-data.csv');
 */

/** Parse CSV string into array of objects */
export function loadCsv<T extends Record<string, string | number> = Record<string, string | number>>(
  csvText: string,
  options: { numeric?: string[] } = {}
): T[] {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map((h) => h.trim());
  const numericCols = new Set(options.numeric ?? []);

  return lines.slice(1).map((line) => {
    const values = line.split(',').map((v) => v.trim());
    const row: Record<string, string | number> = {};

    headers.forEach((header, i) => {
      const val = values[i] ?? '';
      if (numericCols.has(header) || (!isNaN(Number(val)) && val !== '')) {
        row[header] = Number(val);
      } else {
        row[header] = val;
      }
    });

    return row as T;
  });
}

/** Load CSV from file path (Astro/Node only, not browser) */
export async function loadCsvFile<T extends Record<string, string | number> = Record<string, string | number>>(
  filePath: string,
  options: { numeric?: string[] } = {}
): Promise<T[]> {
  const { readFileSync } = await import('fs');
  const text = readFileSync(filePath, 'utf-8');
  return loadCsv<T>(text, options);
}
