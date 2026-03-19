import { useRef, useEffect, useState } from 'react';

/**
 * D3Viz — Loads and renders a D3 visualization module from src/d3/.
 *
 * Usage in MDX:
 *   import D3Viz from '../../components/D3Viz.tsx';
 *   <D3Viz client:load module={() => import('../../d3/example-bar-chart')} />
 *
 * Or with inline renderFn (same as D3Container):
 *   <D3Viz client:load renderFn={(el, w, h) => { ... }} />
 */

interface D3VizProps {
  /** Dynamic import of a D3 viz module from src/d3/ */
  module?: () => Promise<{ default: (el: HTMLDivElement, w: number, h: number) => void | (() => void) }>;
  /** Or pass a render function directly */
  renderFn?: (container: HTMLDivElement, width: number, height: number) => void | (() => void);
  /** Container width */
  width?: string;
  /** Container height */
  height?: string;
  /** Optional label displayed above the visualization */
  label?: string;
}

export default function D3Viz({
  module: loadModule,
  renderFn,
  width = '100%',
  height = '400px',
  label,
}: D3VizProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(!!loadModule);

  useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;

    let cleanup: (() => void) | void;
    let cancelled = false;

    const run = async () => {
      try {
        let fn = renderFn;
        if (!fn && loadModule) {
          const mod = await loadModule();
          fn = mod.default;
        }
        if (!fn || cancelled) return;

        const rect = el.getBoundingClientRect();
        cleanup = fn(el, rect.width, rect.height);
        if (!cancelled) setLoading(false);
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'D3 render error');
          setLoading(false);
        }
      }
    };

    run();

    return () => {
      cancelled = true;
      if (typeof cleanup === 'function') cleanup();
      el.innerHTML = '';
    };
  }, [loadModule, renderFn]);

  return (
    <div style={{ margin: '1.5rem 0' }}>
      {label && (
        <div style={{
          fontSize: '0.8rem',
          color: '#94a3b8',
          marginBottom: '0.5rem',
          fontWeight: 500,
        }}>
          {label}
        </div>
      )}
      {error ? (
        <div style={{
          padding: '1rem',
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.2)',
          borderRadius: '8px',
          color: '#ef4444',
          fontSize: '0.9rem',
        }}>
          Render error: {error}
        </div>
      ) : (
        <div style={{ position: 'relative' }}>
          <div
            ref={containerRef}
            style={{
              width,
              height,
              background: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '8px',
              overflow: 'hidden',
              position: 'relative',
            }}
          />
          {loading && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#94a3b8',
              fontSize: '0.9rem',
            }}>
              Loading visualization...
            </div>
          )}
        </div>
      )}
    </div>
  );
}
