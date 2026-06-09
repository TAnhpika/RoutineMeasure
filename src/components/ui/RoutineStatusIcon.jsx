import { getLogDisplayStatus } from '../../utils/calculations'

const styles = {
  met: 'bg-success/20 border-success text-success',
  partial: 'bg-warning/20 border-warning text-warning',
  failed: 'bg-danger/20 border-danger text-danger',
  pending: 'bg-transparent border-muted text-muted',
}

const icons = {
  met: '✓',
  partial: '!',
  failed: '✗',
  pending: null,
}

export function RoutineStatusIcon({ log }) {
  const status = getLogDisplayStatus(log)

  return (
    <div
      className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center ${styles[status]}`}
    >
      {icons[status] ? (
        <span className="text-base font-bold leading-none">{icons[status]}</span>
      ) : (
        <span className="w-3 h-3 rounded-full bg-transparent" />
      )}
    </div>
  )
}

export function routineStatusTextClass(log) {
  const status = getLogDisplayStatus(log)
  if (status === 'met') return 'text-success'
  if (status === 'partial') return 'text-warning'
  if (status === 'failed') return 'text-danger'
  return ''
}

export function routineStatusBadge(log) {
  const status = getLogDisplayStatus(log)
  const map = {
    met: { variant: 'success', label: 'done' },
    partial: { variant: 'warning', label: 'partial' },
    failed: { variant: 'danger', label: 'failed' },
    pending: { variant: 'default', label: 'pending' },
  }
  return map[status]
}
