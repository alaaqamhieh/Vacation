import { useEffect, useRef, useState } from 'react'
import { parseISO } from '../dateUtils'
import { TRIP } from '../config'

interface Parts {
  days: number
  hours: number
  mins: number
  secs: number
  done: boolean
}

function partsUntil(target: Date): Parts {
  const ms = target.getTime() - Date.now()
  if (ms <= 0) return { days: 0, hours: 0, mins: 0, secs: 0, done: true }
  const secs = Math.floor(ms / 1000)
  return {
    days: Math.floor(secs / 86400),
    hours: Math.floor((secs % 86400) / 3600),
    mins: Math.floor((secs % 3600) / 60),
    secs: secs % 60,
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

export default function Countdown() {
  const target = parseISO(TRIP.startDate)
  const [parts, setParts] = useState(() => partsUntil(target))

  useEffect(() => {
    const id = setInterval(() => setParts(partsUntil(parseISO(TRIP.startDate))), 1000)
    return () => clearInterval(id)
  }, [])

  if (parts.done) {
    return <div className="countdown"><div className="count-cell"><span className="count-num">🎉</span><span className="count-label">We're here — yalla!</span></div></div>
  }

  return (
    <div className="countdown" role="timer" aria-label="Countdown to departure">
      <Cell value={parts.days} label="days" />
      <Cell value={parts.hours} label="hours" />
      <Cell value={parts.mins} label="minutes" />
      <Cell value={parts.secs} label="seconds" />
    </div>
  )
}
