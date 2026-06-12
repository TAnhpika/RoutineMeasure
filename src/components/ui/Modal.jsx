import { Button } from './Button'
import { useModalLock } from '../../hooks/useModalLock'

export function Modal({ isOpen, onClose, title, children, footer, hideHeader = false }) {
  useModalLock(isOpen)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-surface-elevated border border-border rounded-t-3xl sm:rounded-2xl p-6 max-h-[90vh] overflow-y-auto scrollbar-hide animate-in slide-in-from-bottom duration-200">
        {!hideHeader ? (
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">{title}</h2>
            <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close">
              ✕
            </Button>
          </div>
        ) : (
          <div className="flex justify-end mb-2">
            <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close">
              ✕
            </Button>
          </div>
        )}
        <div>{children}</div>
        {footer && <div className="mt-6 flex gap-3 justify-end">{footer}</div>}
      </div>
    </div>
  )
}
