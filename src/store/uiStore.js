import { create } from 'zustand'

export const useUiStore = create((set, get) => ({
  modalCount: 0,
  lockModal: () => set({ modalCount: get().modalCount + 1 }),
  unlockModal: () => set({ modalCount: Math.max(0, get().modalCount - 1) }),
}))
