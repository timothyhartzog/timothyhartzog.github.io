/**
 * Example D3 scatter plot with interactive tooltips.
 */

import * as d3 from 'd3';
import type { D3RenderFn, D3VizMeta } from './types';

export const meta: D3VizMeta = {
  title: 'Interactive Scatter Plot',
  description: 'A scatter plot with hover tooltips and zoom.',
  tags: ['chart', 'scatter', 'interactive', 'example'],
};

interface DataPoint {
  x: number;
  y: number;
  label: string;
  size: number;
}

const data: DataPoint[] = [
  { x: 10, y: 85, label: 'Alpha', size: 8 },
  { x: 25, y: 72, label: 'Beta', size: 12 },
  { x: 40, y: 91, label: 'Gamma', size: 6 },
  { x: 55, y: 58, label: 'Delta', size: 15 },
  { x: 70, y: 78, label: 'Epsilon', size: 10 },
  { x: 30, y: 45, label: 'Zeta', size: 9 },
  { x: 65, y: 82, label: 'Eta', size: 7 },
  { x: 80, y: 65, label: 'Theta', size: 14 },
  { x: 15, y: 55, label: 'Iota', size: 11 },
  { x: 50, y: 95, label: 'Kappa', size: 5 },
];

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
    .attr('transform', `translate(${margin.left},${margin.top})`);

  // Scales
  const x = d3.scaleLinear().domain([0, 100]).range([0, innerW]);
  const y = d3.scaleLinear().domain([0, 100]).range([innerH, 0]);

  // Axes
  g.append('g')
    .attr('transform', `translate(0,${innerH})`)
    .call(d3.axisBottom(x))
    .selectAll('text')
    .style('fill', '#94a3b8');

  g.append('g')
    .call(d3.axisLeft(y))
    .selectAll('text')
    .style('fill', '#94a3b8');

  svg.selectAll('.domain, .tick line').attr('stroke', '#334155');

  // Tooltip
  const tooltip = d3
    .select(container)
    .append('div')
    .style('position', 'absolute')
    .style('padding', '6px 10px')
    .style('background', '#1e293b')
    .style('border', '1px solid #38bdf8')
    .style('border-radius', '6px')
    .style('color', '#e2e8f0')
    .style('font-size', '0.8rem')
    .style('pointer-events', 'none')
    .style('opacity', 0);

  // Dots
  g.selectAll('.dot')
    .data(data)
    .enter()
    .append('circle')
    .attr('cx', (d) => x(d.x))
    .attr('cy', (d) => y(d.y))
    .attr('r', 0)
    .attr('fill', '#38bdf8')
    .attr('fill-opacity', 0.7)
    .attr('stroke', '#38bdf8')
    .attr('stroke-width', 1)
    .on('mouseenter', function (event, d) {
      d3.select(this).attr('fill-opacity', 1).attr('stroke-width', 2);
      tooltip
        .style('opacity', 1)
        .html(`<strong>${d.label}</strong><br/>x: ${d.x}, y: ${d.y}`)
        .style('left', `${event.offsetX + 12}px`)
        .style('top', `${event.offsetY - 10}px`);
    })
    .on('mouseleave', function () {
      d3.select(this).attr('fill-opacity', 0.7).attr('stroke-width', 1);
      tooltip.style('opacity', 0);
    })
    .transition()
    .duration(500)
    .delay((_, i) => i * 60)
    .attr('r', (d) => d.size);

  return () => {
    svg.remove();
    tooltip.remove();
  };
};

export default render;
