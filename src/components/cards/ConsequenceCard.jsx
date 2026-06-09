import { Card, StatRow } from '../ui'
import { formatDate } from '../../utils/date'
import { calculateConsequences } from '../../utils/calculations'

export function ConsequenceCard({ consequences, goal }) {
  if (!goal) return null

  return (
    <Card>
      <p className="text-xs text-muted uppercase tracking-wider mb-2">{goal.name}</p>
      <div className="space-y-1">
        <StatRow label="Remaining" value={`${consequences.remainingHours}h`} />
        <StatRow label="Current Pace" value={`${consequences.currentPace}h/day`} highlight="text-accent" />
        {consequences.expectedCompletionDate && (
          <StatRow
            label="Expected Completion"
            value={formatDate(consequences.expectedCompletionDate, 'MMM D, YYYY')}
          />
        )}
        <StatRow
          label="Days Delayed"
          value={consequences.daysDelayed}
          highlight={consequences.daysDelayed > 0 ? 'text-danger' : 'text-success'}
        />
        <StatRow
          label="Hours Behind"
          value={`${consequences.hoursBehind}h`}
          highlight={consequences.hoursBehind > 0 ? 'text-danger' : 'text-success'}
        />
      </div>
    </Card>
  )
}

export function AllConsequencesCard({ goals }) {
  if (!goals.length) return null

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-muted uppercase tracking-wider px-1">Consequences</h3>
      {goals.map((goal) => (
        <ConsequenceCard
          key={goal.id}
          goal={goal}
          consequences={calculateConsequences(goal)}
        />
      ))}
    </div>
  )
}
