import { useForm } from 'react-hook-form'
import { Button, Input } from '../ui'

export function GoalForm({ defaultValues, onSubmit, onCancel }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: defaultValues || {
      name: '',
      description: '',
      targetHours: '',
      currentHours: 0,
      deadline: '',
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Goal Name"
        placeholder="e.g. IELTS 7.0"
        error={errors.name?.message}
        {...register('name', { required: 'Goal name is required' })}
      />
      <Input
        label="Description"
        placeholder="What do you want to achieve?"
        {...register('description')}
      />
      <Input
        label="Target Hours"
        type="number"
        step="0.5"
        min="0"
        error={errors.targetHours?.message}
        {...register('targetHours', { required: 'Target hours is required', min: 1 })}
      />
      <Input
        label="Current Hours"
        type="number"
        step="0.5"
        min="0"
        {...register('currentHours')}
      />
      <Input
        label="Deadline"
        type="date"
        error={errors.deadline?.message}
        {...register('deadline', { required: 'Deadline is required' })}
      />
      <div className="flex gap-3 pt-2">
        {onCancel && (
          <Button type="button" variant="secondary" className="flex-1" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" className="flex-1">
          Save Goal
        </Button>
      </div>
    </form>
  )
}
