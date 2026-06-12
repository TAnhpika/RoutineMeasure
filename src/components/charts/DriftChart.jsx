import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts'
import { ChartTooltip } from './ChartTooltip'

const SERIES = [
  { key: 'planned', fill: '#3b82f6', hover: '#60a5fa', name: 'Planned' },
  { key: 'actual', fill: '#22c55e', hover: '#4ade80', name: 'Actual' },
  { key: 'drift', fill: '#ef4444', hover: '#f87171', name: 'Drift' },
]

export function DriftChart({ data }) {
  if (!data?.length) {
    return <p className="text-sm text-muted text-center py-8">No drift data yet</p>
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} barGap={2} barCategoryGap="24%">
        <CartesianGrid stroke="#2d3a4d" strokeDasharray="3 3" vertical={false} opacity={0.5} />
        <XAxis
          dataKey="label"
          tick={{ fill: '#94a3b8', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: '#94a3b8', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={28}
        />
        <Tooltip
          content={<ChartTooltip />}
          cursor={{ fill: 'rgba(148, 163, 184, 0.08)', radius: 8 }}
          animationDuration={150}
        />
        <Legend
          wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
          iconType="circle"
          iconSize={8}
        />
        {SERIES.map(({ key, fill, hover, name }) => (
          <Bar
            key={key}
            dataKey={key}
            fill={fill}
            name={name}
            radius={[4, 4, 0, 0]}
            activeBar={{ fill: hover, stroke: hover, strokeWidth: 0, opacity: 0.95 }}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  )
}
