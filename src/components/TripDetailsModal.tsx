import { useState } from 'react'
import Modal from './Modal'
import { tripDays, formatShort, weekdayShort } from '../dateUtils'
import type { ScheduledItem } from '../types'

interface Props {
  /** All scheduled items, so we can prefill from the existing flight/stay events. */
  scheduled: ScheduledItem[]
  /** Upsert these items by id (and delete ids passed in `remove`). */
  onSave: (upserts: ScheduledItem[], remove: string[]) => void
  onClose: () => void
}

interface Leg {
  id: string
  emoji: string
  title: string
  label: string
  date: string
  time: string
  exists: boolean
}

const DAY_OPTIONS = tripDays()

function DayTimeRow({ leg, onChange }: { leg: Leg; onChange: (patch: Partial<Leg>) => void }) {
  return (
    <div className="leg-row">
      <div className="leg-head">
        <span aria-hidden="true">{leg.emoji}</span> {leg.label}
      </div>
      <div className="leg-inputs">
        <select value={leg.date} onChange={(e) => onChange({ date: e.target.value })} aria-label={`${leg.label} day`}>
          {DAY_OPTIONS.map((d) => (
            <option key={d} value={d}>
              {weekdayShort(d)}, {formatShort(d)}
            </option>
          ))}
        </select>
        <input
          type="time"
          value={leg.time}
          onChange={(e) => onChange({ time: e.target.value })}
          aria-label={`${leg.label} time`}
        />
      </div>
    </div>
  )
}

/** Consolidated editor for flights + accommodation; writes them onto the calendar. */
export default function TripDetailsModal({ scheduled, onSave, onClose }: Props) {
  const find = (id: string) => scheduled.find((s) => s.id === id)
  const legFrom = (id: string, emoji: string, title: string, label: string, fallbackDate: string): Leg => {
    const it = find(id)
    return {
      id,
      emoji,
      title: it?.title ?? title,
      label,
      date: it?.date ?? fallbackDate,
      time: it?.time ?? '',
      exists: !!it,
    }
  }

  const [depart, setDepart] = useState(() => legFrom('ms-depart', '✈️', 'Fly out — US ✈ Amman', 'Depart (US → Amman)', DAY_OPTIONS[5]))
  const [arrive, setArrive] = useState(() => legFrom('ms-arrive', '🛬', 'Land in Amman 🇯🇴', 'Arrive in Amman', DAY_OPTIONS[6]))
  const [ret, setRet] = useState(() => legFrom('ms-return', '🛫', 'Fly home — Amman ✈ US', 'Return (Amman → US)', DAY_OPTIONS[DAY_OPTIONS.length - 7]))

  const existingStay = find('stay-checkin')
  const [place, setPlace] = useState(() => (existingStay?.title ?? '').replace(/^🏠 Check in — /, ''))
  const [checkin, setCheckin] = useState(() => legFrom('stay-checkin', '🏠', '', 'Check-in', DAY_OPTIONS[6]))
  const [checkout, setCheckout] = useState(() => legFrom('stay-checkout', '🏠', '', 'Check-out', DAY_OPTIONS[DAY_OPTIONS.length - 7]))

  const save = () => {
    const upserts: ScheduledItem[] = []
    const remove: string[] = []

    const flight = (leg: Leg): ScheduledItem => ({
      ...find(leg.id),
      id: leg.id,
      date: leg.date,
      kind: 'milestone',
      milestone: true,
      title: leg.title,
      emoji: leg.emoji,
      time: leg.time || undefined,
    })
    upserts.push(flight(depart), flight(arrive), flight(ret))

    const name = place.trim()
    if (name) {
      const stayItem = (leg: Leg, verb: string): ScheduledItem => ({
        ...find(leg.id),
        id: leg.id,
        date: leg.date,
        kind: 'milestone',
        milestone: true,
        emoji: '🏠',
        title: `🏠 ${verb} — ${name}`,
        note: `${name}`,
        time: leg.time || undefined,
      })
      upserts.push(stayItem(checkin, 'Check in'), stayItem(checkout, 'Check out'))
    } else {
      // Cleared the place name → remove any existing stay events.
      if (find('stay-checkin')) remove.push('stay-checkin')
      if (find('stay-checkout')) remove.push('stay-checkout')
    }

    onSave(upserts, remove)
  }

  return (
    <Modal onClose={onClose}>
      <h3>✈️ Flights & stay</h3>
      <p style={{ color: 'var(--text-soft)', margin: '4px 0 0', fontSize: '0.9rem' }}>
        Set your travel and accommodation — they pin themselves onto the calendar and timeline.
      </p>

      <div className="leg-group-title">Flights</div>
      <DayTimeRow leg={depart} onChange={(p) => setDepart((l) => ({ ...l, ...p }))} />
      <DayTimeRow leg={arrive} onChange={(p) => setArrive((l) => ({ ...l, ...p }))} />
      <DayTimeRow leg={ret} onChange={(p) => setRet((l) => ({ ...l, ...p }))} />

      <div className="leg-group-title">Where you're staying</div>
      <div className="field">
        <label>Airbnb / hotel name (leave blank to skip)</label>
        <input value={place} onChange={(e) => setPlace(e.target.value)} placeholder="e.g. Airbnb in Jabal al-Weibdeh" />
      </div>
      {place.trim() && (
        <>
          <DayTimeRow leg={checkin} onChange={(p) => setCheckin((l) => ({ ...l, ...p }))} />
          <DayTimeRow leg={checkout} onChange={(p) => setCheckout((l) => ({ ...l, ...p }))} />
        </>
      )}

      <div className="modal-actions">
        <button className="btn ghost" onClick={onClose}>Cancel</button>
        <button className="btn" onClick={save}>Save</button>
      </div>
    </Modal>
  )
}
