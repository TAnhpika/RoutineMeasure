import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useSettingsStore = create(
  persist(
    (set) => ({
      theme: 'dark',
      initialized: false,

      setTheme: (theme) => {
        set({ theme })
        document.documentElement.classList.toggle('light', theme === 'light')
        document.documentElement.classList.toggle('dark', theme === 'dark')
      },

      toggleTheme: () =>
        set((state) => {
          const theme = state.theme === 'dark' ? 'light' : 'dark'
          document.documentElement.classList.toggle('light', theme === 'light')
          document.documentElement.classList.toggle('dark', theme === 'dark')
          return { theme }
        }),

      setInitialized: (initialized) => set({ initialized }),

      reset: () => set({ theme: 'dark', initialized: false }),
    }),
    { name: 'rm-settings' }
  )
)
