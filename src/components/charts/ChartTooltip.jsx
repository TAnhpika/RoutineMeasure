export function ChartTooltip({ active, payload, label, suffix = 'h' }) {
  if (!active || !payload?.length) return null

  return (
    <div className="rounded-xl border border-border/80 bg-surface-elevated/95 backdrop-blur-md px-3.5 py-3 shadow-xl shadow-black/30 min-w-[148px] pointer-events-none">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted mb-2.5">{label}</p>
      <ul className="space-y-2">
        {payload.map((entry) => (
          <li key={entry.dataKey} className="flex items-center justify-between gap-5">
            <div className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full shrink-0 ring-2 ring-white/10"
                style={{ backgroundColor: entry.color || entry.fill }}
              />
              <span className="text-xs text-muted">{entry.name}</span>
            </div>
            <span
              className="text-sm font-bold tabular-nums"
              style={{ color: entry.color || entry.fill }}
            >
              {entry.value}
              {suffix}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
