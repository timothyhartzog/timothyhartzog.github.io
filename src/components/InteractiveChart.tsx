import { useState } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface DataPoint {
  name: string;
  [key: string]: string | number;
}

interface InteractiveChartProps {
  data: DataPoint[];
  title?: string;
  dataKeys: { key: string; color: string }[];
  defaultType?: 'line' | 'bar';
}

export default function InteractiveChart({
  data,
  title,
  dataKeys,
  defaultType = 'line',
}: InteractiveChartProps) {
  const [chartType, setChartType] = useState(defaultType);

  const Chart = chartType === 'line' ? LineChart : BarChart;

  return (
    <div style={{
      background: '#1e293b',
      border: '1px solid #334155',
      borderRadius: '10px',
      padding: '1.25rem',
      margin: '1.5rem 0',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem',
      }}>
        {title && <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{title}</h3>}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {(['line', 'bar'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setChartType(type)}
              style={{
                padding: '0.3rem 0.75rem',
                borderRadius: '6px',
                border: '1px solid',
                borderColor: chartType === type ? '#38bdf8' : '#334155',
                background: chartType === type ? 'rgba(56,189,248,0.15)' : 'transparent',
                color: chartType === type ? '#38bdf8' : '#94a3b8',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontWeight: 500,
                textTransform: 'capitalize',
              }}
            >
              {type}
            </button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <Chart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
          <YAxis stroke="#94a3b8" fontSize={12} />
          <Tooltip
            contentStyle={{
              background: '#0f172a',
              border: '1px solid #334155',
              borderRadius: '8px',
              color: '#e2e8f0',
            }}
          />
          <Legend />
          {dataKeys.map(({ key, color }) =>
            chartType === 'line' ? (
              <Line key={key} type="monotone" dataKey={key} stroke={color} strokeWidth={2} dot={{ r: 4 }} />
            ) : (
              <Bar key={key} dataKey={key} fill={color} radius={[4, 4, 0, 0]} />
            )
          )}
        </Chart>
      </ResponsiveContainer>
    </div>
  );
}
