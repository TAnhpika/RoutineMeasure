import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from '../pages/Dashboard'
import Analytics from '../pages/Analytics'
import Settings from '../pages/Settings'

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/goals" element={<Navigate to="/" replace />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  )
}