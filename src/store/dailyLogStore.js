import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { today } from '../utils/date'
import { useGoalStore } from './goalStore'
import { useRoutineStore } from './routineStore'

const generateId = () => crypto.randomUUID()

const resolveGoalId = (logData) => {
  if (logData.goalId) return logData.goalId
  const routine = useRoutineStore.getState().routines.find((r) => r.id === logData.routineId)
  return routine?.goalId || null
}

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
        const previousActual = existing?.actualHours || 0
        const newActual = Number(logData.actualHours || 0)
        const goalId = resolveGoalId(logData)

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

        const hoursDiff = newActual - previousActual
        if (hoursDiff !== 0 && goalId) {
          useGoalStore.getState().addHours(goalId, hoursDiff)
        }
      },

      clearLogForRoutine: (routineId, date = today()) => {
        const existing = get().getLogForRoutine(routineId, date)
        if (!existing) return

        const routine = useRoutineStore.getState().routines.find((r) => r.id === routineId)
        const goalId = routine?.goalId

        if (existing.actualHours && goalId) {
          useGoalStore.getState().addHours(goalId, -existing.actualHours)
        }

        set((state) => ({
          logs: state.logs.filter((l) => l.id !== existing.id),
        }))
      },

      deleteLog: (id) => {
        const log = get().logs.find((l) => l.id === id)
        set((state) => ({ logs: state.logs.filter((l) => l.id !== id) }))
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

      setLogs: (logs) => set({ logs }),

      reset: () => set({ logs: [] }),
    }),
    { name: 'rm-daily-logs' }
  )
)
