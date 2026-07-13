import { useEffect, useState } from 'react'
import { TRIP } from '../config'

interface Props {
  theme: 'light' | 'dark' | 'auto'
  onToggleTheme: () => void
}

const LINKS = [
  { href: '#itinerary', label: 'Plan' },
  { href: '#food', label: 'Food' },
  { href: '#activities', label: 'Do' },
  { href: '#map', label: 'Map' },
  { href: '#packing', label: 'Packing' },
]

/** Slim top bar that slides in once you scroll past the hero. */
export default function StickyNav({ theme, onToggleTheme }: Props) {
  const [shown, setShown] = useState(false)
  const themeIcon = theme === 'dark' ? '🌙' : theme === 'light' ? '☀️' : '🌗'

  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > 420)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className={`stickynav${shown ? ' shown' : ''}`}>
      <div className="stickynav-inner">
        <a href="#top" className="stickynav-brand">{TRIP.couple} 💍</a>
        <nav className="stickynav-links">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href}>{l.label}</a>
          ))}
        </nav>
        <div className="stickynav-right">
          <button className="icon-btn" onClick={onToggleTheme} title={`Theme: ${theme}`} aria-label="Toggle color theme">
            {themeIcon}
          </button>
        </div>
      </div>
    </div>
  )
}
