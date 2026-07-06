import { getSharedDbUrl } from './config'
import type { TripState } from './types'

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
    const data = (await res.json()) as SharedSnapshot | null
    return data && data._meta ? data : null
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
