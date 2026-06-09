import { formatDate, getRoutineDateLabel, isToday, today } from '../../utils/date'

export function DateNav({ date, onPrev, onNext, onResetToday }) {
  return (
    <div className="flex items-center justify-between gap-2 mb-3">
      <button
        type="button"
        onClick={onPrev}
        aria-label="Previous day"
        className="flex-shrink-0 w-9 h-9 rounded-xl bg-surface border border-border text-muted hover:text-text hover:border-accent/50 transition-all active:scale-95"
      >
        ←
      </button>

      <div className="flex-1 text-center min-w-0">
        <h3 className="text-sm font-semibold text-muted uppercase tracking-wider truncate">
          {getRoutineDateLabel(date)}
        </h3>
        <p className="text-xs text-muted mt-0.5">{formatDate(date, 'dddd, MMM D')}</p>
        {!isToday(date) && onResetToday && (
          <button
            type="button"
            onClick={onResetToday}
            className="text-xs text-accent mt-1 hover:underline"
          >
            Back to today
          </button>
        )}
      </div>

      <button
        type="button"
        onClick={onNext}
        aria-label="Next day"
        className="flex-shrink-0 w-9 h-9 rounded-xl bg-surface border border-border text-muted hover:text-text hover:border-accent/50 transition-all active:scale-95"
      >
        →
      </button>
    </div>
  )
}

export { today }
