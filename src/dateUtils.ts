import { TRIP } from './config'

/** Parse an ISO date (YYYY-MM-DD) as a local Date at midnight. */
export function parseISO(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function toISO(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/** All trip days, inclusive of start and end. */
export function tripDays(): string[] {
  const days: string[] = []
  const cursor = parseISO(TRIP.startDate)
  let iso = toISO(cursor)
  while (iso <= TRIP.endDate) {
    days.push(iso)
    cursor.setDate(cursor.getDate() + 1)
    iso = toISO(cursor)
  }
  return days
}

export function isTripDay(iso: string): boolean {
  return iso >= TRIP.startDate && iso <= TRIP.endDate
}

/**
 * Full Monday–Sunday weeks covering the trip: from the Monday on/before the
 * start date through the Sunday on/after the end date.
 */
export function tripWeeks(): string[][] {
  const cursor = parseISO(TRIP.startDate)
  cursor.setDate(cursor.getDate() - ((cursor.getDay() + 6) % 7)) // back to Monday
  const weeks: string[][] = []
  do {
    const week: string[] = []
    for (let i = 0; i < 7; i++) {
      week.push(toISO(cursor))
      cursor.setDate(cursor.getDate() + 1)
    }
    weeks.push(week)
  } while (weeks[weeks.length - 1][6] < TRIP.endDate)
  return weeks
}

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

export function formatDay(iso: string): string {
  const d = parseISO(iso)
  return `${WEEKDAYS[d.getDay()]}, ${MONTHS[d.getMonth()]} ${d.getDate()}`
}

export function formatShort(iso: string): string {
  const d = parseISO(iso)
  return `${MONTHS[d.getMonth()].slice(0, 3)} ${d.getDate()}`
}

export function weekdayShort(iso: string): string {
  return WEEKDAYS[parseISO(iso).getDay()].slice(0, 3)
}

/** Whole days from today until the given ISO date (0 if past). */
export function daysUntil(iso: string): number {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const target = parseISO(iso)
  const diff = Math.ceil((target.getTime() - today.getTime()) / 86_400_000)
  return Math.max(0, diff)
}

/** 1-based day number of the trip for a given date. */
export function tripDayNumber(iso: string): number {
  const start = parseISO(TRIP.startDate)
  const d = parseISO(iso)
  return Math.round((d.getTime() - start.getTime()) / 86_400_000) + 1
}

/** "19:30" → minutes since midnight (1170); null/invalid → null. */
export function timeToMinutes(hhmm?: string): number | null {
  if (!hhmm || !/^\d{1,2}:\d{2}$/.test(hhmm)) return null
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

/** "19:30" → "7:30 PM". Returns '' for missing/invalid input. */
export function formatTime(hhmm?: string): string {
  const mins = timeToMinutes(hhmm)
  if (mins === null) return ''
  const h = Math.floor(mins / 60)
  const m = mins % 60
  const period = h < 12 ? 'AM' : 'PM'
  const h12 = h % 12 === 0 ? 12 : h % 12
  return `${h12}:${String(m).padStart(2, '0')} ${period}`
}
