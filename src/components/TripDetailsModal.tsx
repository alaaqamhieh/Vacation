import { useState } from 'react'
import Modal from './Modal'
import { tripDays, formatShort, weekdayShort } from '../dateUtils'
import { TRIP } from '../config'
import type { ScheduledItem } from '../types'

interface Props {
  /** All scheduled items, so we can prefill from existing flight/stay events. */
  scheduled: ScheduledItem[]
  /** Open with this traveler group expanded/highlighted (e.g. from a slot's edit button). */
  focusGroup?: string
  /** Upsert these items by id and delete the given ids. */
  onSave: (upserts: ScheduledItem[], remove: string[]) => void
  onClose: () => void
}

interface Traveler {
  groupId: string
  name: string
  arriveDate: string
  arriveTime: string
  departDate: string
  departTime: string
  stayName: string
  checkinDate: string
  checkinTime: string
  checkoutDate: string
  checkoutTime: string
}

const DAYS = tripDays()
const LEGACY_IDS = ['ms-arrive', 'ms-return', 'ms-depart', 'stay-checkin', 'stay-checkout']

function blankTraveler(name: string): Traveler {
  return {
    groupId: `t${Date.now()}${Math.floor(Math.random() * 1000)}`,
    name,
    arriveDate: '2026-07-24',
    arriveTime: '',
    departDate: TRIP.returnDate,
    departTime: '',
    stayName: '',
    checkinDate: '2026-07-24',
    checkinTime: '',
    checkoutDate: TRIP.returnDate,
    checkoutTime: '',
  }
}

/** Build the traveler list from existing scheduled items (new-style, else legacy flights). */
function readTravelers(scheduled: ScheduledItem[]): Traveler[] {
  const byGroup = new Map<string, Traveler>()
  const ensure = (gid: string, name: string) => {
    if (!byGroup.has(gid)) byGroup.set(gid, { ...blankTraveler(name), groupId: gid, name })
    return byGroup.get(gid)!
  }
  for (const it of scheduled) {
    if (!it.logistics || !it.groupId) continue
    const t = ensure(it.groupId, it.party ?? TRIP.travelers)
    if (it.logistics === 'arrive') { t.arriveDate = it.date; t.arriveTime = it.time ?? '' }
    if (it.logistics === 'depart') { t.departDate = it.date; t.departTime = it.time ?? '' }
    if (it.logistics === 'checkin') { t.checkinDate = it.date; t.checkinTime = it.time ?? ''; t.stayName = it.note ?? t.stayName }
    if (it.logistics === 'checkout') { t.checkoutDate = it.date; t.checkoutTime = it.time ?? ''; t.stayName = it.note ?? t.stayName }
  }
  if (byGroup.size > 0) return [...byGroup.values()]

  // Legacy fallback: convert the original single-set flights into one traveler.
  const find = (id: string) => scheduled.find((s) => s.id === id)
  const arr = find('ms-arrive') ?? find('ms-depart')
  const dep = find('ms-return')
  const ci = find('stay-checkin')
  const co = find('stay-checkout')
  if (arr || dep || ci) {
    const t = blankTraveler(TRIP.travelers)
    t.groupId = 'main'
    if (arr) { t.arriveDate = arr.date; t.arriveTime = arr.time ?? '' }
    if (dep) { t.departDate = dep.date; t.departTime = dep.time ?? '' }
    if (ci) { t.stayName = ci.note ?? ''; t.checkinDate = ci.date; t.checkinTime = ci.time ?? '' }
    if (co) { t.checkoutDate = co.date; t.checkoutTime = co.time ?? '' }
    return [t]
  }
  return [{ ...blankTraveler(TRIP.travelers), groupId: 'main' }]
}

function DateTime({ date, time, onDate, onTime }: { date: string; time: string; onDate: (v: string) => void; onTime: (v: string) => void }) {
  return (
    <div className="leg-inputs">
      <select value={date} onChange={(e) => onDate(e.target.value)}>
        {DAYS.map((d) => (
          <option key={d} value={d}>{weekdayShort(d)}, {formatShort(d)}</option>
        ))}
      </select>
      <input type="time" value={time} onChange={(e) => onTime(e.target.value)} />
    </div>
  )
}

/** Per-traveler editor for flights + lodging; each auto-pins onto the calendar. */
export default function TripDetailsModal({ scheduled, focusGroup, onSave, onClose }: Props) {
  const [travelers, setTravelers] = useState<Traveler[]>(() => readTravelers(scheduled))

  const patch = (gid: string, p: Partial<Traveler>) =>
    setTravelers((ts) => ts.map((t) => (t.groupId === gid ? { ...t, ...p } : t)))
  const addTraveler = () => setTravelers((ts) => [...ts, blankTraveler('')])
  const removeTraveler = (gid: string) => setTravelers((ts) => ts.filter((t) => t.groupId !== gid))

  const save = () => {
    const upserts: ScheduledItem[] = []
    for (const t of travelers) {
      const name = t.name.trim() || 'Travelers'
      const gid = t.groupId
      upserts.push({
        id: `trip-${gid}-arrive`, groupId: gid, party: name, logistics: 'arrive',
        kind: 'milestone', milestone: true, date: t.arriveDate, time: t.arriveTime || undefined,
        emoji: '🛬', title: `${name} — arrives`,
      })
      upserts.push({
        id: `trip-${gid}-depart`, groupId: gid, party: name, logistics: 'depart',
        kind: 'milestone', milestone: true, date: t.departDate, time: t.departTime || undefined,
        emoji: '🛫', title: `${name} — departs`,
      })
      const stay = t.stayName.trim()
      if (stay) {
        upserts.push({
          id: `trip-${gid}-checkin`, groupId: gid, party: name, logistics: 'checkin',
          kind: 'milestone', milestone: true, date: t.checkinDate, time: t.checkinTime || undefined,
          emoji: '🏠', title: `${name} — check in (${stay})`, note: stay,
        })
        upserts.push({
          id: `trip-${gid}-checkout`, groupId: gid, party: name, logistics: 'checkout',
          kind: 'milestone', milestone: true, date: t.checkoutDate, time: t.checkoutTime || undefined,
          emoji: '🏠', title: `${name} — check out (${stay})`, note: stay,
        })
      }
    }
    // Remove any prior logistics/legacy items that we're not re-writing (deleted travelers, removed stays).
    const keep = new Set(upserts.map((u) => u.id))
    const remove = scheduled
      .filter((s) => s.logistics || LEGACY_IDS.includes(s.id))
      .map((s) => s.id)
      .filter((id) => !keep.has(id))

    onSave(upserts, remove)
  }

  return (
    <Modal onClose={onClose}>
      <h3>✈️ Flights & stay</h3>
      <p style={{ color: 'var(--text-soft)', margin: '4px 0 0', fontSize: '0.9rem' }}>
        Add each traveler or group — their flights and lodging pin themselves onto the calendar, labeled with the name.
      </p>

      {travelers.map((t) => (
        <div key={t.groupId} className={`traveler-card${t.groupId === focusGroup ? ' focus' : ''}`}>
          <div className="traveler-head">
            <input
              className="traveler-name"
              value={t.name}
              onChange={(e) => patch(t.groupId, { name: e.target.value })}
              placeholder="Whose trip? e.g. Alaa & Bissan"
            />
            {travelers.length > 1 && (
              <button className="mini-btn" onClick={() => removeTraveler(t.groupId)} aria-label="Remove traveler">🗑</button>
            )}
          </div>
          <div className="leg-row">
            <div className="leg-head">🛬 Arrives</div>
            <DateTime date={t.arriveDate} time={t.arriveTime} onDate={(v) => patch(t.groupId, { arriveDate: v })} onTime={(v) => patch(t.groupId, { arriveTime: v })} />
          </div>
          <div className="leg-row">
            <div className="leg-head">🛫 Departs</div>
            <DateTime date={t.departDate} time={t.departTime} onDate={(v) => patch(t.groupId, { departDate: v })} onTime={(v) => patch(t.groupId, { departTime: v })} />
          </div>
          <input
            className="traveler-stay"
            value={t.stayName}
            onChange={(e) => patch(t.groupId, { stayName: e.target.value })}
            placeholder="🏠 Airbnb / hotel (optional)"
          />
          {t.stayName.trim() && (
            <>
              <div className="leg-row">
                <div className="leg-head">Check-in</div>
                <DateTime date={t.checkinDate} time={t.checkinTime} onDate={(v) => patch(t.groupId, { checkinDate: v })} onTime={(v) => patch(t.groupId, { checkinTime: v })} />
              </div>
              <div className="leg-row">
                <div className="leg-head">Check-out</div>
                <DateTime date={t.checkoutDate} time={t.checkoutTime} onDate={(v) => patch(t.groupId, { checkoutDate: v })} onTime={(v) => patch(t.groupId, { checkoutTime: v })} />
              </div>
            </>
          )}
        </div>
      ))}

      <button className="btn ghost" onClick={addTraveler} style={{ marginTop: 12 }}>➕ Add another traveler</button>

      <div className="modal-actions">
        <button className="btn ghost" onClick={onClose}>Cancel</button>
        <button className="btn" onClick={save}>Save</button>
      </div>
    </Modal>
  )
}
