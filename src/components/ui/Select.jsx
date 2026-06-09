export function Select({ label, error, options, className = '', ...props }) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && <label className="block text-sm font-medium text-muted">{label}</label>}
      <select
        className="w-full px-4 py-2.5 bg-surface border border-border rounded-xl text-text focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all appearance-none"
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value ?? opt} value={opt.value ?? opt}>
            {opt.label ?? opt}
          </option>
        ))}
      </select>
      {error && <p className="text-sm text-danger">{error}</p>}
    </div>
  )
}
