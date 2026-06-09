import { Card, Badge } from '../ui'

export function MainTriggerCard({ trigger }) {
  return (
    <Card className="border-danger/30 bg-danger/5">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">⚠️</span>
        <h3 className="text-sm font-semibold text-muted uppercase tracking-wider">Main Trigger</h3>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-2xl font-bold">{trigger.name}</p>
          <p className="text-sm text-muted mt-1">{trigger.count} occurrences</p>
        </div>
        <Badge variant="danger" className="text-lg px-3 py-1">
          {trigger.percentage}%
        </Badge>
      </div>
    </Card>
  )
}
