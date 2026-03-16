/** Typed dataset — importable in MDX and Astro components */

export interface Metric {
  month: string;
  users: number;
  revenue: number;
  churn: number;
}

export const monthlyMetrics: Metric[] = [
  { month: 'Jan', users: 1200, revenue: 48000, churn: 3.2 },
  { month: 'Feb', users: 1350, revenue: 52000, churn: 2.8 },
  { month: 'Mar', users: 1500, revenue: 58000, churn: 2.5 },
  { month: 'Apr', users: 1680, revenue: 64000, churn: 2.1 },
  { month: 'May', users: 1820, revenue: 71000, churn: 1.9 },
  { month: 'Jun', users: 2050, revenue: 79000, churn: 1.7 },
];

/** Helper: compute derived values */
export const revenuePerUser = monthlyMetrics.map((m) => ({
  month: m.month,
  arpu: Math.round(m.revenue / m.users),
}));
