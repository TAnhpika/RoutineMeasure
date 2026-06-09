import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const COLORS = ['#3b82f6', '#ef4444', '#f59e0b', '#22c55e', '#8b5cf6']

export function TriggerTrendChart({ data, triggers = [] }) {
  if (!data?.length) {
    return <p className="text-sm text-muted text-center py-8">No trend data yet</p>
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data}>
        <XAxis dataKey="label" tick={{ fill: '#94a3b8', fontSize: 11 }} />
        <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} allowDecimals={false} />
        <Tooltip
          contentStyle={{ background: '#1e2a3a', border: '1px solid #2d3a4d', borderRadius: 8 }}
          labelStyle={{ color: '#f1f5f9' }}
        />
        <Legend wrapperStyle={{ fontSize: 11 }} />
        {triggers.map((trigger, i) => (
          <Line
            key={trigger}
            type="monotone"
            dataKey={trigger}
            stroke={COLORS[i % COLORS.length]}
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}
