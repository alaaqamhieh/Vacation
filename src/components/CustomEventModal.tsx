import { useState } from 'react'
import Modal from './Modal'
import EmojiPicker from './EmojiPicker'
import { tripDays, formatShort, weekdayShort } from '../dateUtils'
import type { MealSlot, ScheduledItem } from '../types'

interface Props {
  /** When set, the modal edits this item in place instead of creating a new one. */
  initial?: ScheduledItem
  /** Resolved display name for library-backed items (title/emoji live in the library). */
  displayTitle?: string
  onSave: (item: ScheduledItem) => void
  onClose: () => void
}

/** Create a one-off event / important date, or edit any scheduled item. */
export default function CustomEventModal({ initial, displayTitle, onSave, onClose }: Props) {
  const editing = !!initial
  // Library-backed items keep their title/emoji from the activity/restaurant.
  const libraryItem = !!initial?.refId
  const [title, setTitle] = useState(initial?.title ?? '')
  const [emoji, setEmoji] = useState(initial?.emoji ?? '🎉')
  const [date, setDate] = useState(initial?.date ?? tripDays()[0])
  const [note, setNote] = useState(initial?.note ?? '')
  const [important, setImportant] = useState(initial?.milestone ?? false)
  const [meal, setMeal] = useState<MealSlot>(initial?.meal ?? 'dinner')

  const canSave = libraryItem || title.trim().length > 0

  const save = () => {
    if (!canSave) return
    if (initial) {
      onSave({
        ...initial,
        date,
        note: note.trim() || undefined,
        ...(libraryItem
          ? { meal: initial.meal ? meal : undefined }
          : { title: title.trim(), emoji, milestone: important }),
      })
      return
    }
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
      <h3>{editing ? `Edit “${libraryItem ? displayTitle : initial?.title ?? 'event'}”` : 'Add an event'}</h3>
      <p style={{ color: 'var(--text-soft)', margin: '4px 0 0', fontSize: '0.9rem' }}>
        {editing
          ? libraryItem
            ? 'Move it, add a note, or switch the meal.'
            : 'Rename it, move it, or update the note.'
          : 'Family dinners, reservations, henna night — anything with a date.'}
      </p>
      {!libraryItem && (
        <>
          <div className="field">
            <label>What is it?</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Dinner at Aunt Rana's" autoFocus />
          </div>
          <div className="field">
            <label>Emoji</label>
            <EmojiPicker value={emoji} onChange={setEmoji} />
          </div>
        </>
      )}
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
      {libraryItem && initial?.meal && (
        <div className="field">
          <label>Meal</label>
          <div className="view-toggle" style={{ alignSelf: 'flex-start' }}>
            <button className={meal === 'breakfast' ? 'on' : ''} onClick={() => setMeal('breakfast')}>🌅 Breakfast</button>
            <button className={meal === 'lunch' ? 'on' : ''} onClick={() => setMeal('lunch')}>☀️ Lunch</button>
            <button className={meal === 'dinner' ? 'on' : ''} onClick={() => setMeal('dinner')}>🌙 Dinner</button>
          </div>
        </div>
      )}
      <div className="field">
        <label>Note (optional)</label>
        <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} />
      </div>
      {!libraryItem && (
        <div className="field">
          <label style={{ display: 'flex', gap: 8, alignItems: 'center', cursor: 'pointer' }}>
            <input type="checkbox" checked={important} onChange={(e) => setImportant(e.target.checked)} />
            Important date — pin it like the wedding (asks before removal)
          </label>
        </div>
      )}
      <div className="modal-actions">
        <button className="btn ghost" onClick={onClose}>Cancel</button>
        <button className="btn" onClick={save} disabled={!canSave}>
          {editing ? 'Save changes' : 'Add to calendar'}
        </button>
      </div>
    </Modal>
  )
}
