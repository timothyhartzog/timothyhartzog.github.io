import { useEffect, useRef } from 'react';

interface PlotlyChartProps {
  /** Path to the Plotly JSON file (relative to public/) */
  src?: string;
  /** Inline Plotly JSON data (alternative to src) */
  data?: { data: unknown[]; layout?: Record<string, unknown> };
  /** Chart height */
  height?: string;
  /** Optional title displayed above the chart */
  title?: string;
}

/**
 * PlotlyChart — renders a Plotly chart from JSON data.
 *
 * Two usage modes:
 *   1. From a JSON file exported by Python:
 *      <PlotlyChart client:load src="/data/charts/my-chart.json" />
 *
 *   2. Inline data:
 *      <PlotlyChart client:load data={{ data: [...], layout: {...} }} />
 *
 * Plotly.js is loaded from CDN on demand (not bundled).
 */
export default function PlotlyChart({
  src,
  data,
  height = '450px',
  title,
}: PlotlyChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const plotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;

    async function render() {
      // Load plotly.js from CDN if not already present
      if (!(window as unknown as Record<string, unknown>).Plotly) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://cdn.plot.ly/plotly-2.35.2.min.js';
          script.onload = () => resolve();
          script.onerror = () => reject(new Error('Failed to load Plotly.js'));
          document.head.appendChild(script);
        });
      }

      if (cancelled || !plotRef.current) return;

      let chartData: { data: unknown[]; layout?: Record<string, unknown> };

      if (src) {
        const res = await fetch(src);
        chartData = await res.json();
      } else if (data) {
        chartData = data;
      } else {
        return;
      }

      if (cancelled || !plotRef.current) return;

      const Plotly = (window as unknown as Record<string, { newPlot: Function }>).Plotly;
      const layout = {
        ...chartData.layout,
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: '#1e293b',
        font: { color: '#e2e8f0', family: 'Inter, system-ui, sans-serif' },
        margin: { t: 30, r: 20, b: 40, l: 50 },
        xaxis: {
          gridcolor: '#334155',
          ...((chartData.layout?.xaxis as Record<string, unknown>) ?? {}),
        },
        yaxis: {
          gridcolor: '#334155',
          ...((chartData.layout?.yaxis as Record<string, unknown>) ?? {}),
        },
      };

      Plotly.newPlot(plotRef.current, chartData.data, layout, {
        responsive: true,
        displayModeBar: true,
        modeBarButtonsToRemove: ['lasso2d', 'select2d'],
      });
    }

    render();
    return () => { cancelled = true; };
  }, [src, data]);

  return (
    <div
      ref={containerRef}
      style={{
        background: '#1e293b',
        border: '1px solid #334155',
        borderRadius: '10px',
        padding: '1.25rem',
        margin: '1.5rem 0',
      }}
    >
      {title && (
        <h3 style={{ margin: '0 0 0.75rem', fontSize: '1.1rem' }}>{title}</h3>
      )}
      <div ref={plotRef} style={{ width: '100%', height }} />
    </div>
  );
}
