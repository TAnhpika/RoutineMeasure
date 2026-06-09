const variants = {
  primary: 'bg-accent hover:bg-accent-hover text-white',
  secondary: 'bg-surface-elevated hover:bg-border text-text border border-border',
  danger: 'bg-danger/10 hover:bg-danger/20 text-danger border border-danger/30',
  ghost: 'bg-transparent hover:bg-surface-elevated text-muted',
  success: 'bg-success/10 hover:bg-success/20 text-success border border-success/30',
}

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled,
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
