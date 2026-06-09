import { AppLayout } from '../components/layout/AppLayout'
import { FloatingActionButton } from '../components/layout/FloatingActionButton'
import { QuoteCard } from '../components/cards/QuoteCard'
import { GoalsOverviewCard } from '../components/cards/GoalProgressCard'
import { TodaySummaryCard } from '../components/cards/TodaySummaryCard'
import { MainTriggerCard } from '../components/cards/MainTriggerCard'
import { TodayRoutineCard } from '../components/cards/TodayRoutineCard'
import { AllConsequencesCard } from '../components/cards/ConsequenceCard'
import { useNavigate } from 'react-router-dom'
import { EmptyState, Button } from '../components/ui'
import { useInitializeApp, useSharedRoutines } from '../hooks/useInitializeApp'
import { useGoalStore } from '../store/goalStore'
import { useDailyLogStore } from '../store/dailyLogStore'
import { useAnalyticsStore } from '../store/analyticsStore'

export default function Dashboard() {
  useInitializeApp()
  const navigate = useNavigate()

  const goals = useGoalStore((s) => s.goals)
  const routines = useSharedRoutines()
  const logs = useDailyLogStore((s) => s.logs)
  const getDashboardMetrics = useAnalyticsStore((s) => s.getDashboardMetrics)

  if (!goals.length) {
    return (
      <AppLayout title="Dashboard">
        <EmptyState
          icon="🎯"
          title="No goals yet"
          description="Create your first goal to start measuring your routine."
          action={
            <Button onClick={() => navigate('/goals')}>Go to Goals</Button>
          }
        />
      </AppLayout>
    )
  }

  const metrics = getDashboardMetrics(routines, logs)

  return (
    <AppLayout title="Dashboard">
      <div className="space-y-4">
        <QuoteCard />
        <GoalsOverviewCard goals={goals} />
        <TodaySummaryCard summary={metrics.todaySummary} />
        {metrics.triggers.topTrigger.count > 0 && (
          <MainTriggerCard trigger={metrics.triggers.topTrigger} />
        )}
        <TodayRoutineCard routines={routines} logs={logs} />
        <AllConsequencesCard goals={goals} />
      </div>
      <FloatingActionButton />
    </AppLayout>
  )
}
