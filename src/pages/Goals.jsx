import { useState } from 'react'
import { AppLayout } from '../components/layout/AppLayout'
import { Button, Modal, EmptyState } from '../components/ui'
import { GoalCard, RoutineListCard } from '../components/cards/GoalCard'
import { GoalForm } from '../components/forms/GoalForm'
import { RoutineForm } from '../components/forms/RoutineForm'
import { useGoalStore } from '../store/goalStore'
import { useRoutineStore } from '../store/routineStore'

export default function Goals() {
  const goals = useGoalStore((s) => s.goals)
  const addGoal = useGoalStore((s) => s.addGoal)
  const updateGoal = useGoalStore((s) => s.updateGoal)
  const deleteGoal = useGoalStore((s) => s.deleteGoal)

  const routines = useRoutineStore((s) => s.routines)
  const addRoutine = useRoutineStore((s) => s.addRoutine)
  const updateRoutine = useRoutineStore((s) => s.updateRoutine)
  const deleteRoutine = useRoutineStore((s) => s.deleteRoutine)

  const [showGoalModal, setShowGoalModal] = useState(false)
  const [showRoutineModal, setShowRoutineModal] = useState(false)
  const [editingGoal, setEditingGoal] = useState(null)
  const [editingRoutine, setEditingRoutine] = useState(null)

  const handleGoalSubmit = (data) => {
    if (editingGoal) {
      updateGoal(editingGoal.id, data)
    } else {
      addGoal(data)
    }
    setShowGoalModal(false)
    setEditingGoal(null)
  }

  const handleRoutineSubmit = (data) => {
    if (editingRoutine) {
      updateRoutine(editingRoutine.id, data)
    } else {
      addRoutine(data)
    }
    setShowRoutineModal(false)
    setEditingRoutine(null)
  }

  return (
    <AppLayout
      title="Goals"
      action={
        <Button size="sm" onClick={() => { setEditingGoal(null); setShowGoalModal(true) }}>
          + Goal
        </Button>
      }
    >
      <div className="space-y-4">
        <RoutineListCard
          routines={routines}
          goals={goals}
          onAdd={() => { setEditingRoutine(null); setShowRoutineModal(true) }}
          onEdit={(r) => { setEditingRoutine(r); setShowRoutineModal(true) }}
          onDelete={deleteRoutine}
        />

        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-semibold text-muted uppercase tracking-wider">
            Your Goals ({goals.length})
          </h3>
        </div>

        {goals.length === 0 ? (
          <EmptyState
            icon="🎯"
            title="Create your first goal"
            description="Set a target, deadline, and track your progress."
            action={
              <Button onClick={() => setShowGoalModal(true)}>Create Goal</Button>
            }
          />
        ) : (
          goals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onEdit={(g) => { setEditingGoal(g); setShowGoalModal(true) }}
              onDelete={deleteGoal}
            />
          ))
        )}
      </div>

      <Modal
        isOpen={showGoalModal}
        onClose={() => { setShowGoalModal(false); setEditingGoal(null) }}
        title={editingGoal ? 'Edit Goal' : 'Create Goal'}
      >
        <GoalForm
          defaultValues={editingGoal}
          onSubmit={handleGoalSubmit}
          onCancel={() => { setShowGoalModal(false); setEditingGoal(null) }}
        />
      </Modal>

      <Modal
        isOpen={showRoutineModal}
        onClose={() => { setShowRoutineModal(false); setEditingRoutine(null) }}
        title={editingRoutine ? 'Edit Routine' : 'Add Routine Item'}
      >
        <RoutineForm
          defaultValues={editingRoutine}
          goals={goals}
          onSubmit={handleRoutineSubmit}
          onCancel={() => { setShowRoutineModal(false); setEditingRoutine(null) }}
        />
      </Modal>
    </AppLayout>
  )
}
