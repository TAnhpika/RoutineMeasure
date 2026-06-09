export function ProgressBar({ value, max = 100, className = '', color = 'accent' }) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))
  const colors = {
    accent: 'bg-accent',
    success: 'bg-success',
    danger: 'bg-danger',
    warning: 'bg-warning',
  }

  return (
    <div className={`w-full h-2 bg-surface rounded-full overflow-hidden ${className}`}>
      <div
        className={`h-full rounded-full transition-all duration-500 ${colors[color]}`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  )
}
