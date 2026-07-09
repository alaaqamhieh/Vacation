// Single source of truth for trip facts. Edit here to change the trip.
export const TRIP = {
  travelers: 'Alaa & Bissan',
  destination: 'Amman, Jordan',
  title: 'Adam & Leen Wedding',
  couple: 'Adam & Leen',
  // Banner tagline — keep it themed around the destination.
  heroKicker: 'To the land of Petra & the Dead Sea',
  // ISO dates, inclusive. Jul 23 = depart US, Aug 4 = fly home.
  startDate: '2026-07-23',
  endDate: '2026-08-04',
  weddingDate: '2026-08-02',
  weddingLabel: "Adam & Leen's wedding",
} as const

/** Previous wedding label — used to migrate already-saved plans in loadState. */
export const OLD_WEDDING_LABEL = "Bissan's cousin's wedding"

export const STORAGE_KEY = 'amman-2026-trip'
export const STORAGE_VERSION = 1

/** Where the site is published — used for the calendar subscription links. */
export const SITE_URL = 'https://alaaqamhieh.github.io/Vacation/'
export const ICS_URL = `${SITE_URL}itinerary.ics`
export const WEBCAL_URL = ICS_URL.replace(/^https:/, 'webcal:')

/**
 * Google Places API key. Safe to ship publicly: it is restricted in the Google
 * Cloud console to the alaaqamhieh.github.io referrer and the Places API only,
 * so it works from this site and nowhere else.
 */
export const GOOGLE_PLACES_KEY = 'AIzaSyAR_iA_UYzwSP2O_O5x9hEzX8zpPY-kjlY'

/**
 * Firebase Realtime Database URL for the shared family plan. Empty = sharing is
 * OFF and the app runs fully local. Set to a Firebase RTDB node to turn on live
 * family sync for everyone (src/sync.ts appends ".json").
 */
export const SHARED_DB_URL = 'https://parent-s-vacation-default-rtdb.firebaseio.com/plan'

/** Effective shared-DB URL — a window/localStorage override wins if present. */
export function getSharedDbUrl(): string {
  try {
    const win = (window as unknown as { __DB_URL__?: string }).__DB_URL__
    return win ?? localStorage.getItem('amman-2026-dburl') ?? SHARED_DB_URL
  } catch {
    return SHARED_DB_URL
  }
}
