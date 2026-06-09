import { BottomNav } from './BottomNav'

export function AppLayout({ children, title, action }) {
  return (
    <div className="min-h-screen bg-surface">
      <header className="sticky top-0 z-30 bg-surface/95 backdrop-blur-lg border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted uppercase tracking-wider">Routine Measure</p>
            {title && <h1 className="text-xl font-bold">{title}</h1>}
          </div>
          {action}
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-4 pb-28">{children}</main>

      <BottomNav />
    </div>
  )
}
