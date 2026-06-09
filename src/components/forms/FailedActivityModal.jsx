import { useForm } from 'react-hook-form'
import { Button, Input, Select } from '../ui'
import { ACTUAL_ACTIVITIES } from '../../constants/triggers'
import { useTriggerStore } from '../../store/triggerStore'

export function FailedActivityModal({ isOpen, onClose, routine, onSubmit }) {
  const triggers = useTriggerStore((s) => s.triggers)

  const {
    register,
    handleSubmit,
    reset,
  } = useForm({
    defaultValues: {
      actualActivity: ACTUAL_ACTIVITIES[0],
      trigger: triggers[0] ?? '',
      note: '',
    },
  })

  const handleFormSubmit = (data) => {
    onSubmit({
      status: 'failed',
      plannedHours: routine.plannedHours,
      actualHours: 0,
      ...data,
    })
    reset()
    onClose()
  }

  if (!isOpen || !routine) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-surface-elevated border border-border rounded-t-3xl sm:rounded-2xl p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-semibold mb-1">Activity Failed</h2>
        <p className="text-sm text-muted mb-4">{routine.activity} — {routine.plannedHours}h planned</p>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <Select
            label="What did you do instead?"
            options={ACTUAL_ACTIVITIES.map((a) => ({ value: a, label: a }))}
            {...register('actualActivity')}
          />
          <Select
            label="Trigger"
            options={triggers.map((t) => ({ value: t, label: t }))}
            {...register('trigger')}
          />
          <Input
            label="Notes (optional)"
            placeholder="What happened?"
            {...register('note')}
          />
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="danger" className="flex-1">
              Save Failure
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
