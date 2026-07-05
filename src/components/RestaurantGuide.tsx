import { useMemo, useState, type DragEvent, type MouseEvent } from 'react'
import type { Restaurant } from '../types'
import { REGION_META } from '../types'
import { useReveal } from '../useReveal'
import { mapsUrl } from '../mapUtils'
import Stars from './Stars'
import type { AddTarget } from './AddToDayModal'

interface Props {
  restaurants: Restaurant[]
  shortlist: string[]
  visited: string[]
  scheduledIds: Set<string>
  onToggleShortlist: (id: string) => void
  onToggleVisited: (id: string, el: Element | null) => void
  onPlan: (target: AddTarget) => void
  onAddCustom: () => void
  onDeleteCustom: (id: string) => void
}

type Filter = 'all' | 'top' | 'family' | 'shortlist' | 'orderin' | 'cheap' | 'fancy'

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'top', label: '⭐ Top rated' },
  { id: 'family', label: '👨‍👩‍👧 Family picks' },
  { id: 'shortlist', label: '❤️ Our shortlist' },
  { id: 'orderin', label: '🛵 Order-in friendly' },
  { id: 'cheap', label: 'JD — cheap eats' },
  { id: 'fancy', label: 'JD JD JD — big nights' },
]

export default function RestaurantGuide(props: Props) {
  const { restaurants, shortlist, visited, scheduledIds } = props
  const [filter, setFilter] = useState<Filter>('all')
  const [query, setQuery] = useState('')
  const ref = useReveal<HTMLElement>()

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return restaurants
      .filter((r) => {
        if (filter === 'top' && (r.popularity ?? 3) < 4) return false
        if (filter === 'family' && !r.familyPick) return false
        if (filter === 'shortlist' && !shortlist.includes(r.id)) return false
        if (filter === 'orderin' && !r.orderIn) return false
        if (filter === 'cheap' && r.price !== 1) return false
        if (filter === 'fancy' && r.price !== 3) return false
        if (!q) return true
        return [r.name, r.cuisine, r.neighborhood, r.signature, r.description].join(' ').toLowerCase().includes(q)
      })
      .sort((a, b) => (b.popularity ?? 3) - (a.popularity ?? 3) || a.name.localeCompare(b.name))
  }, [restaurants, filter, query, shortlist])

  const dragStart = (e: DragEvent, r: Restaurant) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({ type: 'add', kind: 'restaurant', refId: r.id }))
    e.dataTransfer.effectAllowed = 'copy'
    e.currentTarget.classList.add('dragging')
  }

  const visitedClick = (e: MouseEvent, id: string) => {
    props.onToggleVisited(id, e.currentTarget)
  }

  return (
    <section id="food" ref={ref} className="reveal">
      <div className="container">
        <div className="section-head">
          <div className="section-kicker">The real reason we're excited</div>
          <h2 className="section-title">🍽️ The food list</h2>
          <p className="section-sub">
            No cooking this trip — it's all eating out and ordering in. ❤️ the ones we have to hit, check them off as
            we go, and drag any of them onto a day for lunch or dinner.
          </p>
        </div>

        <div className="chip-row">
          {FILTERS.map((f) => (
            <button key={f.id} className={`chip${filter === f.id ? ' on' : ''}`} onClick={() => setFilter(f.id)}>
              {f.label}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', marginBottom: 18 }}>
          <input
            className="search-input"
            placeholder="Search: knafeh, mansaf, rooftop…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search restaurants"
          />
          <button className="btn ghost" onClick={props.onAddCustom}>➕ Add a spot</button>
          <span style={{ color: 'var(--text-soft)', fontSize: '0.85rem', fontWeight: 600 }}>
            {visited.length} of {restaurants.length} tried · {shortlist.length} shortlisted
          </span>
        </div>

        <div className="card-grid">
          {filtered.map((r) => (
            <article
              key={r.id}
              className="card"
              style={{ ['--card-accent' as string]: 'var(--cat-food)' }}
              draggable
              onDragStart={(e) => dragStart(e, r)}
              onDragEnd={(e) => e.currentTarget.classList.remove('dragging')}
            >
              {visited.includes(r.id) && <span className="visited-badge">✓ Tried it</span>}
              <div className="card-top">
                <span className="card-emoji" aria-hidden="true">{r.emoji}</span>
                <div>
                  <div className="card-title">{r.name}</div>
                  <div className="card-meta">
                    {r.cuisine} · {r.neighborhood} · <span className="price-dots">{'JD '.repeat(r.price).trim()}</span>
                  </div>
                  <Stars value={r.popularity} />
                </div>
              </div>
              <p className="card-desc">
                <strong>{r.signature}.</strong> {r.description}
              </p>
              <div className="card-actions">
                {r.familyPick && <span className="tag family-tag">👨‍👩‍👧 Family pick</span>}
                <span className="tag">{r.vibe}</span>
                {r.orderIn && <span className="tag" style={{ ['--card-accent' as string]: 'var(--cat-nature)' }}>🛵 delivers</span>}
                {r.region !== 'amman' && (
                  <span className="tag" style={{ ['--card-accent' as string]: 'var(--cat-daytrip)' }}>
                    {REGION_META[r.region].emoji} {REGION_META[r.region].label}
                  </span>
                )}
              </div>
              <div className="card-actions">
                <button
                  className={`heart-btn${shortlist.includes(r.id) ? ' on' : ''}`}
                  onClick={() => props.onToggleShortlist(r.id)}
                  aria-label={shortlist.includes(r.id) ? 'Remove from shortlist' : 'Add to shortlist'}
                  title="Shortlist"
                >
                  ❤️
                </button>
                <button className="mini-btn primary" onClick={() => props.onPlan({ kind: 'restaurant', refId: r.id, title: r.name, emoji: r.emoji })}>
                  ➕ Plan
                </button>
                <button className="mini-btn" onClick={(e) => visitedClick(e, r.id)}>
                  {visited.includes(r.id) ? '↩︎ Untried' : '✓ Tried it'}
                </button>
                <a className="mini-btn" href={mapsUrl(r.name, r.neighborhood)} target="_blank" rel="noreferrer">📍 Map</a>
                {scheduledIds.has(r.id) && <span className="tag" style={{ ['--card-accent' as string]: 'var(--cat-milestone)' }}>🗓️ planned</span>}
                {r.custom && (
                  <button className="mini-btn" onClick={() => props.onDeleteCustom(r.id)} aria-label={`Delete ${r.name}`}>🗑</button>
                )}
              </div>
            </article>
          ))}
          {filtered.length === 0 && (
            <p style={{ color: 'var(--text-soft)', fontStyle: 'italic' }}>Nothing matches — loosen the filters, habibi.</p>
          )}
        </div>
      </div>
    </section>
  )
}
