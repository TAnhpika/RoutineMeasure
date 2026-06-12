export function getRoutineIdsForGoal(goalId, routines) {
  return routines.filter((r) => r.goalId === goalId).map((r) => r.id)
}

export function calculateLoggedHoursForGoal(goalId, routines, logs) {
  const routineIds = getRoutineIdsForGoal(goalId, routines)
  return logs
    .filter((l) => routineIds.includes(l.routineId))
    .reduce((sum, l) => sum + Number(l.actualHours || 0), 0)
}

export function calculateGoalTotalHours(goal, routines, logs) {
  const baseline = Math.max(0, Number(goal.baselineHours ?? 0))
  const logged = calculateLoggedHoursForGoal(goal.id, routines, logs)
  return Math.max(0, baseline + logged)
}

export function migrateGoalBaseline(goal, routines, logs) {
  if (goal.baselineHours != null) {
    return Math.max(0, Number(goal.baselineHours))
  }
  const logged = calculateLoggedHoursForGoal(goal.id, routines, logs)
  return Math.max(0, Number(goal.currentHours || 0) - logged)
}
