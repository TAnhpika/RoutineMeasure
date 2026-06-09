import { dayjs, daysElapsed, getWeekDates, getMonthDates } from './date'

export const calculateItemDrift = (plannedHours, actualHours) =>
  Math.max(0, Number(plannedHours) - Number(actualHours || 0))

/** pending | met | partial | failed */
export const getLogDisplayStatus = (log) => {
  if (!log) return 'pending'
  const actual = Number(log.actualHours || 0)
  const planned = Number(log.plannedHours || 0)
  const drift = calculateItemDrift(planned, actual)

  if (log.status === 'failed' || actual === 0) return 'failed'
  if (drift > 0) return 'partial'
  return 'met'
}

export const calculateDailyDrift = (logs) =>
  logs.reduce((sum, log) => sum + calculateItemDrift(log.plannedHours, log.actualHours), 0)

export const calculateDailyHours = (logs) => {
  const planned = logs.reduce((sum, log) => sum + Number(log.plannedHours || 0), 0)
  const actual = logs.reduce((sum, log) => sum + Number(log.actualHours || 0), 0)
  return { planned, actual, drift: calculateDailyDrift(logs) }
}

export const filterLogsByDates = (logs, dates) =>
  logs.filter((log) => dates.includes(log.date))

export const calculatePeriodDrift = (logs, dates) =>
  calculateDailyDrift(filterLogsByDates(logs, dates))

export const calculateWeeklyDrift = (logs) => calculatePeriodDrift(logs, getWeekDates())

export const calculateMonthlyDrift = (logs) => calculatePeriodDrift(logs, getMonthDates())

export const calculateTriggerFrequency = (logs) => {
  const counts = {}
  let total = 0

  logs.forEach((log) => {
    if (log.status === 'failed' && log.trigger) {
      counts[log.trigger] = (counts[log.trigger] || 0) + 1
      total++
    }
  })

  const distribution = Object.entries(counts)
    .map(([name, count]) => ({
      name,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count)

  const topTrigger = distribution[0] || { name: 'None', count: 0, percentage: 0 }

  return { distribution, topTrigger, total }
}

export const calculateTriggerTrend = (logs) => {
  const weekDates = getWeekDates()
  const topTriggers = calculateTriggerFrequency(logs).distribution.slice(0, 5).map((t) => t.name)

  return weekDates.map((date) => {
    const dayLogs = logs.filter((l) => l.date === date && l.status === 'failed')
    const entry = { date, label: dayjs(date).format('ddd') }

    topTriggers.forEach((trigger) => {
      entry[trigger] = dayLogs.filter((l) => l.trigger === trigger).length
    })

    return entry
  })
}

export const calculateGoalProgress = (goal) => {
  if (!goal) return { percentage: 0, remainingHours: 0 }
  const remaining = Math.max(0, goal.targetHours - goal.currentHours)
  const percentage = Math.min(100, Math.round((goal.currentHours / goal.targetHours) * 100))
  return { percentage, remainingHours: remaining }
}

export const calculateConsequences = (goal) => {
  if (!goal) {
    return {
      remainingHours: 0,
      currentPace: 0,
      expectedCompletionDate: null,
      daysDelayed: 0,
      hoursBehind: 0,
    }
  }

  const remainingHours = Math.max(0, goal.targetHours - goal.currentHours)
  const elapsed = daysElapsed(goal.createdAt)
  const currentPace = goal.currentHours / elapsed
  const deadline = dayjs(goal.deadline)
  const totalDaysToDeadline = Math.max(1, deadline.diff(dayjs(goal.createdAt), 'day'))
  const daysPassedRatio = Math.min(1, elapsed / totalDaysToDeadline)
  const expectedHoursByNow = goal.targetHours * daysPassedRatio
  const hoursBehind = Math.max(0, expectedHoursByNow - goal.currentHours)

  let expectedCompletionDate = null
  let daysDelayed = 0

  if (currentPace > 0) {
    const daysNeeded = Math.ceil(remainingHours / currentPace)
    expectedCompletionDate = dayjs().add(daysNeeded, 'day').format('YYYY-MM-DD')
    daysDelayed = Math.max(0, dayjs(expectedCompletionDate).diff(deadline, 'day'))
  }

  return {
    remainingHours,
    currentPace: Math.round(currentPace * 10) / 10,
    expectedCompletionDate,
    daysDelayed,
    hoursBehind: Math.round(hoursBehind * 10) / 10,
  }
}

export const calculateRecoveryRate = (logs, dates) => {
  if (dates.length < 2) return { rate: 0, recoveredHours: 0, lostHours: 0 }

  const sortedDates = [...dates].sort()
  const previousDate = sortedDates[sortedDates.length - 2]
  const currentDate = sortedDates[sortedDates.length - 1]

  const previousLogs = logs.filter((l) => l.date === previousDate)
  const currentLogs = logs.filter((l) => l.date === currentDate)

  const lostHours = calculateDailyDrift(previousLogs)
  const previousDrift = calculateDailyDrift(previousLogs)
  const currentDrift = calculateDailyDrift(currentLogs)
  const recoveredHours = Math.max(0, previousDrift - currentDrift)

  const rate = lostHours > 0 ? Math.round((recoveredHours / lostHours) * 100) : 100

  return { rate: Math.min(100, rate), recoveredHours, lostHours }
}

export const calculateDailyRecovery = (logs) => calculateRecoveryRate(logs, getWeekDates().slice(-2))

export const calculateWeeklyRecovery = (logs) => {
  const weekDates = getWeekDates()
  const firstHalf = weekDates.slice(0, 3)
  const secondHalf = weekDates.slice(3)

  const firstDrift = calculatePeriodDrift(logs, firstHalf)
  const secondDrift = calculatePeriodDrift(logs, secondHalf)
  const recovered = Math.max(0, firstDrift - secondDrift)

  return {
    rate: firstDrift > 0 ? Math.min(100, Math.round((recovered / firstDrift) * 100)) : 100,
    recoveredHours: recovered,
    lostHours: firstDrift,
  }
}

export const calculateMonthlyRecovery = (logs) => {
  const monthDates = getMonthDates()
  if (monthDates.length < 2) return { rate: 0, recoveredHours: 0, lostHours: 0 }

  const midpoint = Math.floor(monthDates.length / 2)
  const firstHalf = monthDates.slice(0, midpoint)
  const secondHalf = monthDates.slice(midpoint)

  const firstDrift = calculatePeriodDrift(logs, firstHalf)
  const secondDrift = calculatePeriodDrift(logs, secondHalf)
  const recovered = Math.max(0, firstDrift - secondDrift)

  return {
    rate: firstDrift > 0 ? Math.min(100, Math.round((recovered / firstDrift) * 100)) : 100,
    recoveredHours: recovered,
    lostHours: firstDrift,
  }
}

export const buildPeriodReport = (logs, dates) => {
  const periodLogs = filterLogsByDates(logs, dates)
  const { planned, actual, drift } = calculateDailyHours(periodLogs)
  const triggers = calculateTriggerFrequency(periodLogs)
  const recovery = calculateRecoveryRate(logs, dates.length >= 2 ? dates.slice(-2) : dates)

  return { planned, actual, drift, triggers, recovery }
}
