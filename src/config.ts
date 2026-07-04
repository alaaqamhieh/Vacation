// Single source of truth for trip facts. Edit here to change the trip.
export const TRIP = {
  travelers: 'Alaa & Bissan',
  destination: 'Amman, Jordan',
  title: 'Amman 2026',
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
