import { useState } from 'react'
import { Card } from '../ui'
import { DateNav, today as getToday } from '../ui/DateNav'
import { RoutineStatusIcon, routineStatusTextClass } from '../ui/RoutineStatusIcon'
import { RoutineLogModal } from '../forms/RoutineLogModal'
import { useDailyLogStore } from '../../store/dailyLogStore'
import { useGoalStore } from '../../store/goalStore'
import { calculateItemDrift } from '../../utils/calculations'
import { shiftDate } from '../../utils/date'

export function TodayRoutineCard({ routines, logs }) {
  const upsertLog = useDailyLogStore((s) => s.upsertLog)
  const clearLogForRoutine = useDailyLogStore((s) => s.clearLogForRoutine)
  const goals = useGoalStore((s) => s.goals)

  const [selectedDate, setSelectedDate] = useState(getToday())
  const [selectedRoutine, setSelectedRoutine] = useState(null)

  const getLog = (routineId) =>
    logs.find((l) => l.routineId === routineId && l.date === selectedDate)

  const getGoalName = (goalId) => goals.find((g) => g.id === goalId)?.name

  const handleSave = (data) => {
    if (!selectedRoutine) return
    upsertLog({
      routineId: selectedRoutine.id,
      date: selectedDate,
      ...data,
    })
  }

  const handleClear = () => {
    if (!selectedRoutine) return
    clearLogForRoutine(selectedRoutine.id, selectedDate)
  }

  if (!routines.length) {
    return (
      <Card>
        <h3 className="text-sm font-semibold text-muted uppercase tracking-wider mb-3">Today&apos;s Routine</h3>
        <p className="text-sm text-muted">No routine items yet. Add them in Settings.</p>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <DateNav
          date={selectedDate}
          onPrev={() => setSelectedDate((d) => shiftDate(d, -1))}
          onNext={() => setSelectedDate((d) => shiftDate(d, 1))}
          onResetToday={() => setSelectedDate(getToday())}
        />

        <div className="space-y-2">
          {routines.map((routine) => {
            const log = getLog(routine.id)
            const drift = log ? calculateItemDrift(log.plannedHours, log.actualHours) : 0

            return (
              <button
                key={routine.id}
                type="button"
                onClick={() => setSelectedRoutine(routine)}
                className="w-full flex items-center justify-between p-3 bg-surface rounded-xl hover:bg-surface-elevated transition-colors text-left"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <RoutineStatusIcon log={log} />
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium truncate ${routineStatusTextClass(log)}`}>
                      {routine.activity}
                    </p>
                    <p className="text-xs text-muted">
                      {routine.plannedHours}h planned
                      {log && ` · ${log.actualHours}h done`}
                      {drift > 0 && ` · ${drift}h drift`}
                      {log?.trigger && ` · ${log.trigger}`}
                      {routine.goalId && ` · ${getGoalName(routine.goalId)}`}
                    </p>
                  </div>
                </div>
                <span className="text-muted text-sm">→</span>
              </button>
            )
          })}
        </div>
        <p className="text-xs text-muted mt-3 text-center">Tap an activity to log hours</p>
      </Card>

      <RoutineLogModal
        isOpen={!!selectedRoutine}
        onClose={() => setSelectedRoutine(null)}
        routine={selectedRoutine}
        existingLog={selectedRoutine ? getLog(selectedRoutine.id) : null}
        onSubmit={handleSave}
        onClear={handleClear}
      />
    </>
  )
}
