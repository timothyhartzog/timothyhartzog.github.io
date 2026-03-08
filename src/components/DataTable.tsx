import { useState, useMemo } from 'react';

interface DataTableProps {
  data: Record<string, string | number>[];
  columns: { key: string; label: string }[];
  title?: string;
}

export default function DataTable({ data, columns, title }: DataTableProps) {
  const [sortKey, setSortKey] = useState(columns[0]?.key ?? '');
  const [sortAsc, setSortAsc] = useState(true);
  const [filter, setFilter] = useState('');

  const filtered = useMemo(() => {
    const lc = filter.toLowerCase();
    return data.filter((row) =>
      columns.some((col) => String(row[col.key]).toLowerCase().includes(lc))
    );
  }, [data, columns, filter]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const aVal = a[sortKey] ?? '';
      const bVal = b[sortKey] ?? '';
      const cmp = typeof aVal === 'number' && typeof bVal === 'number'
        ? aVal - bVal
        : String(aVal).localeCompare(String(bVal));
      return sortAsc ? cmp : -cmp;
    });
  }, [filtered, sortKey, sortAsc]);

  const handleSort = (key: string) => {
    if (key === sortKey) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  return (
    <div style={{
      background: '#1e293b',
      border: '1px solid #334155',
      borderRadius: '10px',
      padding: '1.25rem',
      margin: '1.5rem 0',
      overflow: 'auto',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem',
        flexWrap: 'wrap',
        gap: '0.75rem',
      }}>
        {title && <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{title}</h3>}
        <input
          type="text"
          placeholder="Filter..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{
            padding: '0.35rem 0.75rem',
            borderRadius: '6px',
            border: '1px solid #334155',
            background: '#0f172a',
            color: '#e2e8f0',
            fontSize: '0.85rem',
            outline: 'none',
          }}
        />
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                onClick={() => handleSort(col.key)}
                style={{
                  textAlign: 'left',
                  padding: '0.6rem 0.75rem',
                  borderBottom: '1px solid #334155',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  color: '#94a3b8',
                  fontWeight: 600,
                  userSelect: 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                {col.label} {sortKey === col.key ? (sortAsc ? ' \u2191' : ' \u2193') : ''}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((row, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
              {columns.map((col) => (
                <td
                  key={col.key}
                  style={{
                    padding: '0.5rem 0.75rem',
                    borderBottom: '1px solid #1e293b',
                    fontSize: '0.85rem',
                  }}
                >
                  {row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: '#64748b' }}>
        {sorted.length} of {data.length} rows
      </p>
    </div>
  );
}
