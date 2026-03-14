import { useRef, useEffect, useState } from 'react';

interface D3ContainerProps {
  /** A render function that receives the DOM element and dimensions */
  renderFn?: (container: HTMLDivElement, width: number, height: number) => void | (() => void);
  /** Container width */
  width?: string;
  /** Container height */
  height?: string;
  /** Optional label */
  label?: string;
}

/**
 * D3Container — React component that provides a ref-based container for D3.js rendering.
 *
 * Usage in MDX:
 *   import D3Container from '../../components/D3Container';
 *   <D3Container client:load renderFn={(el, w, h) => { d3.select(el).append('svg')... }} />
 *
 * For Rust/WASM + D3 scenarios, the WASM module can target the container by ID.
 */
export default function D3Container({
  renderFn,
  width = '100%',
  height = '400px',
  label,
}: D3ContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current || !renderFn) return;

    const el = containerRef.current;
    const rect = el.getBoundingClientRect();

    try {
      const cleanup = renderFn(el, rect.width, rect.height);
      return () => {
        if (typeof cleanup === 'function') cleanup();
        el.innerHTML = '';
      };
    } catch (e) {
      setError(e instanceof Error ? e.message : 'D3 render error');
    }
  }, [renderFn]);

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
        <div
          ref={containerRef}
          style={{
            width,
            height,
            background: '#1e293b',
            border: '1px solid #334155',
            borderRadius: '8px',
            overflow: 'hidden',
          }}
        />
      )}
    </div>
  );
}
