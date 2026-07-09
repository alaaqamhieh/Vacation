import { getSharedDbUrl, STORAGE_VERSION } from './config'
import type { TripState } from './types'

/** Coerce a value to an array — Firebase RTDB drops empty arrays and can
 *  return sparse arrays as keyed objects, so normalize both cases. */
function asArray<T>(v: unknown): T[] {
  if (Array.isArray(v)) return v as T[]
  if (v && typeof v === 'object') return Object.values(v) as T[]
  return []
}

/** Fill in any array fields Firebase stripped, so adopted state is always safe. */
function normalize(raw: Record<string, unknown>): SharedSnapshot {
  return {
    version: (raw.version as number) ?? STORAGE_VERSION,
    scheduled: asArray(raw.scheduled),
    customActivities: asArray(raw.customActivities),
    customRestaurants: asArray(raw.customRestaurants),
    shortlist: asArray(raw.shortlist),
    visited: asArray(raw.visited),
    packed: asArray(raw.packed),
    theme: (raw.theme as TripState['theme']) ?? 'auto',
    _meta: raw._meta as SharedSnapshot['_meta'],
  }
}

/** Stable per-device id so we can ignore our own echoes when polling. */
export function deviceId(): string {
  try {
    let id = localStorage.getItem('amman-2026-device')
    if (!id) {
      id = Math.random().toString(36).slice(2) + Date.now().toString(36)
      localStorage.setItem('amman-2026-device', id)
    }
    return id
  } catch {
    return 'anon'
  }
}

export interface SharedSnapshot extends TripState {
  _meta: { deviceId: string; updatedAt: number }
}

/** Firebase RTDB stores JSON at `${url}.json`. Empty url = sharing off. */
function jsonUrl(): string | null {
  const base = getSharedDbUrl()
  if (!base) return null
  return base.endsWith('.json') ? base : `${base.replace(/\/$/, '')}.json`
}

export function isSharingOn(): boolean {
  return jsonUrl() !== null
}

/** Read the shared plan, or null if sharing is off / nothing stored / failed. */
export async function fetchShared(): Promise<SharedSnapshot | null> {
  const url = jsonUrl()
  if (!url) return null
  try {
    const res = await fetch(url)
    if (!res.ok) return null
    const data = (await res.json()) as Record<string, unknown> | null
    return data && data._meta ? normalize(data) : null
  } catch {
    return null
  }
}

/** Overwrite the shared plan (last-write-wins). Returns the timestamp written. */
export async function pushShared(state: TripState): Promise<number | null> {
  const url = jsonUrl()
  if (!url) return null
  const updatedAt = Date.now()
  const snapshot: SharedSnapshot = { ...state, _meta: { deviceId: deviceId(), updatedAt } }
  try {
    const res = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(snapshot),
    })
    return res.ok ? updatedAt : null
  } catch {
    return null
  }
}
