import { Card } from '../ui'

export function QuoteCard() {
  return (
    <Card className="bg-accent/5 border-accent/20">
      <p className="text-sm italic leading-relaxed text-text/90">
        &ldquo;I believe I can surpass my feelings. Just with discipline I can achieve my goals.&rdquo;
      </p>
    </Card>
  )
}

export function RecoveryCard({ recovery, period = 'Daily' }) {
  return (
    <Card>
      <h3 className="text-sm font-semibold text-muted uppercase tracking-wider mb-3">
        {period} Recovery Rate
      </h3>
      <div className="flex items-center gap-4">
        <div className="relative w-20 h-20">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="15.5" fill="none" stroke="currentColor" strokeWidth="3" className="text-surface" />
            <circle
              cx="18"
              cy="18"
              r="15.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeDasharray={`${recovery.rate} 100`}
              className="text-accent"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-lg font-bold">
            {recovery.rate}%
          </span>
        </div>
        <div>
          <p className="text-sm text-muted">Recovered {recovery.recoveredHours}h of {recovery.lostHours}h lost</p>
        </div>
      </div>
    </Card>
  )
}
