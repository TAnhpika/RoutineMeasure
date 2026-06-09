import { useState } from 'react'
import { Card, Button, Input, Modal } from '../ui'
import { useTriggerStore } from '../../store/triggerStore'

export function TriggerManager() {
  const triggers = useTriggerStore((s) => s.triggers)
  const addTrigger = useTriggerStore((s) => s.addTrigger)
  const updateTrigger = useTriggerStore((s) => s.updateTrigger)
  const deleteTrigger = useTriggerStore((s) => s.deleteTrigger)

  const [newName, setNewName] = useState('')
  const [editing, setEditing] = useState(null)
  const [editName, setEditName] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [error, setError] = useState('')

  const handleAdd = (e) => {
    e.preventDefault()
    const ok = addTrigger(newName)
    if (ok) {
      setNewName('')
      setError('')
    } else {
      setError('Trigger already exists or name is empty')
    }
  }

  const handleSaveEdit = () => {
    const ok = updateTrigger(editing, editName)
    if (ok) {
      setEditing(null)
      setEditName('')
      setError('')
    } else {
      setError('Name is empty or already taken')
    }
  }

  const handleDelete = () => {
    deleteTrigger(deleteTarget)
    setDeleteTarget(null)
  }

  return (
    <>
      <Card>
        <h3 className="font-semibold mb-1">Triggers</h3>
        <p className="text-sm text-muted mb-4">
          Manage reasons that cause drift from your routine
        </p>

        <form onSubmit={handleAdd} className="flex gap-2 mb-4">
          <Input
            placeholder="New trigger name..."
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" size="md">Add</Button>
        </form>
        {error && !editing && <p className="text-sm text-danger mb-3">{error}</p>}

        <div className="space-y-2">
          {triggers.map((trigger) => (
            <div
              key={trigger}
              className="flex items-center justify-between p-3 bg-surface rounded-xl"
            >
              <span className="font-medium text-sm">{trigger}</span>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => { setEditing(trigger); setEditName(trigger); setError('') }}
                >
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDeleteTarget(trigger)}
                >
                  ✕
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Modal
        isOpen={!!editing}
        onClose={() => { setEditing(null); setError('') }}
        title="Edit Trigger"
        footer={
          <>
            <Button variant="secondary" onClick={() => setEditing(null)}>Cancel</Button>
            <Button onClick={handleSaveEdit}>Save</Button>
          </>
        }
      >
        <Input
          label="Trigger name"
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
        />
        {error && editing && <p className="text-sm text-danger mt-2">{error}</p>}
      </Modal>

      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Trigger?"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete}>Delete</Button>
          </>
        }
      >
        <p className="text-sm text-muted">
          Remove &ldquo;{deleteTarget}&rdquo; from the list? Past logs will keep this trigger for history.
        </p>
      </Modal>
    </>
  )
}
