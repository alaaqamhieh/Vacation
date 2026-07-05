import { TRIP } from './config'
import type { ScheduledItem, Activity, Restaurant } from './types'

function icsDate(iso: string): string {
  return iso.replaceAll('-', '')
}

function nextDay(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  const date = new Date(y, m - 1, d + 1)
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}${mm}${dd}`
}

function escapeText(text: string): string {
  return text.replaceAll('\\', '\\\\').replaceAll(';', '\\;').replaceAll(',', '\\,').replaceAll('\n', '\\n')
}

/** Fold lines at 75 octets per RFC 5545 (simple char-based fold is fine for our content). */
function fold(line: string): string {
  const out: string[] = []
  let rest = line
  while (rest.length > 73) {
    out.push(rest.slice(0, 73))
    rest = ' ' + rest.slice(73)
  }
  out.push(rest)
  return out.join('\r\n')
}

export interface IcsSources {
  activities: Activity[]
  restaurants: Restaurant[]
}

export function buildICS(items: ScheduledItem[], sources: IcsSources): string {
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+Z$/, 'Z')
  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    `PRODID:-//${escapeText(TRIP.travelers)}//${escapeText(TRIP.title)}//EN`,
    'CALSCALE:GREGORIAN',
    fold(`X-WR-CALNAME:${escapeText(`${TRIP.title} · Amman 2026`)}`),
    'X-PUBLISHED-TTL:PT12H',
    'REFRESH-INTERVAL;VALUE=DURATION:PT12H',
  ]

  for (const item of items) {
    let title = item.title ?? ''
    let emoji = item.emoji ?? ''
    let description = item.note ?? ''
    if (item.kind === 'activity' && item.refId) {
      const a = sources.activities.find((x) => x.id === item.refId)
      if (a) {
        title = a.title
        emoji = a.emoji
        description = description || a.description
      }
    } else if (item.kind === 'restaurant' && item.refId) {
      const r = sources.restaurants.find((x) => x.id === item.refId)
      if (r) {
        const meal = item.meal === 'breakfast' ? 'Breakfast' : item.meal === 'lunch' ? 'Lunch' : 'Dinner'
        title = `${meal} at ${r.name}`
        emoji = r.emoji
        description = description || `${r.cuisine} · ${r.neighborhood}. ${r.description}`
      }
    }
    if (!title) continue
    lines.push(
      'BEGIN:VEVENT',
      fold(`UID:${item.id}@amman2026`),
      `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${icsDate(item.date)}`,
      `DTEND;VALUE=DATE:${nextDay(item.date)}`,
      fold(`SUMMARY:${escapeText(emoji ? `${emoji} ${title}` : title)}`),
    )
    if (description) lines.push(fold(`DESCRIPTION:${escapeText(description)}`))
    lines.push('END:VEVENT')
  }

  lines.push('END:VCALENDAR')
  return lines.join('\r\n') + '\r\n'
}

export function downloadICS(items: ScheduledItem[], sources: IcsSources): void {
  const blob = new Blob([buildICS(items, sources)], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'amman-2026-itinerary.ics'
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
