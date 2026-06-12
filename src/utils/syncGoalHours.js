import { useGoalStore } from '../store/goalStore'
import { useRoutineStore } from '../store/routineStore'
import { useDailyLogStore } from '../store/dailyLogStore'

export function syncGoalHoursFromLogs() {
  const routines = useRoutineStore.getState().routines
  const logs = useDailyLogStore.getState().logs
  useGoalStore.getState().syncFromLogs(routines, logs)
}
