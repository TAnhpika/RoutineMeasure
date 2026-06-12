import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { syncGoalHoursFromLogs } from '../utils/syncGoalHours'
import { generateId } from '../utils/id'

export const useRoutineStore = create(
  persist(
    (set, get) => ({
      routines: [],

      addRoutine: (routineData) => {
        const routine = {
          id: generateId(),
          ...routineData,
          plannedHours: Number(routineData.plannedHours),
          goalId: routineData.goalId || null,
          createdAt: new Date().toISOString(),
        }
        set((state) => ({ routines: [...state.routines, routine] }))
        syncGoalHoursFromLogs()
        return routine
      },

      updateRoutine: (id, updates) => {
        set((state) => ({
          routines: state.routines.map((r) =>
            r.id === id
              ? {
                  ...r,
                  ...updates,
                  plannedHours: updates.plannedHours != null ? Number(updates.plannedHours) : r.plannedHours,
                  goalId: updates.goalId !== undefined ? updates.goalId || null : r.goalId,
                }
              : r
          ),
        }))
        syncGoalHoursFromLogs()
      },

      deleteRoutine: (id) => {
        set((state) => ({
          routines: state.routines.filter((r) => r.id !== id),
        }))
        syncGoalHoursFromLogs()
      },

      getTotalPlannedHours: () =>
        get().routines.reduce((sum, r) => sum + r.plannedHours, 0),

      setRoutines: (routines) => {
        set({ routines })
        syncGoalHoursFromLogs()
      },

      reset: () => set({ routines: [] }),
    }),
    { name: 'rm-routines' }
  )
)
