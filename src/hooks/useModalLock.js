import { useEffect } from 'react'
import { useUiStore } from '../store/uiStore'

export function useModalLock(isOpen) {
  const lockModal = useUiStore((s) => s.lockModal)
  const unlockModal = useUiStore((s) => s.unlockModal)

  useEffect(() => {
    if (!isOpen) return

    lockModal()
    document.body.style.overflow = 'hidden'

    return () => {
      unlockModal()
      if (useUiStore.getState().modalCount === 0) {
        document.body.style.overflow = ''
      }
    }
  }, [isOpen, lockModal, unlockModal])
}
