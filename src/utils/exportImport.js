import { useGoalStore } from '../store/goalStore'
import { useRoutineStore } from '../store/routineStore'
import { useDailyLogStore } from '../store/dailyLogStore'
import { useSettingsStore } from '../store/settingsStore'
import { useTriggerStore } from '../store/triggerStore'

export const exportAllData = () => {
  const data = {
    version: 3,
    exportedAt: new Date().toISOString(),
    goals: useGoalStore.getState().goals,
    routines: useRoutineStore.getState().routines,
    logs: useDailyLogStore.getState().logs,
    triggers: useTriggerStore.getState().triggers,
    settings: {
      theme: useSettingsStore.getState().theme,
    },
  }

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `routine-measure-${new Date().toISOString().slice(0, 10)}.json`
  link.click()
  URL.revokeObjectURL(url)
}

export const importAllData = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result)

        if (data.goals) useGoalStore.getState().setGoals(data.goals)
        if (data.routines) useRoutineStore.getState().setRoutines(data.routines)
        if (data.logs) useDailyLogStore.getState().setLogs(data.logs)
        if (data.triggers) useTriggerStore.getState().setTriggers(data.triggers)
        if (data.settings?.theme) useSettingsStore.getState().setTheme(data.settings.theme)

        resolve(data)
      } catch (err) {
        reject(err)
      }
    }
    reader.onerror = reject
    reader.readAsText(file)
  })

export const resetAllData = () => {
  useGoalStore.getState().reset()
  useRoutineStore.getState().reset()
  useDailyLogStore.getState().reset()
  useTriggerStore.getState().reset()
}
