import { useState } from 'react'
import Modal from './Modal'
import { tripDays, formatShort, weekdayShort, tripDayNumber } from '../dateUtils'
import { TRIP } from '../config'
import type { MealSlot } from '../types'

export interface AddTarget {
  kind: 'activity' | 'restaurant'
  refId: string
  title: string
  emoji: string
}

interface Props {
  target: AddTarget
  onAdd: (date: string, meal?: MealSlot) => void
  onClose: () => void
}

export default function AddToDayModal({ target, onAdd, onClose }: Props) {
  const [meal, setMeal] = useState<MealSlot>('dinner')

  return (
    <Modal onClose={onClose}>
      <h3>
        {target.emoji} Plan “{target.title}”
      </h3>
      <p style={{ color: 'var(--text-soft)', margin: '4px 0 0', fontSize: '0.9rem' }}>
        Pick a day{target.kind === 'restaurant' ? ' and a meal' : ''}.
      </p>
      {target.kind === 'restaurant' && (
        <div className="field">
          <label>Meal</label>
          <div className="view-toggle" style={{ alignSelf: 'flex-start' }}>
            <button className={meal === 'breakfast' ? 'on' : ''} onClick={() => setMeal('breakfast')}>🌅 Breakfast</button>
            <button className={meal === 'lunch' ? 'on' : ''} onClick={() => setMeal('lunch')}>☀️ Lunch</button>
            <button className={meal === 'dinner' ? 'on' : ''} onClick={() => setMeal('dinner')}>🌙 Dinner</button>
          </div>
        </div>
      )}
      <div className="day-pick-grid">
        {tripDays().map((day) => (
          <button
            key={day}
            className={`day-pick${day === TRIP.weddingDate ? ' wedding' : ''}`}
            onClick={() => onAdd(day, target.kind === 'restaurant' ? meal : undefined)}
          >
            <span className="wk">Day {tripDayNumber(day)} · {weekdayShort(day)}</span>
            {formatShort(day)}
            {day === TRIP.weddingDate ? ' 💍' : ''}
          </button>
        ))}
      </div>
      <div className="modal-actions">
        <button className="btn ghost" onClick={onClose}>Cancel</button>
      </div>
    </Modal>
  )
}
