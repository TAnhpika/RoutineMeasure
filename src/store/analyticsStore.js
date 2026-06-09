import { create } from 'zustand'
import {
  calculateDailyHours,
  calculateTriggerFrequency,
  calculateWeeklyDrift,
  calculateMonthlyDrift,
  calculateDailyRecovery,
  calculateWeeklyRecovery,
  calculateMonthlyRecovery,
  buildPeriodReport,
} from '../utils/calculations'
import { today, getWeekDates, getMonthDates } from '../utils/date'

export const useAnalyticsStore = create(() => ({
  getDashboardMetrics: (routines, logs) => {
    const date = today()
    const routineIds = routines.map((r) => r.id)
    const todayLogs = logs.filter((l) => l.date === date && routineIds.includes(l.routineId))
    const allLogs = logs.filter((l) => routineIds.includes(l.routineId))

    return {
      todaySummary: calculateDailyHours(todayLogs),
      triggers: calculateTriggerFrequency(allLogs),
      todayLogs,
    }
  },

  getDailyReport: (logs, routineIds) => {
    const date = today()
    const filtered = logs.filter((l) => l.date === date && routineIds.includes(l.routineId))
    return {
      ...buildPeriodReport(filtered, [date]),
      recovery: calculateDailyRecovery(logs.filter((l) => routineIds.includes(l.routineId))),
    }
  },

  getWeeklyReport: (logs, routineIds) => {
    const weekDates = getWeekDates()
    const filtered = logs.filter((l) => routineIds.includes(l.routineId))
    return {
      ...buildPeriodReport(filtered, weekDates),
      drift: calculateWeeklyDrift(filtered),
      recovery: calculateWeeklyRecovery(filtered),
    }
  },

  getMonthlyReport: (logs, routineIds) => {
    const monthDates = getMonthDates()
    const filtered = logs.filter((l) => routineIds.includes(l.routineId))
    return {
      ...buildPeriodReport(filtered, monthDates),
      drift: calculateMonthlyDrift(filtered),
      recovery: calculateMonthlyRecovery(filtered),
    }
  },
}))
