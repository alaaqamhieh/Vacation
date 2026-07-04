import { useState, type DragEvent } from 'react'
import type { Activity, Restaurant, ScheduledItem } from '../types'
import { tripDays, formatShort, weekdayShort, tripDayNumber } from '../dateUtils'
import { TRIP } from '../config'
import { useReveal } from '../useReveal'

export type DragPayload = { type: 'add'; kind: 'activity' | 'restaurant'; refId: string } | { type: 'move'; id: string }

interface Props {
  scheduled: ScheduledItem[]
  activities: Activity[]
  restaurants: Restaurant[]
  lastAddedId: string | null
  onDropPayload: (payload: DragPayload, date: string) => void
  onEdit: (item: ScheduledItem) => void
  onRemove: (item: ScheduledItem) => void
  onToggleMeal: (id: string) => void
  onExport: () => void
  onAddEvent: () => void
}

interface Resolved {
  title: string
  emoji: string
  accent: string
  meal?: 'lunch' | 'dinner'
}

function resolve(item: ScheduledItem, activities: Activity[], restaurants: Restaurant[]): Resolved {
  if (item.kind === 'activity' && item.refId) {
    const a = activities.find((x) => x.id === item.refId)
    if (a) return { title: a.title, emoji: a.emoji, accent: `var(--cat-${a.category})` }
  }
  if (item.kind === 'restaurant' && item.refId) {
    const r = restaurants.find((x) => x.id === item.refId)
    if (r) return { title: r.name, emoji: r.emoji, accent: 'var(--cat-food)', meal: item.meal }
  }
  return {
    title: item.title ?? 'Event',
    emoji: item.emoji ?? '📌',
    accent: item.milestone ? 'var(--cat-milestone)' : 'var(--cat-relax)',
  }
}

function readPayload(e: DragEvent): DragPayload | null {
  try {
    return JSON.parse(e.dataTransfer.getData('text/plain')) as DragPayload
  } catch {
    return null
  }
}

export default function Itinerary(props: Props) {
  const { scheduled, activities, restaurants, lastAddedId } = props
  const [view, setView] = useState<'timeline' | 'calendar'>('timeline')
  const [dragOver, setDragOver] = useState<string | null>(null)
  const ref = useReveal<HTMLElement>()

  const days = tripDays()
  const byDay = (day: string) =>
    scheduled
      .filter((s) => s.date === day)
      .sort((a, b) => Number(b.milestone ?? false) - Number(a.milestone ?? false) || (a.meal === 'lunch' ? -1 : 0))

  const handleDrop = (e: DragEvent, day: string) => {
    e.preventDefault()
    setDragOver(null)
    const payload = readPayload(e)
    if (payload) props.onDropPayload(payload, day)
  }

  const slot = (item: ScheduledItem) => {
    const r = resolve(item, activities, restaurants)
    return (
      <div
        key={item.id}
        className={`slot${item.milestone ? ' milestone' : ''}${item.id === lastAddedId ? ' landed' : ''}`}
        style={{ ['--slot-accent' as string]: r.accent }}
        title={item.note ?? r.title}
        draggable={!item.milestone}
        onDragStart={(e) => {
          e.dataTransfer.setData('text/plain', JSON.stringify({ type: 'move', id: item.id } satisfies DragPayload))
          e.dataTransfer.effectAllowed = 'move'
        }}
      >
        <span aria-hidden="true">{r.emoji}</span>
        <span className="slot-title">{r.title}</span>
        {r.meal && (
          <button
            className="slot-meal"
            style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 0 }}
            onClick={() => props.onToggleMeal(item.id)}
            title="Switch lunch/dinner"
          >
            {r.meal}
          </button>
        )}
        <button className="slot-x slot-edit" onClick={() => props.onEdit(item)} aria-label={`Edit ${r.title}`} title="Edit">
          ✎
        </button>
        <button className="slot-x" onClick={() => props.onRemove(item)} aria-label={`Remove ${r.title}`} title="Remove">
          ✕
        </button>
      </div>
    )
  }

  const dayDropProps = (day: string) => ({
    onDragOver: (e: DragEvent) => {
      e.preventDefault()
      setDragOver(day)
    },
    onDragLeave: () => setDragOver((d) => (d === day ? null : d)),
    onDrop: (e: DragEvent) => handleDrop(e, day),
  })

  return (
    <section id="itinerary" ref={ref} className="reveal">
      <div className="container">
        <div className="section-head">
          <div className="section-kicker">The plan</div>
          <h2 className="section-title">Our 13 days, day by day</h2>
          <p className="section-sub">
            Drag anything from the food guide or activity library onto a day — or use the ➕ Plan button on any card.
            The pinned gold events are the ones we can't miss.
          </p>
        </div>

        <div className="itinerary-bar">
          <div className="view-toggle" role="tablist">
            <button className={view === 'timeline' ? 'on' : ''} onClick={() => setView('timeline')}>
              📜 Timeline
            </button>
            <button className={view === 'calendar' ? 'on' : ''} onClick={() => setView('calendar')}>
              🗓️ Calendar
            </button>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button className="btn ghost" onClick={props.onAddEvent}>➕ Add event</button>
            <button className="btn" onClick={props.onExport}>📆 Export .ics</button>
          </div>
        </div>

        {view === 'calendar' ? (
          <div className="cal-grid">
            {days.map((day) => (
              <div key={day} className={`day-cell${dragOver === day ? ' drag-over' : ''}`} {...dayDropProps(day)}>
                <div className="day-head">
                  <span className="day-num">Day {tripDayNumber(day)}</span>
                  <span className="day-date">{formatShort(day)}</span>
                  <span className="day-wk">{weekdayShort(day)}</span>
                </div>
                {byDay(day).map(slot)}
                {byDay(day).length === 0 && <div className="empty-hint">Drop something fun here</div>}
              </div>
            ))}
          </div>
        ) : (
          <div className="timeline">
            {days.map((day) => (
              <div key={day} className={`tl-day${day === TRIP.weddingDate ? ' wedding' : ''}`}>
                <span className="tl-dot" aria-hidden="true" />
                <div className="tl-date">
                  <span>
                    {weekdayShort(day)}, {formatShort(day)}
                  </span>
                  <span className="day-num">Day {tripDayNumber(day)}</span>
                  {day === TRIP.weddingDate && <span className="tag" style={{ ['--card-accent' as string]: 'var(--cat-milestone)' }}>💍 Wedding day</span>}
                </div>
                <div
                  className={`tl-items day-cell${dragOver === day ? ' drag-over' : ''}`}
                  style={{ minHeight: 46, boxShadow: 'none', background: 'transparent', padding: 0 }}
                  {...dayDropProps(day)}
                >
                  {byDay(day).map(slot)}
                  {byDay(day).length === 0 && <div className="empty-hint" style={{ textAlign: 'left' }}>Free day — for now…</div>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
