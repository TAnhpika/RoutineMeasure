import { useState, useRef } from 'react'
import { AppLayout } from '../components/layout/AppLayout'
import { Card, Button, Modal } from '../components/ui'
import { RoutineListCard } from '../components/cards/GoalCard'
import { RoutineForm } from '../components/forms/RoutineForm'
import { TriggerManager } from '../components/forms/TriggerManager'
import { useSettingsStore } from '../store/settingsStore'
import { exportAllData, importAllData, resetAllData } from '../utils/exportImport'
import { mockData } from '../data/mockData'
import { useGoalStore } from '../store/goalStore'
import { useRoutineStore } from '../store/routineStore'
import { useDailyLogStore } from '../store/dailyLogStore'
import { useTriggerStore } from '../store/triggerStore'

export default function Settings() {
  const theme = useSettingsStore((s) => s.theme)
  const toggleTheme = useSettingsStore((s) => s.toggleTheme)
  const goals = useGoalStore((s) => s.goals)
  const setGoals = useGoalStore((s) => s.setGoals)
  const routines = useRoutineStore((s) => s.routines)
  const setRoutines = useRoutineStore((s) => s.setRoutines)
  const addRoutine = useRoutineStore((s) => s.addRoutine)
  const updateRoutine = useRoutineStore((s) => s.updateRoutine)
  const deleteRoutine = useRoutineStore((s) => s.deleteRoutine)
  const setLogs = useDailyLogStore((s) => s.setLogs)
  const resetTriggers = useTriggerStore((s) => s.reset)

  const [showResetModal, setShowResetModal] = useState(false)
  const [showRoutineModal, setShowRoutineModal] = useState(false)
  const [editingRoutine, setEditingRoutine] = useState(null)
  const [importError, setImportError] = useState('')
  const fileInputRef = useRef(null)

  const handleRoutineSubmit = (data) => {
    if (editingRoutine) {
      updateRoutine(editingRoutine.id, data)
    } else {
      addRoutine(data)
    }
    setShowRoutineModal(false)
    setEditingRoutine(null)
  }

  const handleImport = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      await importAllData(file)
      setImportError('')
    } catch {
      setImportError('Invalid JSON file. Please check the format.')
    }
    e.target.value = ''
  }

  const handleReset = () => {
    resetAllData()
    resetTriggers()
    setGoals(mockData.goals)
    setRoutines(mockData.routines)
    setLogs(mockData.logs)
    setShowResetModal(false)
  }

  return (
    <AppLayout title="Settings">
      <div className="space-y-4">
        <Card>
          <h3 className="font-semibold mb-3">Appearance</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Theme</p>
              <p className="text-sm text-muted">Currently {theme} mode</p>
            </div>
            <Button variant="secondary" onClick={toggleTheme}>
              {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
            </Button>
          </div>
        </Card>

        <RoutineListCard
          routines={routines}
          goals={goals}
          onAdd={() => { setEditingRoutine(null); setShowRoutineModal(true) }}
          onEdit={(r) => { setEditingRoutine(r); setShowRoutineModal(true) }}
          onDelete={deleteRoutine}
        />

        <TriggerManager />

        <Card>
          <h3 className="font-semibold mb-3">Data Management</h3>
          <div className="space-y-3">
            <Button variant="secondary" className="w-full" onClick={exportAllData}>
              📤 Export Data (JSON)
            </Button>
            <Button variant="secondary" className="w-full" onClick={() => fileInputRef.current?.click()}>
              📥 Import Data (JSON)
            </Button>
            <input ref={fileInputRef} type="file" accept=".json" className="hidden" onChange={handleImport} />
            {importError && <p className="text-sm text-danger">{importError}</p>}
            <Button variant="danger" className="w-full" onClick={() => setShowResetModal(true)}>
              🗑 Reset All Data
            </Button>
          </div>
        </Card>

        <Card>
          <h3 className="font-semibold mb-2">About</h3>
          <p className="text-sm text-muted leading-relaxed">
            Routine Measure helps you identify why you deviate from your routine,
            quantify the cost of those deviations, and improve recovery speed.
          </p>
          <p className="text-xs text-muted mt-3">Version 1.0.0 · Local-only · Offline-first</p>
        </Card>
      </div>

      <Modal
        isOpen={showRoutineModal}
        onClose={() => { setShowRoutineModal(false); setEditingRoutine(null) }}
        title={editingRoutine ? 'Edit Routine' : 'Add Routine Item'}
      >
        <RoutineForm
          defaultValues={editingRoutine}
          goals={goals}
          onSubmit={handleRoutineSubmit}
          onCancel={() => { setShowRoutineModal(false); setEditingRoutine(null) }}
        />
      </Modal>

      <Modal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        title="Reset All Data?"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowResetModal(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleReset}>Reset Everything</Button>
          </>
        }
      >
        <p className="text-sm text-muted">
          This will delete all your goals, routines, and check-in logs, then reload sample data.
          This action cannot be undone unless you have exported your data.
        </p>
      </Modal>
    </AppLayout>
  )
}
