import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { Activity, Restaurant } from '../types'
import { REGION_META } from '../types'
import { mapsUrl } from '../mapUtils'
import { useReveal } from '../useReveal'
import { searchPlaces, type PlaceResult } from '../placeSearch'
import type { AddTarget } from './AddToDayModal'

type PinKind = 'food' | 'place' | 'search'

type Selected =
  | { source: 'library'; kind: 'activity' | 'restaurant'; refId: string; title: string; emoji: string; meta: string; url: string }
  | { source: 'search'; place: PlaceResult; kind: 'activity' | 'restaurant' }

interface Props {
  activities: Activity[]
  restaurants: Restaurant[]
  scheduledIds: Set<string>
  /** Open the day-picker for a library item. */
  onPlan: (target: AddTarget) => void
  /** Import a searched place into the library and return its day-picker target. */
  onImportPlace: (p: PlaceResult, kind: 'activity' | 'restaurant') => AddTarget
}

function pinIcon(emoji: string, kind: PinKind): L.DivIcon {
  return L.divIcon({
    className: `map-pin ${kind}`,
    html: `<span>${emoji}</span>`,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
  })
}

/** Decide whether a searched place is food (restaurant) or a sight (activity). */
function isFoodPlace(p: PlaceResult): boolean {
  const hay = `${p.kind} ${p.cuisine ?? ''}`.toLowerCase()
  return /restaurant|cafe|café|bakery|food|meal|coffee|dessert|ice.?cream|patisser|bar\b|pub|bistro|grill|diner/.test(hay)
}

export default function TripMap({ activities, restaurants, scheduledIds, onPlan, onImportPlace }: Props) {
  const mapEl = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<L.Map | null>(null)
  const foodLayer = useRef<L.LayerGroup | null>(null)
  const placesLayer = useRef<L.LayerGroup | null>(null)
  const searchLayer = useRef<L.LayerGroup | null>(null)
  const [showFood, setShowFood] = useState(true)
  const [showPlaces, setShowPlaces] = useState(true)
  const [selected, setSelected] = useState<Selected | null>(null)
  const ref = useReveal<HTMLElement>()

  // Search state
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<PlaceResult[] | null>(null)
  const [searching, setSearching] = useState(false)
  const [searchError, setSearchError] = useState('')

  useEffect(() => {
    if (!mapEl.current || mapRef.current) return
    const map = L.map(mapEl.current, { scrollWheelZoom: false, center: [31.6, 35.7], zoom: 7 })
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18,
    }).addTo(map)
    map.on('click', () => setSelected(null))

    mapRef.current = map
    foodLayer.current = L.layerGroup().addTo(map)
    placesLayer.current = L.layerGroup().addTo(map)
    searchLayer.current = L.layerGroup().addTo(map)
    return () => {
      map.remove()
      mapRef.current = null
      foodLayer.current = null
      placesLayer.current = null
      searchLayer.current = null
      fittedOnce.current = false
    }
  }, [])

  // (Re)populate library markers whenever the lists change, so imported spots pin live.
  const fittedOnce = useRef(false)
  useEffect(() => {
    const map = mapRef.current
    const food = foodLayer.current
    const places = placesLayer.current
    if (!map || !food || !places) return
    food.clearLayers()
    places.clearLayers()
    const bounds: L.LatLngTuple[] = []

    for (const r of restaurants) {
      if (!r.coords) continue
      bounds.push(r.coords)
      L.marker(r.coords, { icon: pinIcon(r.emoji, 'food') })
        .on('click', () => setSelected({
          source: 'library', kind: 'restaurant', refId: r.id, title: r.name, emoji: r.emoji,
          meta: `${r.cuisine} · ${r.neighborhood}`, url: mapsUrl(r.name, r.neighborhood),
        }))
        .addTo(food)
    }
    for (const a of activities) {
      if (!a.coords) continue
      bounds.push(a.coords)
      L.marker(a.coords, { icon: pinIcon(a.emoji, 'place') })
        .on('click', () => setSelected({
          source: 'library', kind: 'activity', refId: a.id, title: a.title, emoji: a.emoji,
          meta: REGION_META[a.region].label, url: mapsUrl(a.title, REGION_META[a.region].label),
        }))
        .addTo(places)
    }

    if (!fittedOnce.current && bounds.length > 0) {
      map.fitBounds(L.latLngBounds(bounds), { padding: [30, 30] })
      fittedOnce.current = true
    }
  }, [activities, restaurants])

  // Drop pins for the latest search results and zoom to them.
  useEffect(() => {
    const map = mapRef.current
    const layer = searchLayer.current
    if (!map || !layer) return
    layer.clearLayers()
    if (!results || results.length === 0) return
    const bounds: L.LatLngTuple[] = []
    for (const p of results) {
      bounds.push(p.coords)
      L.marker(p.coords, { icon: pinIcon(p.emoji, 'search') })
        .on('click', () => setSelected({ source: 'search', place: p, kind: isFoodPlace(p) ? 'restaurant' : 'activity' }))
        .addTo(layer)
    }
    map.fitBounds(L.latLngBounds(bounds), { padding: [40, 40], maxZoom: 15 })
  }, [results])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !foodLayer.current || !placesLayer.current) return
    if (showFood) map.addLayer(foodLayer.current)
    else map.removeLayer(foodLayer.current)
    if (showPlaces) map.addLayer(placesLayer.current)
    else map.removeLayer(placesLayer.current)
  }, [showFood, showPlaces])

  const runSearch = async () => {
    if (!query.trim() || searching) return
    setSearching(true)
    setSearchError('')
    setSelected(null)
    try {
      const found = await searchPlaces(query.trim())
      setResults(found)
      if (found.length === 0) setSearchError('No matches — try adding a city, e.g. “sunset café Amman”.')
    } catch {
      setSearchError('Search didn’t go through — check the connection and try again.')
    } finally {
      setSearching(false)
    }
  }

  const clearSearch = () => {
    setResults(null)
    setQuery('')
    setSearchError('')
    setSelected(null)
  }

  const planned = selected?.source === 'library' && scheduledIds.has(selected.refId)

  const addSelectedToDay = () => {
    if (!selected) return
    if (selected.source === 'library') {
      onPlan({ kind: selected.kind, refId: selected.refId, title: selected.title, emoji: selected.emoji })
    } else {
      onPlan(onImportPlace(selected.place, selected.kind))
      clearSearch()
    }
    setSelected(null)
  }

  return (
    <section id="map" ref={ref} className="reveal">
      <div className="container">
        <div className="section-head">
          <div className="section-kicker">Plan on the map</div>
          <h2 className="section-title">🗺️ Pick your spots</h2>
          <p className="section-sub">
            Every place on the lists is pinned here. Search to discover more food and sights, tap any pin, then drop it
            straight onto a day.
          </p>
        </div>

        <div className="map-search">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && runSearch()}
            placeholder="🔎 Search Jordan — “best knafeh Amman”, “viewpoint”, “rooftop dinner”…"
            aria-label="Search places in Jordan"
          />
          <button className="btn" onClick={runSearch} disabled={searching || !query.trim()}>
            {searching ? '…' : 'Search'}
          </button>
          {results && (
            <button className="btn ghost" onClick={clearSearch}>Clear</button>
          )}
        </div>
        {searchError && <p className="search-hint error">{searchError}</p>}
        {results && results.length > 0 && (
          <p className="search-hint">📍 {results.length} found — tap a glowing pin to add it to a day.</p>
        )}

        <div className="chip-row">
          <button className={`chip${showFood ? ' on' : ''}`} onClick={() => setShowFood((v) => !v)}>🍽️ Food</button>
          <button className={`chip${showPlaces ? ' on' : ''}`} onClick={() => setShowPlaces((v) => !v)}>🏜️ Sights</button>
        </div>

        <div className="map-wrap">
          <div ref={mapEl} className="trip-map" aria-label="Map of trip locations" />
          {selected && (
            <div className="map-detail" role="dialog">
              <button className="map-detail-close" onClick={() => setSelected(null)} aria-label="Close">✕</button>
              <div className="map-detail-emoji">{selected.source === 'library' ? selected.emoji : selected.place.emoji}</div>
              <div className="map-detail-body">
                <strong>{selected.source === 'library' ? selected.title : selected.place.name}</strong>
                <span className="map-detail-meta">
                  {selected.source === 'library'
                    ? selected.meta
                    : `${selected.place.kind}${selected.place.cuisine ? ` · ${selected.place.cuisine}` : ''} · ${selected.place.neighborhood}`}
                </span>
                {planned && <span className="map-detail-tag">✓ Already on your plan</span>}
                {selected.source === 'search' && (
                  <span className="map-detail-tag new">✨ New find — adding it saves it to your lists</span>
                )}
              </div>
              <div className="map-detail-actions">
                <button className="btn" onClick={addSelectedToDay}>➕ Add to a day</button>
                <a
                  className="btn ghost"
                  href={selected.source === 'library' ? selected.url : selected.place.googleUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Maps ↗
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
