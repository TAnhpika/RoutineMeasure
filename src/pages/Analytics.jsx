import { useState, useMemo } from 'react'
import { AppLayout } from '../components/layout/AppLayout'
import { Card, Badge, EmptyState } from '../components/ui'
import { RecoveryCard } from '../components/cards/QuoteCard'
import { TriggerPieChart } from '../components/charts/TriggerPieChart'
import { TriggerBarChart } from '../components/charts/TriggerBarChart'
import { TriggerTrendChart } from '../components/charts/TriggerTrendChart'
import { DriftChart } from '../components/charts/DriftChart'
import { AllConsequencesCard } from '../components/cards/ConsequenceCard'
import { useInitializeApp, useSharedRoutines } from '../hooks/useInitializeApp'
import { useGoalStore } from '../store/goalStore'
import { useDailyLogStore } from '../store/dailyLogStore'
import { useAnalyticsStore } from '../store/analyticsStore'
import { calculateTriggerTrend, calculateDailyHours } from '../utils/calculations'
import { getWeekDates } from '../utils/date'

const tabs = ['Daily', 'Weekly', 'Monthly']

export default function Analytics() {
  useInitializeApp()
  const [activeTab, setActiveTab] = useState('Weekly')

  const goals = useGoalStore((s) => s.goals)
  const routines = useSharedRoutines()
  const logs = useDailyLogStore((s) => s.logs)
  const getDailyReport = useAnalyticsStore((s) => s.getDailyReport)
  const getWeeklyReport = useAnalyticsStore((s) => s.getWeeklyReport)
  const getMonthlyReport = useAnalyticsStore((s) => s.getMonthlyReport)

  const routineIds = useMemo(() => routines.map((r) => r.id), [routines])
  const sharedLogs = useMemo(() => logs.filter((l) => routineIds.includes(l.routineId)), [logs, routineIds])

  const report = useMemo(() => {
    if (activeTab === 'Daily') return getDailyReport(logs, routineIds)
    if (activeTab === 'Monthly') return getMonthlyReport(logs, routineIds)
    return getWeeklyReport(logs, routineIds)
  }, [activeTab, logs, routineIds, getDailyReport, getWeeklyReport, getMonthlyReport])

  const triggerTrend = useMemo(() => calculateTriggerTrend(sharedLogs), [sharedLogs])
  const trendTriggers = useMemo(
    () => report.triggers.distribution.slice(0, 5).map((t) => t.name),
    [report.triggers]
  )

  const driftChartData = useMemo(() => {
    const dates = activeTab === 'Daily' ? [getWeekDates()[6]] : getWeekDates()
    return dates.map((date) => {
      const dayLogs = sharedLogs.filter((l) => l.date === date)
      const { planned, actual, drift } = calculateDailyHours(dayLogs)
      return {
        label: date.slice(5),
        planned: Math.round(planned * 10) / 10,
        actual: Math.round(actual * 10) / 10,
        drift: Math.round(drift * 10) / 10,
      }
    })
  }, [activeTab, sharedLogs])

  if (!goals.length) {
    return (
      <AppLayout title="Analytics">
        <EmptyState icon="📊" title="No data yet" description="Create a goal and start checking in to see analytics." />
      </AppLayout>
    )
  }

  return (
    <AppLayout title="Analytics">
      <div className="flex gap-2 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === tab ? 'bg-accent text-white' : 'bg-surface-card border border-border text-muted'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <Card>
          <h3 className="text-sm font-semibold text-muted uppercase tracking-wider mb-3">
            {activeTab} Report
          </h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <p className="text-xl font-bold text-accent">{report.planned}h</p>
              <p className="text-xs text-muted">Planned</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-success">{report.actual}h</p>
              <p className="text-xs text-muted">Actual</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-danger">{report.drift ?? report.drift}h</p>
              <p className="text-xs text-muted">Drift</p>
            </div>
          </div>
        </Card>

        <RecoveryCard recovery={report.recovery} period={activeTab} />

        <Card>
          <h3 className="text-sm font-semibold text-muted uppercase tracking-wider mb-2">Drift Overview</h3>
          <DriftChart data={driftChartData} />
        </Card>

        <Card>
          <h3 className="text-sm font-semibold text-muted uppercase tracking-wider mb-2">Trigger Distribution</h3>
          <TriggerPieChart data={report.triggers.distribution} />
        </Card>

        <Card>
          <h3 className="text-sm font-semibold text-muted uppercase tracking-wider mb-2">Top Trigger Ranking</h3>
          <TriggerBarChart data={report.triggers.distribution} />
        </Card>

        <Card>
          <h3 className="text-sm font-semibold text-muted uppercase tracking-wider mb-2">Trigger Trend</h3>
          <TriggerTrendChart data={triggerTrend} triggers={trendTriggers} />
        </Card>

        <AllConsequencesCard goals={goals} />

        {report.triggers.distribution.length > 0 && (
          <Card>
            <h3 className="text-sm font-semibold text-muted uppercase tracking-wider mb-3">Trigger Frequency</h3>
            <div className="space-y-2">
              {report.triggers.distribution.map((t) => (
                <div key={t.name} className="flex items-center justify-between">
                  <span className="text-sm">{t.name}</span>
                  <div className="flex items-center gap-2">
                    <Badge>{t.count}x</Badge>
                    <span className="text-sm font-semibold">{t.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </AppLayout>
  )
}
