import { useEffect, useRef, useState } from 'react'
import { parseISO } from '../dateUtils'

interface Parts {
  days: number
  hours: number
  mins: number
  done: boolean
}

function partsUntil(target: Date): Parts {
  const ms = target.getTime() - Date.now()
  if (ms <= 0) return { days: 0, hours: 0, mins: 0, done: true }
  const secs = Math.floor(ms / 1000)
  return {
    days: Math.floor(secs / 86400),
    hours: Math.floor((secs % 86400) / 3600),
    mins: Math.floor((secs % 3600) / 60),
    done: false,
  }
}

function Cell({ value, label }: { value: number; label: string }) {
  const [tick, setTick] = useState(false)
  const prev = useRef(value)
  useEffect(() => {
    if (prev.current !== value) {
      prev.current = value
      setTick(true)
      const t = setTimeout(() => setTick(false), 500)
      return () => clearTimeout(t)
    }
  }, [value])
  return (
    <div className="count-cell">
      <span className={`count-num${tick ? ' tick' : ''}`}>{String(value).padStart(2, '0')}</span>
      <span className="count-label">{label}</span>
    </div>
  )
}

interface Props {
  /** ISO date to count down to */
  target: string
  /** Shown under the countdown, e.g. "until the wedding" */
  label?: string
}

export default function Countdown({ target, label }: Props) {
  const [parts, setParts] = useState(() => partsUntil(parseISO(target)))

  useEffect(() => {
    // Minutes are the finest unit shown; refresh a bit faster to stay accurate.
    const id = setInterval(() => setParts(partsUntil(parseISO(target))), 15_000)
    return () => clearInterval(id)
  }, [target])

  if (parts.done) {
    return (
      <div className="countdown">
        <div className="count-cell">
          <span className="count-num">🎉</span>
          <span className="count-label">It's here — mabrouk!</span>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="countdown" role="timer" aria-label={`Countdown ${label ?? ''}`}>
        <Cell value={parts.days} label="days" />
        <Cell value={parts.hours} label="hours" />
        <Cell value={parts.mins} label="minutes" />
      </div>
      {label && <p className="count-caption">{label}</p>}
    </div>
  )
}
