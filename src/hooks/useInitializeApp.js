import { useEffect } from 'react'
import { useGoalStore } from '../store/goalStore'
import { useRoutineStore } from '../store/routineStore'
import { useDailyLogStore } from '../store/dailyLogStore'
import { useSettingsStore } from '../store/settingsStore'
import { useTriggerStore } from '../store/triggerStore'
import { DEFAULT_TRIGGERS } from '../constants/triggers'
import { mockData } from '../data/mockData'
import { syncGoalHoursFromLogs } from '../utils/syncGoalHours'

export const useInitializeApp = () => {
  const initialized = useSettingsStore((s) => s.initialized)
  const setInitialized = useSettingsStore((s) => s.setInitialized)
  const setTheme = useSettingsStore((s) => s.setTheme)
  const theme = useSettingsStore((s) => s.theme)
  const goals = useGoalStore((s) => s.goals)
  const setGoals = useGoalStore((s) => s.setGoals)
  const setRoutines = useRoutineStore((s) => s.setRoutines)
  const setLogs = useDailyLogStore((s) => s.setLogs)
  const triggers = useTriggerStore((s) => s.triggers)
  const setTriggers = useTriggerStore((s) => s.setTriggers)

  useEffect(() => {
    setTheme(theme)
  }, [setTheme, theme])

  useEffect(() => {
    if (triggers.length === 0) {
      setTriggers([...DEFAULT_TRIGGERS])
    }
  }, [triggers.length, setTriggers])

  useEffect(() => {
    if (goals.length > 0) {
      syncGoalHoursFromLogs()
    }
  }, []) // sync goal hours from logs on app load

  useEffect(() => {
    if (!initialized && goals.length === 0) {
      setGoals(mockData.goals)
      setRoutines(mockData.routines)
      setLogs(mockData.logs)
      if (triggers.length === 0) setTriggers([...DEFAULT_TRIGGERS])
      setInitialized(true)
    } else if (!initialized) {
      setInitialized(true)
    }
  }, [initialized, goals.length, triggers.length, setGoals, setRoutines, setLogs, setTriggers, setInitialized])
}

export const useSharedRoutines = () => useRoutineStore((s) => s.routines)

export const useTriggers = () => useTriggerStore((s) => s.triggers)
