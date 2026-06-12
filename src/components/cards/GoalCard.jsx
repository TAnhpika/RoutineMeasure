import { Card, Button, Badge, ProgressBar, Modal } from '../ui'
import { formatDate } from '../../utils/date'
import { calculateGoalProgress } from '../../utils/calculations'
import { GoalConsequences } from './ConsequenceCard'

export function GoalDetailContent({ goal, onEdit, onDelete }) {
  const progress = calculateGoalProgress(goal)

  return (
    <>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-bold">{goal.name}</h2>
          {goal.description && (
            <p className="text-sm text-muted mt-1">{goal.description}</p>
          )}
        </div>
        <span className="text-xl font-bold text-accent flex-shrink-0">{progress.percentage}%</span>
      </div>

      <ProgressBar value={progress.percentage} className="mb-4" />

      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="bg-surface rounded-xl p-3">
          <p className="text-xs text-muted">Target</p>
          <p className="text-base font-bold">{goal.targetHours}h</p>
        </div>
        <div className="bg-surface rounded-xl p-3">
          <p className="text-xs text-muted">Current</p>
          <p className="text-base font-bold">{progress.currentHours}h</p>
        </div>
        <div className="bg-surface rounded-xl p-3">
          <p className="text-xs text-muted">Remaining</p>
          <p className="text-base font-bold">{progress.remainingHours}h</p>
        </div>
        <div className="bg-surface rounded-xl p-3">
          <p className="text-xs text-muted">Deadline</p>
          <p className="text-base font-bold">{formatDate(goal.deadline, 'MMM D, YYYY')}</p>
        </div>
      </div>

      <GoalConsequences goal={goal} />

      {(onEdit || onDelete) && (
        <div className="flex gap-2 mt-4">
          {onEdit && (
            <Button variant="secondary" size="sm" className="flex-1" onClick={() => onEdit(goal)}>
              Edit
            </Button>
          )}
          {onDelete && (
            <Button variant="danger" size="sm" onClick={() => onDelete(goal.id)}>
              Delete
            </Button>
          )}
        </div>
      )}
    </>
  )
}

export function GoalDetailModal({ goal, isOpen, onClose, onEdit, onDelete }) {
  if (!goal) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} hideHeader>
      <GoalDetailContent goal={goal} onEdit={onEdit} onDelete={onDelete} />
    </Modal>
  )
}

export function GoalCard({ goal, onEdit, onDelete }) {
  return (
    <Card>
      <GoalDetailContent goal={goal} onEdit={onEdit} onDelete={onDelete} />
    </Card>
  )
}

export function RoutineListCard({ routines, goals, onAdd, onEdit, onDelete }) {
  const getGoalName = (goalId) => goals.find((g) => g.id === goalId)?.name

  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold text-muted uppercase tracking-wider">Daily Routine</h3>
          <p className="text-xs text-muted mt-0.5">Shared across all goals</p>
        </div>
        <Button size="sm" onClick={onAdd}>+ Add</Button>
      </div>

      {routines.length === 0 ? (
        <p className="text-sm text-muted text-center py-4 bg-surface rounded-xl">
          No routine items yet
        </p>
      ) : (
        <div className="space-y-2">
          {routines.map((routine) => (
            <div key={routine.id} className="flex items-center justify-between p-3 bg-surface rounded-xl">
              <div>
                <p className="font-medium text-sm">{routine.activity}</p>
                <div className="flex items-center gap-2 flex-wrap mt-0.5">
                  <p className="text-xs text-muted">
                    {routine.category} · {routine.plannedHours}h/day
                  </p>
                  {routine.goalId && (
                    <Badge variant="accent">{getGoalName(routine.goalId)}</Badge>
                  )}
                </div>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" onClick={() => onEdit(routine)}>Edit</Button>
                <Button variant="ghost" size="sm" onClick={() => onDelete(routine.id)}>✕</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
