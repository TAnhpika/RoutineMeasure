import { StatRow } from '../ui'
import { formatDate } from '../../utils/date'
import { calculateConsequences } from '../../utils/calculations'

export function GoalConsequences({ goal }) {
  if (!goal) return null

  const consequences = calculateConsequences(goal)

  return (
    <div className="border-t border-border pt-4 mt-4 space-y-1">
      <p className="text-xs text-muted uppercase tracking-wider mb-2">Consequences</p>
      <StatRow label="Remaining" value={`${consequences.remainingHours}h`} />
      <StatRow label="Current Pace" value={`${consequences.currentPace}h/day`} highlight="text-accent" />
      {consequences.expectedCompletionDate && (
        <StatRow
          label="Expected Completion"
          value={formatDate(consequences.expectedCompletionDate, 'MMM D, YYYY')}
        />
      )}
      <StatRow
        label={consequences.isPastDeadline ? 'Days Overdue' : 'Days Delayed'}
        value={consequences.daysDelayed}
        highlight={consequences.daysDelayed > 0 ? 'text-danger' : 'text-success'}
      />
      {!consequences.isPastDeadline && (
        <StatRow
          label="Hours Behind"
          value={`${consequences.hoursBehind}h`}
          highlight={consequences.hoursBehind > 0 ? 'text-danger' : 'text-success'}
        />
      )}
    </div>
  )
}
