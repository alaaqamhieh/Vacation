export type Category =
  | 'history'
  | 'nature'
  | 'daytrip'
  | 'market'
  | 'relax'

export type Region =
  | 'amman'
  | 'petra'
  | 'deadsea'
  | 'wadirum'
  | 'north'
  | 'madaba'
  | 'aqaba'

export type PriceTier = 1 | 2 | 3
export type Popularity = 1 | 2 | 3 | 4 | 5

export interface Activity {
  id: string
  title: string
  emoji: string
  category: Category
  region: Region
  description: string
  /** Suggested time commitment, e.g. "2–3 hrs", "Full day" */
  duration: string
  /** How much of a must-do it is, 1–5 (customs default to 3) */
  popularity?: Popularity
  /** Recommended by the family */
  familyPick?: boolean
  /** Approximate [lat, lng] for the trip map */
  coords?: [number, number]
  /** True for user-created activities (editable/deletable freely) */
  custom?: boolean
}

export interface Restaurant {
  id: string
  name: string
  emoji: string
  cuisine: string
  neighborhood: string
  region: Region
  vibe: string
  price: PriceTier
  signature: string
  orderIn: boolean
  description: string
  popularity?: Popularity
  familyPick?: boolean
  coords?: [number, number]
  custom?: boolean
}

export type MealSlot = 'breakfast' | 'lunch' | 'dinner'

export const MEAL_META: Record<MealSlot, { label: string; emoji: string; order: number }> = {
  breakfast: { label: 'Breakfast', emoji: '🌅', order: 0 },
  lunch: { label: 'Lunch', emoji: '☀️', order: 1 },
  dinner: { label: 'Dinner', emoji: '🌙', order: 2 },
}

/** Something placed on a specific day of the trip. */
export interface ScheduledItem {
  id: string
  /** ISO date this item is scheduled on */
  date: string
  kind: 'activity' | 'restaurant' | 'milestone'
  /** Points at Activity.id or Restaurant.id; milestones carry their own title */
  refId?: string
  /** Milestones and one-off events store display fields inline */
  title?: string
  emoji?: string
  note?: string
  meal?: MealSlot
  /** Optional 24-hour time, "HH:MM" (e.g. "19:30") */
  time?: string
  /** Milestones are protected: distinct styling + confirm before removal */
  milestone?: boolean
}

export interface TripState {
  version: number
  scheduled: ScheduledItem[]
  customActivities: Activity[]
  customRestaurants: Restaurant[]
  shortlist: string[]
  visited: string[]
  packed: string[]
  theme: 'light' | 'dark' | 'auto'
}

export const CATEGORY_META: Record<Category, { label: string; emoji: string }> = {
  history: { label: 'History & Culture', emoji: '🏛️' },
  nature: { label: 'Nature & Adventure', emoji: '🏜️' },
  daytrip: { label: 'Day Trips', emoji: '🚐' },
  market: { label: 'Markets & Shopping', emoji: '🧺' },
  relax: { label: 'Relax', emoji: '🌿' },
}

export const REGION_META: Record<Region, { label: string; emoji: string }> = {
  amman: { label: 'Amman', emoji: '🕌' },
  petra: { label: 'Petra', emoji: '🏜️' },
  deadsea: { label: 'Dead Sea', emoji: '🌊' },
  wadirum: { label: 'Wadi Rum', emoji: '🌌' },
  north: { label: 'Jerash & North', emoji: '🏺' },
  madaba: { label: 'Madaba & Mt. Nebo', emoji: '🗺️' },
  aqaba: { label: 'Aqaba', emoji: '🤿' },
}
