import type { MouseEvent } from 'react'
import { PACKING_SEED } from '../data'
import { useReveal } from '../useReveal'
import { burstFromElement } from '../confetti'

interface Props {
  packed: string[]
  onToggle: (id: string) => void
}

export default function Packing({ packed, onToggle }: Props) {
  const ref = useReveal<HTMLElement>()
  const pct = Math.round((packed.length / PACKING_SEED.length) * 100)

  const toggle = (e: MouseEvent<HTMLLIElement>, id: string, wasPacked: boolean) => {
    onToggle(id)
    if (!wasPacked && packed.length + 1 === PACKING_SEED.length) {
      burstFromElement(e.currentTarget)
    }
  }

  return (
    <section id="packing" ref={ref} className="reveal">
      <div className="container">
        <div className="section-head">
          <div className="section-kicker">Before we go</div>
          <h2 className="section-title">🧳 Packing checklist</h2>
          <p className="section-sub">{pct === 100 ? 'All packed — yalla, to the airport! 🎉' : `${pct}% packed`}</p>
        </div>
        <div className="progress-track" aria-hidden="true">
          <div className="progress-fill" style={{ width: `${pct}%` }} />
        </div>
        <ul className="pack-list">
          {PACKING_SEED.map((item) => {
            const done = packed.includes(item.id)
            return (
              <li key={item.id} className={`pack-item${done ? ' done' : ''}`} onClick={(e) => toggle(e, item.id, done)}>
                <input type="checkbox" checked={done} readOnly tabIndex={-1} />
                {item.label}
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
