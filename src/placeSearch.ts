import type { Category, PriceTier, Region } from './types'
import { GOOGLE_PLACES_KEY } from './config'

export interface PlaceResult {
  name: string
  neighborhood: string
  city: string
  coords: [number, number]
  /** Raw place kind, e.g. "restaurant", "cafe", "attraction" */
  kind: string
  cuisine?: string
  price?: PriceTier
  /** Best-guess emoji from the place type/cuisine */
  emoji: string
  googleUrl: string
}

/** A localStorage override wins over the embedded key (handy if quota is hit). */
export function getGoogleKey(): string {
  try {
    return localStorage.getItem('amman-2026-gkey') || GOOGLE_PLACES_KEY
  } catch {
    return GOOGLE_PLACES_KEY
  }
}

function titleCase(text: string): string {
  return text.replaceAll('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

/** Guess a fitting emoji from Google place types + cuisine text. */
export function smartEmoji(types: string[], cuisine?: string): string {
  const hay = `${types.join(' ')} ${cuisine ?? ''}`.toLowerCase()
  if (/(cafe|coffee)/.test(hay)) return '☕'
  if (/(bakery|dessert|sweet|pastr|ice_cream|patisserie)/.test(hay)) return '🍰'
  if (/(seafood|fish)/.test(hay)) return '🐟'
  if (/(falafel|vegetarian|vegan)/.test(hay)) return '🧆'
  if (/(barbecue|grill|steak|kebab|meat|shawarma)/.test(hay)) return '🍢'
  if (/(pizza|italian)/.test(hay)) return '🍕'
  if (/(bar|pub|night_club|wine)/.test(hay)) return '🍷'
  if (/(breakfast|brunch)/.test(hay)) return '🍳'
  if (/(museum|historic|monument|archaeolog|castle|tourist_attraction)/.test(hay)) return '🏛️'
  if (/(mosque|church|place_of_worship)/.test(hay)) return '🕌'
  if (/(park|natural|hiking|beach|campground|zoo)/.test(hay)) return '🏜️'
  if (/(shopping|store|market|mall)/.test(hay)) return '🛍️'
  if (/(spa|hot_spring)/.test(hay)) return '🧖'
  if (/(lodging|hotel|resort)/.test(hay)) return '🏨'
  if (/(restaurant|food|meal)/.test(hay)) return '🍽️'
  return '📍'
}

/** Rough Google-types → activity category. */
export function guessCategory(types: string[]): Category {
  const hay = types.join(' ').toLowerCase()
  if (/(museum|historic|monument|archaeolog|castle|place_of_worship|tourist_attraction)/.test(hay)) return 'history'
  if (/(park|natural|hiking|beach|campground|zoo|point_of_interest)/.test(hay) && !/(store|shopping)/.test(hay))
    return 'nature'
  if (/(shopping|store|market|mall)/.test(hay)) return 'market'
  return 'relax'
}

/** Closest trip region to a coordinate, for auto-filing imports. */
export function nearestRegion(coords: [number, number]): Region {
  const centroids: Record<Region, [number, number]> = {
    amman: [31.95, 35.91],
    north: [32.27, 35.89],
    madaba: [31.72, 35.79],
    deadsea: [31.71, 35.59],
    petra: [30.33, 35.44],
    wadirum: [29.58, 35.42],
    aqaba: [29.53, 35.0],
  }
  let best: Region = 'amman'
  let bestDist = Infinity
  for (const [region, [lat, lng]] of Object.entries(centroids) as [Region, [number, number]][]) {
    const d = (coords[0] - lat) ** 2 + (coords[1] - lng) ** 2
    if (d < bestDist) {
      bestDist = d
      best = region
    }
  }
  return best
}

interface GooglePlace {
  displayName?: { text?: string }
  formattedAddress?: string
  location?: { latitude?: number; longitude?: number }
  types?: string[]
  primaryType?: string
  priceLevel?: string
  googleMapsUri?: string
}

const GOOGLE_PRICE: Record<string, PriceTier> = {
  PRICE_LEVEL_FREE: 1,
  PRICE_LEVEL_INEXPENSIVE: 1,
  PRICE_LEVEL_MODERATE: 2,
  PRICE_LEVEL_EXPENSIVE: 3,
  PRICE_LEVEL_VERY_EXPENSIVE: 3,
}

/** Search Google Places (Text Search, New). Throws on a non-OK response. */
export async function searchPlaces(query: string): Promise<PlaceResult[]> {
  const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': getGoogleKey(),
      'X-Goog-FieldMask':
        'places.displayName,places.formattedAddress,places.location,places.types,places.primaryType,places.priceLevel,places.googleMapsUri',
    },
    body: JSON.stringify({ textQuery: `${query}, Jordan`, maxResultCount: 6, regionCode: 'JO' }),
  })
  if (!res.ok) throw new Error(`Search failed (${res.status})`)
  const data = (await res.json()) as { places?: GooglePlace[] }
  return (data.places ?? []).map((p) => {
    const name = p.displayName?.text ?? 'Unknown place'
    const parts = (p.formattedAddress ?? '').split(',').map((s) => s.trim()).filter(Boolean)
    const types = p.types ?? (p.primaryType ? [p.primaryType] : [])
    const cuisineType = types.find((t) => t.endsWith('_restaurant') || t === 'cafe' || t === 'bakery')
    const cuisine = cuisineType ? titleCase(cuisineType.replace('_restaurant', '')) : undefined
    return {
      name,
      neighborhood: parts[1] ?? parts[0] ?? 'Jordan',
      city: parts[parts.length - 2] ?? 'Amman',
      coords: [p.location?.latitude ?? 31.95, p.location?.longitude ?? 35.91] as [number, number],
      kind: titleCase(p.primaryType ?? types[0] ?? 'place'),
      cuisine,
      price: p.priceLevel ? GOOGLE_PRICE[p.priceLevel] : undefined,
      emoji: smartEmoji(types, cuisine),
      googleUrl: p.googleMapsUri ?? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name + ', Jordan')}`,
    }
  })
}
