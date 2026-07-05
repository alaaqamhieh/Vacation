import type { PriceTier, Region } from './types'
import { mapsUrl } from './mapUtils'

export interface PlaceResult {
  name: string
  neighborhood: string
  city: string
  coords: [number, number]
  /** Raw place kind, e.g. "restaurant", "cafe", "attraction" */
  kind: string
  cuisine?: string
  price?: PriceTier
  googleUrl: string
  source: 'osm' | 'google'
}

const GOOGLE_KEY_STORAGE = 'amman-2026-gkey'

export function getGoogleKey(): string {
  try {
    return localStorage.getItem(GOOGLE_KEY_STORAGE) ?? ''
  } catch {
    return ''
  }
}

export function setGoogleKey(key: string): void {
  try {
    if (key.trim()) localStorage.setItem(GOOGLE_KEY_STORAGE, key.trim())
    else localStorage.removeItem(GOOGLE_KEY_STORAGE)
  } catch {
    // storage unavailable — search still works via OSM
  }
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

function titleCase(text: string): string {
  return text.replaceAll('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

interface NominatimHit {
  lat: string
  lon: string
  name?: string
  display_name: string
  category?: string
  type?: string
  address?: Record<string, string>
  extratags?: Record<string, string> | null
}

async function searchOSM(query: string): Promise<PlaceResult[]> {
  const url =
    'https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&extratags=1&limit=6&countrycodes=jo&accept-language=en&q=' +
    encodeURIComponent(query)
  const res = await fetch(url, { headers: { Accept: 'application/json' } })
  if (!res.ok) throw new Error(`Search failed (${res.status})`)
  const hits = (await res.json()) as NominatimHit[]
  return hits.map((h) => {
    const a = h.address ?? {}
    const neighborhood = a.suburb ?? a.neighbourhood ?? a.quarter ?? a.road ?? a.town ?? a.city ?? a.state ?? 'Jordan'
    const city = a.city ?? a.town ?? a.state ?? 'Jordan'
    const name = h.name?.trim() || h.display_name.split(',')[0]
    const cuisineRaw = h.extratags?.cuisine
    return {
      name,
      neighborhood,
      city,
      coords: [Number(h.lat), Number(h.lon)] as [number, number],
      kind: titleCase(h.type ?? h.category ?? 'place'),
      cuisine: cuisineRaw ? titleCase(cuisineRaw.split(';').slice(0, 2).join(' & ')) : undefined,
      googleUrl: mapsUrl(name, city),
      source: 'osm' as const,
    }
  })
}

interface GooglePlace {
  displayName?: { text?: string }
  formattedAddress?: string
  location?: { latitude?: number; longitude?: number }
  types?: string[]
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

async function searchGoogle(query: string, key: string): Promise<PlaceResult[]> {
  const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': key,
      'X-Goog-FieldMask':
        'places.displayName,places.formattedAddress,places.location,places.types,places.priceLevel,places.googleMapsUri',
    },
    body: JSON.stringify({ textQuery: `${query}, Jordan`, maxResultCount: 6 }),
  })
  if (!res.ok) throw new Error(`Google search failed (${res.status})`)
  const data = (await res.json()) as { places?: GooglePlace[] }
  return (data.places ?? []).map((p) => {
    const name = p.displayName?.text ?? 'Unknown place'
    const parts = (p.formattedAddress ?? '').split(',').map((s) => s.trim())
    const neighborhood = parts[1] ?? parts[0] ?? 'Jordan'
    const cuisineType = p.types?.find((t) => t.endsWith('_restaurant') || t === 'cafe' || t === 'bakery')
    return {
      name,
      neighborhood,
      city: parts[parts.length - 2] ?? 'Jordan',
      coords: [p.location?.latitude ?? 31.95, p.location?.longitude ?? 35.91] as [number, number],
      kind: titleCase(p.types?.[0] ?? 'place'),
      cuisine: cuisineType ? titleCase(cuisineType.replace('_restaurant', '')) : undefined,
      price: p.priceLevel ? GOOGLE_PRICE[p.priceLevel] : undefined,
      googleUrl: p.googleMapsUri ?? mapsUrl(name, 'Jordan'),
      source: 'google' as const,
    }
  })
}

/** Search Google Places when a key is configured on this device, else OSM. */
export async function searchPlaces(query: string): Promise<PlaceResult[]> {
  const key = getGoogleKey()
  if (key) {
    try {
      return await searchGoogle(query, key)
    } catch {
      // Bad key or quota — fall back to OSM rather than failing the search.
    }
  }
  return searchOSM(query)
}
