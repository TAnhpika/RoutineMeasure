import { useNavigate } from 'react-router-dom'

export function FloatingActionButton({ to = '/check-in', label = 'Check-In' }) {
  const navigate = useNavigate()

  return (
    <button
      onClick={() => navigate(to)}
      className="fixed bottom-20 right-4 z-30 flex items-center gap-2 bg-accent hover:bg-accent-hover text-white px-5 py-3 rounded-full shadow-lg shadow-accent/30 transition-all duration-200 active:scale-95"
    >
      <span className="text-lg">+</span>
      <span className="font-semibold text-sm">{label}</span>
    </button>
  )
}
