import { OLD_WEDDING_LABEL, STORAGE_KEY, STORAGE_VERSION, TRIP } from './config'
import type { TripState } from './types'
import { SEED_SCHEDULE } from './data'

export function defaultState(): TripState {
  return {
    version: STORAGE_VERSION,
    scheduled: SEED_SCHEDULE.map((s) => ({ ...s })),
    customActivities: [],
    customRestaurants: [],
    shortlist: [],
    visited: [],
    packed: [],
    theme: 'auto',
  }
}

export function loadState(): TripState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultState()
    const parsed = JSON.parse(raw) as Partial<TripState>
    if (parsed.version !== STORAGE_VERSION) return defaultState()
    const base = defaultState()
    // Migrate plans saved before the wedding got the couple's names.
    const scheduled = (Array.isArray(parsed.scheduled) ? parsed.scheduled : base.scheduled).map((it) =>
      it.id === 'ms-wedding' && it.title === OLD_WEDDING_LABEL ? { ...it, title: TRIP.weddingLabel } : it,
    )
    return {
      ...base,
      ...parsed,
      version: STORAGE_VERSION,
      scheduled,
      customActivities: parsed.customActivities ?? [],
      customRestaurants: parsed.customRestaurants ?? [],
      shortlist: parsed.shortlist ?? [],
      visited: parsed.visited ?? [],
      packed: parsed.packed ?? [],
      theme: parsed.theme ?? 'auto',
    }
  } catch {
    return defaultState()
  }
}

export function saveState(state: TripState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Storage full or unavailable — the app still works, just won't persist.
  }
}
