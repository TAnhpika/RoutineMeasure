export function StatRow({ label, value, highlight }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-muted">{label}</span>
      <span className={`text-sm font-semibold ${highlight || ''}`}>{value}</span>
    </div>
  )
}
