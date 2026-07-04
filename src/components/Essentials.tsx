import { ESSENTIALS } from '../data'
import { useReveal } from '../useReveal'

export default function Essentials() {
  const ref = useReveal<HTMLElement>()
  return (
    <section id="essentials" ref={ref} className="reveal">
      <div className="container">
        <div className="section-head">
          <div className="section-kicker">Good to know</div>
          <h2 className="section-title">🧭 Trip essentials</h2>
        </div>
        <div className="ess-grid">
          {ESSENTIALS.map((e) => (
            <div key={e.title} className="ess-card">
              <span className="emoji" aria-hidden="true">{e.emoji}</span>
              <h3>{e.title}</h3>
              <p>{e.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
