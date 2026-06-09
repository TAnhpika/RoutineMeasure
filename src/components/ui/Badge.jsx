const variants = {
  default: 'bg-surface-elevated text-muted border-border',
  danger: 'bg-danger/10 text-danger border-danger/30',
  success: 'bg-success/10 text-success border-success/30',
  warning: 'bg-warning/10 text-warning border-warning/30',
  accent: 'bg-accent/10 text-accent border-accent/30',
}

export function Badge({ children, variant = 'default', className = '' }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${variants[variant]} ${className}`}>
      {children}
    </span>
  )
}
