export function Card({ children, className = '', onClick, padding = true }) {
  return (
    <div
      onClick={onClick}
      className={`bg-surface-card border border-border rounded-2xl ${padding ? 'p-4' : ''} transition-all duration-200 ${onClick ? 'active:scale-[0.98] cursor-pointer' : ''} ${className}`}
    >
      {children}
    </div>
  )
}
