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

export const hasLogDrift = (log) =>
  calculateItemDrift(log.plannedHours, log.actualHours) > 0

export const shouldCountTrigger = (log) =>
  Boolean(log?.trigger) && (log.status === 'failed' || hasLogDrift(log))

export const calculateTriggerFrequency = (logs) => {
  const counts = {}
  let total = 0

  logs.forEach((log) => {
    if (shouldCountTrigger(log)) {
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
    const dayLogs = logs.filter((l) => l.date === date && shouldCountTrigger(l))
    const entry = { date, label: dayjs(date).format('ddd') }

    topTriggers.forEach((trigger) => {
      entry[trigger] = dayLogs.filter((l) => l.trigger === trigger).length
    })

    return entry
  })
}

export const calculateGoalProgress = (goal) => {
  if (!goal) return { percentage: 0, remainingHours: 0, currentHours: 0 }
  const target = Math.max(1, Number(goal.targetHours) || 1)
  const current = Math.max(0, Number(goal.currentHours) || 0)
  const remaining = Math.max(0, target - current)
  const percentage = Math.min(100, Math.max(0, Math.round((current / target) * 100)))
  return { percentage, remainingHours: remaining, currentHours: current }
}

export const calculateConsequences = (goal) => {
  if (!goal) {
    return {
      remainingHours: 0,
      currentPace: 0,
      expectedCompletionDate: null,
      daysDelayed: 0,
      hoursBehind: 0,
      isPastDeadline: false,
    }
  }

  const now = dayjs()
  const target = Math.max(1, Number(goal.targetHours) || 1)
  const current = Math.max(0, Number(goal.currentHours) || 0)
  const remainingHours = Math.max(0, target - current)
  const createdAt = dayjs(goal.createdAt || now.format('YYYY-MM-DD'))
  const deadline = dayjs(goal.deadline)
  const elapsed = daysElapsed(goal.createdAt)
  const currentPace = elapsed > 0 ? current / elapsed : 0
  const isPastDeadline = remainingHours > 0 && now.isAfter(deadline, 'day')
  const totalDaysToDeadline = deadline.diff(createdAt, 'day')

  let hoursBehind = 0
  if (remainingHours <= 0) {
    hoursBehind = 0
  } else if (totalDaysToDeadline > 0 && !now.isAfter(deadline, 'day')) {
    const scheduleDays = Math.min(elapsed, totalDaysToDeadline)
    const expectedHoursByNow = target * (scheduleDays / totalDaysToDeadline)
    hoursBehind = Math.max(0, expectedHoursByNow - current)
  }

  let expectedCompletionDate = null
  let daysDelayed = 0

  if (remainingHours > 0 && currentPace > 0) {
    const daysNeeded = Math.ceil(remainingHours / currentPace)
    expectedCompletionDate = now.add(daysNeeded, 'day').format('YYYY-MM-DD')
  }

  if (remainingHours > 0) {
    if (isPastDeadline) {
      daysDelayed = now.diff(deadline, 'day')
    } else if (expectedCompletionDate) {
      daysDelayed = Math.max(0, dayjs(expectedCompletionDate).diff(deadline, 'day'))
    }
  }

  return {
    remainingHours,
    currentPace: Math.round(currentPace * 10) / 10,
    expectedCompletionDate,
    daysDelayed,
    hoursBehind: Math.round(hoursBehind * 10) / 10,
    isPastDeadline,
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
