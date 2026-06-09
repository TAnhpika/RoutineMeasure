import { useForm } from 'react-hook-form'
import { Button, Input, Select } from '../ui'

const categories = ['Study', 'Health', 'Work', 'Personal', 'Other']

export function RoutineForm({ defaultValues, goals = [], onSubmit, onCancel }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: defaultValues || {
      activity: '',
      category: 'Study',
      plannedHours: '',
      goalId: '',
    },
  })

  const goalOptions = [
    { value: '', label: 'No goal linked' },
    ...goals.map((g) => ({ value: g.id, label: g.name })),
  ]

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Activity Name"
        placeholder="e.g. IELTS Listening"
        error={errors.activity?.message}
        {...register('activity', { required: 'Activity name is required' })}
      />
      <Select
        label="Category"
        options={categories.map((c) => ({ value: c, label: c }))}
        {...register('category')}
      />
      <Input
        label="Planned Hours (daily)"
        type="number"
        step="0.5"
        min="0.5"
        error={errors.plannedHours?.message}
        {...register('plannedHours', { required: 'Planned hours is required', min: 0.5 })}
      />
      <Select
        label="Count hours toward"
        options={goalOptions}
        {...register('goalId')}
      />
      <div className="flex gap-3 pt-2">
        {onCancel && (
          <Button type="button" variant="secondary" className="flex-1" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" className="flex-1">
          Save Routine
        </Button>
      </div>
    </form>
  )
}
