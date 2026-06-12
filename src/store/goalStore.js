import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  calculateGoalTotalHours,
  calculateLoggedHoursForGoal,
  migrateGoalBaseline,
} from '../utils/goalHours'
import { generateId } from '../utils/id'

export const useGoalStore = create(
  persist(
    (set) => ({
      goals: [],

      addGoal: (goalData) => {
        const baselineHours = Math.max(0, Number(goalData.currentHours || 0))
        const goal = {
          id: generateId(),
          name: goalData.name,
          description: goalData.description,
          targetHours: Number(goalData.targetHours),
          baselineHours,
          currentHours: baselineHours,
          deadline: goalData.deadline,
          createdAt: new Date().toISOString().slice(0, 10),
        }
        set((state) => ({ goals: [...state.goals, goal] }))
        return goal
      },

      updateGoal: (id, updates, routines = [], logs = []) => {
        set((state) => ({
          goals: state.goals.map((g) => {
            if (g.id !== id) return g

            let baselineHours = g.baselineHours ?? migrateGoalBaseline(g, routines, logs)

            if (updates.currentHours != null) {
              const logged = calculateLoggedHoursForGoal(id, routines, logs)
              baselineHours = Math.max(0, Number(updates.currentHours) - logged)
            }

            const next = {
              ...g,
              ...updates,
              baselineHours,
              targetHours: updates.targetHours != null ? Number(updates.targetHours) : g.targetHours,
            }

            return {
              ...next,
              currentHours: calculateGoalTotalHours(next, routines, logs),
            }
          }),
        }))
      },

      deleteGoal: (id) =>
        set((state) => ({
          goals: state.goals.filter((g) => g.id !== id),
        })),

      syncFromLogs: (routines, logs) => {
        set((state) => ({
          goals: state.goals.map((g) => {
            const baselineHours = migrateGoalBaseline(g, routines, logs)
            return {
              ...g,
              baselineHours,
              currentHours: calculateGoalTotalHours({ ...g, baselineHours }, routines, logs),
            }
          }),
        }))
      },

      setGoals: (goals) => set({ goals }),

      reset: () => set({ goals: [] }),
    }),
    { name: 'rm-goals' }
  )
)
