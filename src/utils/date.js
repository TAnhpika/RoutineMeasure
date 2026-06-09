import dayjs from 'dayjs'
import isoWeek from 'dayjs/plugin/isoWeek'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'

dayjs.extend(isoWeek)
dayjs.extend(isSameOrBefore)
dayjs.extend(isSameOrAfter)

export const today = () => dayjs().format('YYYY-MM-DD')

export const shiftDate = (date, days) => dayjs(date).add(days, 'day').format('YYYY-MM-DD')

export const isToday = (date) => dayjs(date).isSame(dayjs(), 'day')

export const getRoutineDateLabel = (date) => {
  const d = dayjs(date)
  const t = dayjs()
  if (d.isSame(t, 'day')) return "Today's Routine"
  if (d.isSame(t.subtract(1, 'day'), 'day')) return "Yesterday's Routine"
  if (d.isSame(t.add(1, 'day'), 'day')) return "Tomorrow's Routine"
  return d.isBefore(t, 'day') ? 'Past Routine' : 'Future Routine'
}

export const formatDate = (date, format = 'MMM D, YYYY') => dayjs(date).format(format)

export const daysBetween = (start, end) => dayjs(end).diff(dayjs(start), 'day')

export const daysElapsed = (startDate) => Math.max(1, dayjs().diff(dayjs(startDate), 'day') + 1)

export const getWeekDates = () => {
  const dates = []
  for (let i = 6; i >= 0; i--) {
    dates.push(dayjs().subtract(i, 'day').format('YYYY-MM-DD'))
  }
  return dates
}

export const getMonthDates = () => {
  const start = dayjs().startOf('month')
  const end = dayjs()
  const dates = []
  let current = start
  while (current.isSameOrBefore(end, 'day')) {
    dates.push(current.format('YYYY-MM-DD'))
    current = current.add(1, 'day')
  }
  return dates
}

export const getWeekLabels = () =>
  getWeekDates().map((d) => dayjs(d).format('ddd'))

export { dayjs }
