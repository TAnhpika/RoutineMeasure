import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Button, Input, Select } from '../ui'
import { ACTUAL_ACTIVITIES } from '../../constants/triggers'
import { useTriggerStore } from '../../store/triggerStore'
import { calculateItemDrift } from '../../utils/calculations'

export function RoutineLogModal({ isOpen, onClose, routine, existingLog, onSubmit, onClear }) {
  const triggers = useTriggerStore((s) => s.triggers)

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      actualHours: '',
      trigger: '',
      actualActivity: ACTUAL_ACTIVITIES[0],
      note: '',
    },
  })

  useEffect(() => {
    if (isOpen && routine) {
      const defaultTrigger = existingLog?.trigger ?? triggers[0] ?? ''
      reset({
        actualHours: existingLog?.actualHours ?? routine.plannedHours,
        trigger: defaultTrigger,
        actualActivity: existingLog?.actualActivity ?? ACTUAL_ACTIVITIES[0],
        note: existingLog?.note ?? '',
      })
    }
  }, [isOpen, routine, existingLog, reset, triggers])

  const actualHours = Number(watch('actualHours') || 0)
  const plannedHours = routine?.plannedHours ?? 0
  const drift = calculateItemDrift(plannedHours, actualHours)
  const hasDrift = actualHours < plannedHours
  const metPlan = actualHours >= plannedHours

  const handleFormSubmit = (data) => {
    const hours = Number(data.actualHours)
    const status = hours > 0 ? 'completed' : 'failed'

    onSubmit({
      status,
      plannedHours,
      actualHours: hours,
      trigger: hasDrift ? data.trigger : null,
      actualActivity: hasDrift && hours === 0 ? data.actualActivity : null,
      note: data.note || '',
    })
    onClose()
  }

  if (!isOpen || !routine) return null

  const triggerOptions = triggers.map((t) => ({ value: t, label: t }))

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-surface-elevated border border-border rounded-t-3xl sm:rounded-2xl p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-semibold mb-1">{routine.activity}</h2>
        <p className="text-sm text-muted mb-4">Log today&apos;s progress</p>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-surface rounded-xl p-3 text-center">
              <p className="text-xs text-muted mb-1">Planned</p>
              <p className="text-lg font-bold text-accent">{plannedHours}h</p>
            </div>
            <div className="bg-surface rounded-xl p-3 text-center">
              <p className="text-xs text-muted mb-1">Actual</p>
              <p className={`text-lg font-bold ${metPlan ? 'text-success' : 'text-warning'}`}>
                {actualHours || 0}h
              </p>
            </div>
            <div className="bg-surface rounded-xl p-3 text-center">
              <p className="text-xs text-muted mb-1">Drift</p>
              <p className={`text-lg font-bold ${drift > 0 ? 'text-danger' : 'text-success'}`}>
                {drift}h
              </p>
            </div>
          </div>

          <Input
            label="Hours done today"
            type="number"
            step="0.5"
            min="0"
            error={errors.actualHours?.message}
            {...register('actualHours', {
              required: 'Enter hours done',
              min: { value: 0, message: 'Cannot be negative' },
            })}
          />

          {hasDrift && (
            <div className="space-y-4 p-4 bg-danger/5 border border-danger/20 rounded-xl">
              <p className="text-sm text-danger font-medium">
                {actualHours === 0
                  ? `You missed ${plannedHours}h — what happened?`
                  : `Short by ${drift}h — what caused the drift?`}
              </p>

              {actualHours === 0 && (
                <Select
                  label="What did you do instead?"
                  options={ACTUAL_ACTIVITIES.map((a) => ({ value: a, label: a }))}
                  {...register('actualActivity')}
                />
              )}

              {triggerOptions.length > 0 ? (
                <Select
                  label="Trigger"
                  options={triggerOptions}
                  error={errors.trigger?.message}
                  {...register('trigger', { required: hasDrift ? 'Select a trigger' : false })}
                />
              ) : (
                <p className="text-sm text-muted">Add triggers in Settings first.</p>
              )}
            </div>
          )}

          {metPlan && (
            <div className="p-3 bg-success/5 border border-success/20 rounded-xl">
              <p className="text-sm text-success font-medium">✓ Plan met or exceeded. No trigger needed.</p>
            </div>
          )}

          <Input
            label="Notes (optional)"
            placeholder="Any notes for today?"
            {...register('note')}
          />

          <div className="flex gap-3 pt-2">
            {existingLog && onClear && (
              <Button type="button" variant="danger" onClick={() => { onClear(); onClose() }}>
                Clear
              </Button>
            )}
            <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Save
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
