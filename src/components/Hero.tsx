import Countdown from './Countdown'
import { TRIP } from '../config'
import { daysUntil, formatShort } from '../dateUtils'

interface Props {
  theme: 'light' | 'dark' | 'auto'
  onToggleTheme: () => void
}

export default function Hero({ theme, onToggleTheme }: Props) {
  const weddingDays = daysUntil(TRIP.weddingDate)
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
        <h1 className="hero-title">{TRIP.destination.split(',')[0]} 2026</h1>
        <p className="hero-names">{TRIP.travelers} · {TRIP.destination}</p>
        <p className="hero-dates">{formatShort(TRIP.startDate)} — {formatShort(TRIP.endDate)}, 2026</p>
        <Countdown />
        <div>
          <span className="wedding-chip">
            💍 {TRIP.weddingLabel} · {formatShort(TRIP.weddingDate)}
            {weddingDays > 0 ? ` · ${weddingDays} days to go` : ' · Today!'}
          </span>
        </div>
      </div>
    </header>
  )
}
