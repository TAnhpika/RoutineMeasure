import { Card } from '../ui'

export function TodaySummaryCard({ summary }) {
  return (
    <Card>
      <h3 className="text-sm font-semibold text-muted uppercase tracking-wider mb-3">Today&apos;s Summary</h3>
      <div className="grid grid-cols-3 gap-3">
        <div className="text-center">
          <p className="text-2xl font-bold text-accent">{summary.planned}h</p>
          <p className="text-xs text-muted mt-1">Planned</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-success">{summary.actual}h</p>
          <p className="text-xs text-muted mt-1">Actual</p>
        </div>
        <div className="text-center">
          <p className={`text-2xl font-bold ${summary.drift > 0 ? 'text-danger' : 'text-success'}`}>
            {summary.drift}h
          </p>
          <p className="text-xs text-muted mt-1">Drift</p>
        </div>
      </div>
    </Card>
  )
}
