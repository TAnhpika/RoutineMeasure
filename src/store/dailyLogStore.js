import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { today } from '../utils/date'
import { syncGoalHoursFromLogs } from '../utils/syncGoalHours'
import { generateId } from '../utils/id'

export const useDailyLogStore = create(
  persist(
    (set, get) => ({
      logs: [],

      getLogForRoutine: (routineId, date = today()) =>
        get().logs.find((l) => l.routineId === routineId && l.date === date),

      getLogsByDate: (date = today()) => get().logs.filter((l) => l.date === date),

      upsertLog: (logData) => {
        const date = logData.date || today()
        const existing = get().getLogForRoutine(logData.routineId, date)
        const newActual = Number(logData.actualHours || 0)

        if (existing) {
          set((state) => ({
            logs: state.logs.map((l) =>
              l.id === existing.id
                ? {
                    ...l,
                    ...logData,
                    plannedHours: Number(logData.plannedHours),
                    actualHours: newActual,
                  }
                : l
            ),
          }))
        } else {
          const log = {
            id: generateId(),
            date,
            ...logData,
            plannedHours: Number(logData.plannedHours),
            actualHours: newActual,
          }
          set((state) => ({ logs: [...state.logs, log] }))
        }

        syncGoalHoursFromLogs()
      },

      clearLogForRoutine: (routineId, date = today()) => {
        const existing = get().getLogForRoutine(routineId, date)
        if (!existing) return

        set((state) => ({
          logs: state.logs.filter((l) => l.id !== existing.id),
        }))

        syncGoalHoursFromLogs()
      },

      deleteLog: (id) => {
        const log = get().logs.find((l) => l.id === id)
        set((state) => ({ logs: state.logs.filter((l) => l.id !== id) }))
        if (log) syncGoalHoursFromLogs()
        return log
      },

      toggleRoutineCheck: (routine, date = today()) => {
        const existing = get().getLogForRoutine(routine.id, date)

        if (existing) {
          get().clearLogForRoutine(routine.id, date)
          return
        }

        get().upsertLog({
          routineId: routine.id,
          date,
          status: 'completed',
          plannedHours: routine.plannedHours,
          actualHours: routine.plannedHours,
          actualActivity: null,
          trigger: null,
          note: '',
        })
      },

      setLogs: (logs) => {
        set({ logs })
        syncGoalHoursFromLogs()
      },

      reset: () => set({ logs: [] }),
    }),
    { name: 'rm-daily-logs' }
  )
)
