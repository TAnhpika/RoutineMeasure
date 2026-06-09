import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const generateId = () => crypto.randomUUID()

export const useGoalStore = create(
  persist(
    (set, get) => ({
      goals: [],

      addGoal: (goalData) => {
        const goal = {
          id: generateId(),
          ...goalData,
          targetHours: Number(goalData.targetHours),
          currentHours: Number(goalData.currentHours || 0),
          createdAt: new Date().toISOString().slice(0, 10),
        }
        set((state) => ({ goals: [...state.goals, goal] }))
        return goal
      },

      updateGoal: (id, updates) =>
        set((state) => ({
          goals: state.goals.map((g) =>
            g.id === id
              ? {
                  ...g,
                  ...updates,
                  targetHours: updates.targetHours != null ? Number(updates.targetHours) : g.targetHours,
                  currentHours: updates.currentHours != null ? Number(updates.currentHours) : g.currentHours,
                }
              : g
          ),
        })),

      deleteGoal: (id) =>
        set((state) => ({
          goals: state.goals.filter((g) => g.id !== id),
        })),

      addHours: (id, hours) =>
        set((state) => ({
          goals: state.goals.map((g) =>
            g.id === id ? { ...g, currentHours: g.currentHours + Number(hours) } : g
          ),
        })),

      setGoals: (goals) => set({ goals }),

      reset: () => set({ goals: [] }),
    }),
    { name: 'rm-goals' }
  )
)
