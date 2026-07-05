import { useMemo, useState, type DragEvent } from 'react'
import type { Activity, Category, Region } from '../types'
import { CATEGORY_META, REGION_META } from '../types'
import { useReveal } from '../useReveal'
import { mapsUrl } from '../mapUtils'
import Stars from './Stars'
import type { AddTarget } from './AddToDayModal'

interface Props {
  activities: Activity[]
  scheduledIds: Set<string>
  onPlan: (target: AddTarget) => void
  onAddCustom: () => void
  onDeleteCustom: (id: string) => void
}

export default function ActivityLibrary(props: Props) {
  const { activities, scheduledIds } = props
  const [category, setCategory] = useState<Category | 'all'>('all')
  const [region, setRegion] = useState<Region | 'all'>('all')
  const [topOnly, setTopOnly] = useState(false)
  const [query, setQuery] = useState('')
  const ref = useReveal<HTMLElement>()

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return activities
      .filter((a) => {
        if (topOnly && (a.popularity ?? 3) < 4) return false
        if (category !== 'all' && a.category !== category) return false
        if (region !== 'all' && a.region !== region) return false
        if (!q) return true
        return [a.title, a.description, REGION_META[a.region].label].join(' ').toLowerCase().includes(q)
      })
      .sort((a, b) => (b.popularity ?? 3) - (a.popularity ?? 3) || a.title.localeCompare(b.title))
  }, [activities, category, region, topOnly, query])

  const dragStart = (e: DragEvent, a: Activity) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({ type: 'add', kind: 'activity', refId: a.id }))
    e.dataTransfer.effectAllowed = 'copy'
    e.currentTarget.classList.add('dragging')
  }

  return (
    <section id="activities" ref={ref} className="reveal">
      <div className="container">
        <div className="section-head">
          <div className="section-kicker">Beyond the wedding</div>
          <h2 className="section-title">🏜️ Things to do, all over Jordan</h2>
          <p className="section-sub">
            From the Citadel down the street to Petra, Wadi Rum, and the Dead Sea — filter by type or region, then
            drag onto the plan.
          </p>
        </div>

        <div className="chip-row" role="group" aria-label="Filter by category">
          <button className={`chip${topOnly ? ' on' : ''}`} onClick={() => setTopOnly((v) => !v)}>⭐ Top rated</button>
          <button className={`chip${category === 'all' ? ' on' : ''}`} onClick={() => setCategory('all')}>All types</button>
          {(Object.keys(CATEGORY_META) as Category[]).map((c) => (
            <button key={c} className={`chip${category === c ? ' on' : ''}`} onClick={() => setCategory(c)}>
              {CATEGORY_META[c].emoji} {CATEGORY_META[c].label}
            </button>
          ))}
        </div>
        <div className="chip-row" role="group" aria-label="Filter by region">
          <button className={`chip${region === 'all' ? ' on' : ''}`} onClick={() => setRegion('all')}>All regions</button>
          {(Object.keys(REGION_META) as Region[]).map((r) => (
            <button key={r} className={`chip${region === r ? ' on' : ''}`} onClick={() => setRegion(r)}>
              {REGION_META[r].emoji} {REGION_META[r].label}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', marginBottom: 18 }}>
          <input
            className="search-input"
            placeholder="Search: Petra, mosaic, snorkel…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search activities"
          />
          <button className="btn ghost" onClick={props.onAddCustom}>➕ Add an idea</button>
        </div>

        <div className="card-grid">
          {filtered.map((a) => (
            <article
              key={a.id}
              className="card"
              style={{ ['--card-accent' as string]: `var(--cat-${a.category})` }}
              draggable
              onDragStart={(e) => dragStart(e, a)}
              onDragEnd={(e) => e.currentTarget.classList.remove('dragging')}
            >
              <div className="card-top">
                <span className="card-emoji" aria-hidden="true">{a.emoji}</span>
                <div>
                  <div className="card-title">{a.title}</div>
                  <div className="card-meta">
                    {REGION_META[a.region].emoji} {REGION_META[a.region].label} · ⏱ {a.duration}
                  </div>
                  <Stars value={a.popularity} />
                </div>
              </div>
              <p className="card-desc">{a.description}</p>
              <div className="card-actions">
                {a.familyPick && <span className="tag family-tag">👨‍👩‍👧 Family pick</span>}
                <span className="tag">{CATEGORY_META[a.category].emoji} {CATEGORY_META[a.category].label}</span>
                {scheduledIds.has(a.id) && <span className="tag" style={{ ['--card-accent' as string]: 'var(--cat-milestone)' }}>🗓️ planned</span>}
              </div>
              <div className="card-actions">
                <button className="mini-btn primary" onClick={() => props.onPlan({ kind: 'activity', refId: a.id, title: a.title, emoji: a.emoji })}>
                  ➕ Plan
                </button>
                <a className="mini-btn" href={mapsUrl(a.title, REGION_META[a.region].label)} target="_blank" rel="noreferrer">📍 Map</a>
                {a.custom && (
                  <button className="mini-btn" onClick={() => props.onDeleteCustom(a.id)} aria-label={`Delete ${a.title}`}>🗑</button>
                )}
              </div>
            </article>
          ))}
          {filtered.length === 0 && (
            <p style={{ color: 'var(--text-soft)', fontStyle: 'italic' }}>No matches — try clearing a filter.</p>
          )}
        </div>
      </div>
    </section>
  )
}
