import { useState } from 'react'
import { AppLayout } from '../components/layout/AppLayout'
import { Card, Badge, EmptyState } from '../components/ui'
import { DateNav, today as getToday } from '../components/ui/DateNav'
import { RoutineLogModal } from '../components/forms/RoutineLogModal'
import { routineStatusBadge } from '../components/ui/RoutineStatusIcon'
import { useSharedRoutines } from '../hooks/useInitializeApp'
import { useDailyLogStore } from '../store/dailyLogStore'
import { calculateItemDrift } from '../utils/calculations'
import { shiftDate } from '../utils/date'

export default function CheckIn() {
  const routines = useSharedRoutines()
  const getLogForRoutine = useDailyLogStore((s) => s.getLogForRoutine)
  const upsertLog = useDailyLogStore((s) => s.upsertLog)
  const clearLogForRoutine = useDailyLogStore((s) => s.clearLogForRoutine)

  const [selectedDate, setSelectedDate] = useState(getToday())
  const [selectedRoutine, setSelectedRoutine] = useState(null)

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

  if (routines.length === 0) {
    return (
      <AppLayout title="Check-In">
        <EmptyState icon="📋" title="No routine items" description="Add routine activities in Goals first." />
      </AppLayout>
    )
  }

  return (
    <AppLayout title="Check-In">
      <DateNav
        date={selectedDate}
        onPrev={() => setSelectedDate((d) => shiftDate(d, -1))}
        onNext={() => setSelectedDate((d) => shiftDate(d, 1))}
        onResetToday={() => setSelectedDate(getToday())}
      />

      <div className="space-y-3">
        {routines.map((routine) => {
          const log = getLogForRoutine(routine.id, selectedDate)
          const drift = log ? calculateItemDrift(log.plannedHours, log.actualHours) : 0
          const badge = routineStatusBadge(log)

          return (
            <Card key={routine.id} onClick={() => setSelectedRoutine(routine)}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{routine.activity}</h3>
                  <p className="text-xs text-muted mt-0.5">
                    {routine.category} · {routine.plannedHours}h planned
                    {log && ` · ${log.actualHours}h done`}
                    {drift > 0 && ` · ${drift}h drift`}
                  </p>
                  {log?.trigger && (
                    <p className="text-xs text-danger mt-1">Trigger: {log.trigger}</p>
                  )}
                </div>
                <Badge variant={badge.variant}>{badge.label}</Badge>
              </div>
            </Card>
          )
        })}
      </div>

      <p className="text-xs text-muted mt-4 text-center">Tap an activity to log hours</p>

      <RoutineLogModal
        isOpen={!!selectedRoutine}
        onClose={() => setSelectedRoutine(null)}
        routine={selectedRoutine}
        existingLog={selectedRoutine ? getLogForRoutine(selectedRoutine.id, selectedDate) : null}
        onSubmit={handleSave}
        onClear={handleClear}
      />
    </AppLayout>
  )
}
