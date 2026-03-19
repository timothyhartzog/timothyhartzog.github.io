/**
 * Shared types for D3 visualization modules.
 *
 * Each visualization module exports a default function matching D3RenderFn.
 * The function receives a container element and dimensions, draws into it,
 * and optionally returns a cleanup function.
 */

export type D3RenderFn = (
  container: HTMLDivElement,
  width: number,
  height: number,
) => void | (() => void);

export interface D3VizMeta {
  /** Human-readable title */
  title: string;
  /** Short description */
  description: string;
  /** Tags for categorization */
  tags?: string[];
}
