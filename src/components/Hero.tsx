import Countdown from './Countdown'
import { TRIP } from '../config'
import { formatShort } from '../dateUtils'

interface Props {
  theme: 'light' | 'dark' | 'auto'
  onToggleTheme: () => void
}

export default function Hero({ theme, onToggleTheme }: Props) {
  const themeIcon = theme === 'dark' ? '🌙' : theme === 'light' ? '☀️' : '🌗'

  return (
    <header className="hero">
      <div className="hero-pattern" aria-hidden="true" />
      <div className="topbar">
        <button className="icon-btn" onClick={onToggleTheme} title={`Theme: ${theme}`} aria-label="Toggle color theme">
          {themeIcon}
        </button>
      </div>
      <div className="container hero-inner hero-stagger">
        <p className="hero-kicker">{TRIP.heroKicker}</p>
        <h1 className="hero-title">{TRIP.couple} 💍</h1>
        <p className="hero-names">Wedding — {TRIP.destination} · {formatShort(TRIP.weddingDate)}, 2026</p>
        <p className="hero-dates">Trip itinerary: {formatShort(TRIP.startDate)} — {formatShort(TRIP.endDate)}, 2026</p>
        <Countdown target={TRIP.weddingDate} label="until the wedding" />
        <div>
          <span className="wedding-chip">
            ✈️ Trip itinerary · {formatShort(TRIP.startDate)} – {formatShort(TRIP.endDate)}, 2026
          </span>
        </div>
      </div>
    </header>
  )
}
