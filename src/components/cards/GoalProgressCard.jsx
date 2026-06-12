import { Card, Button, ProgressBar } from '../ui'
import { formatDate } from '../../utils/date'
import { calculateGoalProgress } from '../../utils/calculations'

export function GoalProgressCard({ goal, progress, compact = false, onClick }) {
  if (!goal) return null

  if (compact) {
    return (
      <button
        type="button"
        onClick={() => onClick?.(goal)}
        className="w-full text-left bg-surface rounded-xl p-3 transition-all duration-200 hover:bg-surface-elevated active:scale-[0.99] cursor-pointer"
      >
        <div className="flex items-start justify-between mb-2">
          <div className="min-w-0 flex-1">
            <p className="font-semibold truncate">{goal.name}</p>
            <p className="text-xs text-muted mt-0.5">{formatDate(goal.deadline, 'MMM D, YYYY')}</p>
          </div>
          <span className="text-lg font-bold text-accent ml-2">{progress.percentage}%</span>
        </div>
        <ProgressBar value={progress.percentage} className="mb-2" />
        <div className="flex justify-between text-xs text-muted">
          <span>{progress.currentHours}h / {goal.targetHours}h</span>
          <span>{progress.remainingHours}h left</span>
        </div>
      </button>
    )
  }

  return (
    <Card>
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-xs text-muted uppercase tracking-wider mb-1">Goal</p>
          <h2 className="text-xl font-bold">{goal.name}</h2>
        </div>
        <span className="text-2xl font-bold text-accent">{progress.percentage}%</span>
      </div>

      <ProgressBar value={progress.percentage} className="mb-4" />

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-surface rounded-xl p-3">
          <p className="text-xs text-muted">Remaining</p>
          <p className="text-lg font-semibold">{progress.remainingHours}h</p>
        </div>
        <div className="bg-surface rounded-xl p-3">
          <p className="text-xs text-muted">Deadline</p>
          <p className="text-lg font-semibold">{formatDate(goal.deadline, 'MMM D, YYYY')}</p>
        </div>
      </div>
    </Card>
  )
}

export function GoalsOverviewCard({ goals, onGoalClick, onAddGoal }) {
  if (!goals.length) return null

  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-muted uppercase tracking-wider">
          Your Goals ({goals.length})
        </h3>
        {onAddGoal && (
          <Button size="sm" onClick={onAddGoal}>+ Goal</Button>
        )}
      </div>
      <div className="space-y-3">
        {goals.map((goal) => {
          const progress = calculateGoalProgress(goal)
          return (
            <GoalProgressCard
              key={goal.id}
              goal={goal}
              progress={progress}
              compact
              onClick={onGoalClick}
            />
          )
        })}
      </div>
    </Card>
  )
}
