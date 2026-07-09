import { useState } from 'react'
import Modal from './Modal'
import { tripDays, formatShort, weekdayShort } from '../dateUtils'
import { TRIP } from '../config'
import type { ScheduledItem } from '../types'

interface Props {
  /** All scheduled items, so we can prefill from existing flight/stay events. */
  scheduled: ScheduledItem[]
  /** Open with this group expanded/highlighted (e.g. from a slot's edit button). */
  focusGroup?: string
  /** Upsert these items by id and delete the given ids. */
  onSave: (upserts: ScheduledItem[], remove: string[]) => void
  onClose: () => void
}

/** A flight entry: who is travelling + their arrive/depart legs. */
interface Flight {
  groupId: string
  name: string
  arriveDate: string
  arriveTime: string
  departDate: string
  departTime: string
}

/** A stay entry: a place, who it's for (optional), and check-in/out. Independent of flights. */
interface Stay {
  groupId: string
  place: string
  who: string
  checkinDate: string
  checkinTime: string
  checkoutDate: string
  checkoutTime: string
}

const DAYS = tripDays()
const LEGACY_IDS = ['ms-arrive', 'ms-return', 'ms-depart', 'stay-checkin', 'stay-checkout']
const rid = (p: string) => `${p}${Date.now()}${Math.floor(Math.random() * 1000)}`

function blankFlight(name: string): Flight {
  return {
    groupId: rid('f'),
    name,
    arriveDate: TRIP.departDate,
    arriveTime: '',
    departDate: TRIP.returnDate,
    departTime: '',
  }
}

function blankStay(who: string): Stay {
  return {
    groupId: rid('s'),
    place: '',
    who,
    checkinDate: TRIP.departDate,
    checkinTime: '',
    checkoutDate: TRIP.returnDate,
    checkoutTime: '',
  }
}

/** Build the flight list from existing scheduled items (new-style, else legacy flights). */
function readFlights(scheduled: ScheduledItem[]): Flight[] {
  const byGroup = new Map<string, Flight>()
  const ensure = (gid: string, name: string) => {
    if (!byGroup.has(gid)) byGroup.set(gid, { ...blankFlight(name), groupId: gid, name })
    return byGroup.get(gid)!
  }
  for (const it of scheduled) {
    if (!it.groupId) continue
    if (it.logistics === 'arrive') { const f = ensure(it.groupId, it.party ?? TRIP.travelers); f.arriveDate = it.date; f.arriveTime = it.time ?? '' }
    if (it.logistics === 'depart') { const f = ensure(it.groupId, it.party ?? TRIP.travelers); f.departDate = it.date; f.departTime = it.time ?? '' }
  }
  if (byGroup.size > 0) return [...byGroup.values()]

  // Legacy fallback: original single-set flights → one traveler.
  const find = (id: string) => scheduled.find((s) => s.id === id)
  const arr = find('ms-arrive') ?? find('ms-depart')
  const dep = find('ms-return')
  if (arr || dep) {
    const f = { ...blankFlight(TRIP.travelers), groupId: 'main' }
    if (arr) { f.arriveDate = arr.date; f.arriveTime = arr.time ?? '' }
    if (dep) { f.departDate = dep.date; f.departTime = dep.time ?? '' }
    return [f]
  }
  return [{ ...blankFlight(TRIP.travelers), groupId: 'main' }]
}

/** Build the stay list from existing scheduled items (new-style, else legacy stay). */
function readStays(scheduled: ScheduledItem[]): Stay[] {
  const byGroup = new Map<string, Stay>()
  const ensure = (gid: string, who: string) => {
    if (!byGroup.has(gid)) byGroup.set(gid, { ...blankStay(who), groupId: gid })
    return byGroup.get(gid)!
  }
  for (const it of scheduled) {
    if (!it.groupId) continue
    if (it.logistics === 'checkin') { const s = ensure(it.groupId, it.party ?? ''); s.place = it.note ?? s.place; s.who = it.party ?? s.who; s.checkinDate = it.date; s.checkinTime = it.time ?? '' }
    if (it.logistics === 'checkout') { const s = ensure(it.groupId, it.party ?? ''); s.place = it.note ?? s.place; s.who = it.party ?? s.who; s.checkoutDate = it.date; s.checkoutTime = it.time ?? '' }
  }
  if (byGroup.size > 0) return [...byGroup.values()]

  // Legacy fallback: original single stay.
  const find = (id: string) => scheduled.find((s) => s.id === id)
  const ci = find('stay-checkin')
  const co = find('stay-checkout')
  if (ci || co) {
    const s = { ...blankStay(''), groupId: 'main' }
    if (ci) { s.place = ci.note ?? ci.title ?? ''; s.checkinDate = ci.date; s.checkinTime = ci.time ?? '' }
    if (co) { s.checkoutDate = co.date; s.checkoutTime = co.time ?? '' }
    return [s]
  }
  return []
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

/** Editor for flights + lodging as two independent lists; each auto-pins onto the calendar. */
export default function TripDetailsModal({ scheduled, focusGroup, onSave, onClose }: Props) {
  const [flights, setFlights] = useState<Flight[]>(() => readFlights(scheduled))
  const [stays, setStays] = useState<Stay[]>(() => readStays(scheduled))

  const patchFlight = (gid: string, p: Partial<Flight>) =>
    setFlights((fs) => fs.map((f) => (f.groupId === gid ? { ...f, ...p } : f)))
  const patchStay = (gid: string, p: Partial<Stay>) =>
    setStays((ss) => ss.map((s) => (s.groupId === gid ? { ...s, ...p } : s)))

  const save = () => {
    const upserts: ScheduledItem[] = []
    for (const f of flights) {
      const name = f.name.trim() || 'Travelers'
      const gid = f.groupId
      upserts.push({
        id: `trip-${gid}-arrive`, groupId: gid, party: name, logistics: 'arrive',
        kind: 'milestone', milestone: true, date: f.arriveDate, time: f.arriveTime || undefined,
        emoji: '🛬', title: `${name} — arrives`,
      })
      upserts.push({
        id: `trip-${gid}-depart`, groupId: gid, party: name, logistics: 'depart',
        kind: 'milestone', milestone: true, date: f.departDate, time: f.departTime || undefined,
        emoji: '🛫', title: `${name} — departs`,
      })
    }
    for (const s of stays) {
      const place = s.place.trim()
      if (!place) continue // a stay with no place name isn't anything yet
      const who = s.who.trim()
      const gid = s.groupId
      const label = who ? `${who} — ` : ''
      upserts.push({
        id: `stay-${gid}-checkin`, groupId: gid, party: who || undefined, logistics: 'checkin',
        kind: 'milestone', milestone: true, date: s.checkinDate, time: s.checkinTime || undefined,
        emoji: '🏠', title: `${label}check in (${place})`, note: place,
      })
      upserts.push({
        id: `stay-${gid}-checkout`, groupId: gid, party: who || undefined, logistics: 'checkout',
        kind: 'milestone', milestone: true, date: s.checkoutDate, time: s.checkoutTime || undefined,
        emoji: '🧳', title: `${label}check out (${place})`, note: place,
      })
    }
    // Remove any prior logistics/legacy items we're not re-writing (deleted flights/stays).
    const keep = new Set(upserts.map((u) => u.id))
    const remove = scheduled
      .filter((s) => s.logistics || LEGACY_IDS.includes(s.id))
      .map((s) => s.id)
      .filter((id) => !keep.has(id))

    onSave(upserts, remove)
  }

  return (
    <Modal onClose={onClose}>
      <div className="modal-scroll">
        <h3>✈️ Flights &amp; stay</h3>
        <p className="modal-intro">
          Add flights and places to stay separately — each one pins itself onto the calendar and timeline, labeled with the name.
        </p>

        <div className="leg-group-title">Flights</div>
        {flights.map((f) => (
          <div key={f.groupId} className={`traveler-card${f.groupId === focusGroup ? ' focus' : ''}`}>
            <div className="traveler-head">
              <span className="card-badge">🛫</span>
              <input
                className="traveler-name"
                value={f.name}
                onChange={(e) => patchFlight(f.groupId, { name: e.target.value })}
                placeholder="Whose flight? e.g. Alaa & Bissan"
              />
              <button className="mini-btn" onClick={() => setFlights((fs) => fs.filter((x) => x.groupId !== f.groupId))} aria-label="Remove flight">🗑</button>
            </div>
            <div className="leg-row">
              <div className="leg-head">🛬 Arrives</div>
              <DateTime date={f.arriveDate} time={f.arriveTime} onDate={(v) => patchFlight(f.groupId, { arriveDate: v })} onTime={(v) => patchFlight(f.groupId, { arriveTime: v })} />
            </div>
            <div className="leg-row">
              <div className="leg-head">🛫 Departs</div>
              <DateTime date={f.departDate} time={f.departTime} onDate={(v) => patchFlight(f.groupId, { departDate: v })} onTime={(v) => patchFlight(f.groupId, { departTime: v })} />
            </div>
          </div>
        ))}
        <button className="btn ghost full" onClick={() => setFlights((fs) => [...fs, blankFlight('')])}>➕ Add flight</button>

        <div className="leg-group-title">Where you're staying</div>
        {stays.map((s) => (
          <div key={s.groupId} className={`traveler-card${s.groupId === focusGroup ? ' focus' : ''}`}>
            <div className="traveler-head">
              <span className="card-badge">🏠</span>
              <input
                className="traveler-name"
                value={s.place}
                onChange={(e) => patchStay(s.groupId, { place: e.target.value })}
                placeholder="Airbnb / hotel name"
              />
              <button className="mini-btn" onClick={() => setStays((ss) => ss.filter((x) => x.groupId !== s.groupId))} aria-label="Remove stay">🗑</button>
            </div>
            <input
              className="traveler-stay"
              value={s.who}
              onChange={(e) => patchStay(s.groupId, { who: e.target.value })}
              placeholder="Who's it for? e.g. Everyone (optional)"
            />
            <div className="leg-row">
              <div className="leg-head">🔑 Check-in</div>
              <DateTime date={s.checkinDate} time={s.checkinTime} onDate={(v) => patchStay(s.groupId, { checkinDate: v })} onTime={(v) => patchStay(s.groupId, { checkinTime: v })} />
            </div>
            <div className="leg-row">
              <div className="leg-head">🧳 Check-out</div>
              <DateTime date={s.checkoutDate} time={s.checkoutTime} onDate={(v) => patchStay(s.groupId, { checkoutDate: v })} onTime={(v) => patchStay(s.groupId, { checkoutTime: v })} />
            </div>
          </div>
        ))}
        <button className="btn ghost full" onClick={() => setStays((ss) => [...ss, blankStay('')])}>➕ Add stay</button>
      </div>

      <div className="modal-actions sticky">
        <button className="btn ghost" onClick={onClose}>Cancel</button>
        <button className="btn" onClick={save}>Save</button>
      </div>
    </Modal>
  )
}
