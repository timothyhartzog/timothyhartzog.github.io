/**
 * Example D3 bar chart visualization.
 *
 * This module demonstrates the D3 viz authoring pattern:
 * - Export `meta` with title/description for the authoring dashboard
 * - Export default render function that draws into the container
 * - Use d3 imports for selections, scales, axes, transitions
 */

import * as d3 from 'd3';
import type { D3RenderFn, D3VizMeta } from './types';

export const meta: D3VizMeta = {
  title: 'Example Bar Chart',
  description: 'A simple bar chart showing monthly revenue data.',
  tags: ['chart', 'bar', 'example'],
};

const data = [
  { month: 'Jan', revenue: 4200 },
  { month: 'Feb', revenue: 3800 },
  { month: 'Mar', revenue: 5100 },
  { month: 'Apr', revenue: 4600 },
  { month: 'May', revenue: 6200 },
  { month: 'Jun', revenue: 5800 },
];

const render: D3RenderFn = (container, width, height) => {
  const margin = { top: 20, right: 20, bottom: 40, left: 60 };
  const innerW = width - margin.left - margin.right;
  const innerH = height - margin.top - margin.bottom;

  const svg = d3
    .select(container)
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', `0 0 ${width} ${height}`);

  const g = svg
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  // Scales
  const x = d3
    .scaleBand<string>()
    .domain(data.map((d) => d.month))
    .range([0, innerW])
    .padding(0.2);

  const y = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.revenue) ?? 0])
    .nice()
    .range([innerH, 0]);

  // Axes
  g.append('g')
    .attr('transform', `translate(0,${innerH})`)
    .call(d3.axisBottom(x))
    .selectAll('text')
    .style('fill', '#94a3b8');

  g.append('g')
    .call(d3.axisLeft(y).ticks(5).tickFormat(d3.format('$,.0f')))
    .selectAll('text')
    .style('fill', '#94a3b8');

  // Style axis lines
  svg.selectAll('.domain, .tick line').attr('stroke', '#334155');

  // Bars with transition
  g.selectAll('.bar')
    .data(data)
    .enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('x', (d) => x(d.month) ?? 0)
    .attr('width', x.bandwidth())
    .attr('y', innerH)
    .attr('height', 0)
    .attr('fill', '#38bdf8')
    .attr('rx', 4)
    .transition()
    .duration(600)
    .delay((_, i) => i * 80)
    .attr('y', (d) => y(d.revenue))
    .attr('height', (d) => innerH - y(d.revenue));

  // Cleanup
  return () => {
    svg.remove();
  };
};

export default render;
