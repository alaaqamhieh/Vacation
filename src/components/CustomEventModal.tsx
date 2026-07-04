import { useState } from 'react'
import Modal from './Modal'
import { tripDays, formatShort, weekdayShort } from '../dateUtils'
import type { ScheduledItem } from '../types'

interface Props {
  onSave: (item: ScheduledItem) => void
  onClose: () => void
}

/** Create a one-off event or pinned important date directly on the calendar. */
export default function CustomEventModal({ onSave, onClose }: Props) {
  const [title, setTitle] = useState('')
  const [emoji, setEmoji] = useState('🎉')
  const [date, setDate] = useState(tripDays()[0])
  const [note, setNote] = useState('')
  const [important, setImportant] = useState(false)

  const save = () => {
    if (!title.trim()) return
    onSave({
      id: `custom-${Date.now()}`,
      date,
      kind: 'milestone',
      title: title.trim(),
      emoji,
      note: note.trim() || undefined,
      milestone: important,
    })
  }

  return (
    <Modal onClose={onClose}>
      <h3>Add an event</h3>
      <p style={{ color: 'var(--text-soft)', margin: '4px 0 0', fontSize: '0.9rem' }}>
        Family dinners, reservations, henna night — anything with a date.
      </p>
      <div className="field">
        <label>What is it?</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Dinner at Aunt Rana's" autoFocus />
      </div>
      <div className="field">
        <label>Emoji</label>
        <input value={emoji} onChange={(e) => setEmoji(e.target.value)} maxLength={4} style={{ width: 80 }} />
      </div>
      <div className="field">
        <label>Day</label>
        <select value={date} onChange={(e) => setDate(e.target.value)}>
          {tripDays().map((d) => (
            <option key={d} value={d}>
              {weekdayShort(d)}, {formatShort(d)}
            </option>
          ))}
        </select>
      </div>
      <div className="field">
        <label>Note (optional)</label>
        <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} />
      </div>
      <div className="field">
        <label style={{ display: 'flex', gap: 8, alignItems: 'center', cursor: 'pointer' }}>
          <input type="checkbox" checked={important} onChange={(e) => setImportant(e.target.checked)} />
          Important date — pin it like the wedding (asks before removal)
        </label>
      </div>
      <div className="modal-actions">
        <button className="btn ghost" onClick={onClose}>Cancel</button>
        <button className="btn" onClick={save} disabled={!title.trim()}>Add to calendar</button>
      </div>
    </Modal>
  )
}
