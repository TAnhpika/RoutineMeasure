import { useState } from 'react'
import { AppLayout } from '../components/layout/AppLayout'
import { QuoteCard } from '../components/cards/QuoteCard'
import { GoalsOverviewCard } from '../components/cards/GoalProgressCard'
import { GoalDetailModal } from '../components/cards/GoalCard'
import { TodaySummaryCard } from '../components/cards/TodaySummaryCard'
import { TodayRoutineCard } from '../components/cards/TodayRoutineCard'
import { GoalForm } from '../components/forms/GoalForm'
import { EmptyState, Button, Modal } from '../components/ui'
import { useInitializeApp, useSharedRoutines } from '../hooks/useInitializeApp'
import { useGoalStore } from '../store/goalStore'
import { useDailyLogStore } from '../store/dailyLogStore'
import { useAnalyticsStore } from '../store/analyticsStore'

export default function Dashboard() {
  useInitializeApp()

  const goals = useGoalStore((s) => s.goals)
  const addGoal = useGoalStore((s) => s.addGoal)
  const updateGoal = useGoalStore((s) => s.updateGoal)
  const deleteGoal = useGoalStore((s) => s.deleteGoal)
  const routines = useSharedRoutines()
  const logs = useDailyLogStore((s) => s.logs)
  const getDashboardMetrics = useAnalyticsStore((s) => s.getDashboardMetrics)

  const [selectedGoal, setSelectedGoal] = useState(null)
  const [showGoalModal, setShowGoalModal] = useState(false)
  const [editingGoal, setEditingGoal] = useState(null)

  const handleAddGoal = () => {
    setEditingGoal(null)
    setShowGoalModal(true)
  }

  const handleEdit = (goal) => {
    setSelectedGoal(null)
    setEditingGoal(goal)
    setShowGoalModal(true)
  }

  const handleDelete = (goalId) => {
    deleteGoal(goalId)
    setSelectedGoal(null)
  }

  const handleGoalSubmit = (data) => {
    if (editingGoal) {
      updateGoal(editingGoal.id, data, routines, logs)
    } else {
      addGoal(data)
    }
    setShowGoalModal(false)
    setEditingGoal(null)
  }

  const goalFormModal = (
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
  )

  if (!goals.length) {
    return (
      <AppLayout title="Dashboard">
        <EmptyState
          icon="🎯"
          title="No goals yet"
          description="Create your first goal to start measuring your routine."
          action={
            <Button onClick={handleAddGoal}>Create Goal</Button>
          }
        />
        {goalFormModal}
      </AppLayout>
    )
  }

  const metrics = getDashboardMetrics(routines, logs)

  return (
    <AppLayout title="Dashboard">
      <div className="space-y-4">
        <QuoteCard />
        <GoalsOverviewCard goals={goals} onGoalClick={setSelectedGoal} onAddGoal={handleAddGoal} />
        <TodaySummaryCard summary={metrics.todaySummary} />
        <TodayRoutineCard routines={routines} logs={logs} />
      </div>

      <GoalDetailModal
        goal={selectedGoal}
        isOpen={Boolean(selectedGoal)}
        onClose={() => setSelectedGoal(null)}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {goalFormModal}
    </AppLayout>
  )
}
