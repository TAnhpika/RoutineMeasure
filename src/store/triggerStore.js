import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { DEFAULT_TRIGGERS } from '../constants/triggers'
import { useDailyLogStore } from './dailyLogStore'

export const useTriggerStore = create(
  persist(
    (set, get) => ({
      triggers: [],

      setTriggers: (triggers) => set({ triggers }),

      addTrigger: (name) => {
        const trimmed = name.trim()
        if (!trimmed || get().triggers.includes(trimmed)) return false
        set((state) => ({ triggers: [...state.triggers, trimmed] }))
        return true
      },

      updateTrigger: (oldName, newName) => {
        const trimmed = newName.trim()
        if (!trimmed || (trimmed !== oldName && get().triggers.includes(trimmed))) return false

        set((state) => ({
          triggers: state.triggers.map((t) => (t === oldName ? trimmed : t)),
        }))

        if (trimmed !== oldName) {
          const logs = useDailyLogStore.getState().logs
          useDailyLogStore.getState().setLogs(
            logs.map((l) => (l.trigger === oldName ? { ...l, trigger: trimmed } : l))
          )
        }
        return true
      },

      deleteTrigger: (name) => {
        set((state) => ({
          triggers: state.triggers.filter((t) => t !== name),
        }))
      },

      reset: () => set({ triggers: [...DEFAULT_TRIGGERS] }),
    }),
    { name: 'rm-triggers' }
  )
)
