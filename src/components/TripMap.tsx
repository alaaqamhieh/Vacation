import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { Activity, Restaurant } from '../types'
import { REGION_META } from '../types'
import { mapsUrl } from '../mapUtils'
import { useReveal } from '../useReveal'

interface Props {
  activities: Activity[]
  restaurants: Restaurant[]
}

function pinIcon(emoji: string, food: boolean): L.DivIcon {
  return L.divIcon({
    className: `map-pin${food ? ' food' : ''}`,
    html: `<span>${emoji}</span>`,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -14],
  })
}

function popupHtml(name: string, meta: string, url: string): string {
  return `<strong>${name}</strong><br><span class="pop-meta">${meta}</span><br><a href="${url}" target="_blank" rel="noreferrer">Open in Google Maps ↗</a>`
}

export default function TripMap({ activities, restaurants }: Props) {
  const mapEl = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<L.Map | null>(null)
  const foodLayer = useRef<L.LayerGroup | null>(null)
  const placesLayer = useRef<L.LayerGroup | null>(null)
  const [showFood, setShowFood] = useState(true)
  const [showPlaces, setShowPlaces] = useState(true)
  const ref = useReveal<HTMLElement>()

  useEffect(() => {
    if (!mapEl.current || mapRef.current) return
    // Initial view over Jordan so layers attach immediately; fitBounds refines it.
    const map = L.map(mapEl.current, { scrollWheelZoom: false, center: [31.2, 35.8], zoom: 7 })
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18,
    }).addTo(map)

    mapRef.current = map
    foodLayer.current = L.layerGroup().addTo(map)
    placesLayer.current = L.layerGroup().addTo(map)
    return () => {
      map.remove()
      mapRef.current = null
      foodLayer.current = null
      placesLayer.current = null
      fittedOnce.current = false
    }
  }, [])

  // (Re)populate markers whenever the lists change, so imported spots pin live.
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
      L.marker(r.coords, { icon: pinIcon(r.emoji, true) })
        .bindPopup(popupHtml(r.name, `${r.cuisine} · ${r.neighborhood}`, mapsUrl(r.name, r.neighborhood)))
        .addTo(food)
    }
    for (const a of activities) {
      if (!a.coords) continue
      bounds.push(a.coords)
      L.marker(a.coords, { icon: pinIcon(a.emoji, false) })
        .bindPopup(popupHtml(a.title, REGION_META[a.region].label, mapsUrl(a.title, REGION_META[a.region].label)))
        .addTo(places)
    }

    if (!fittedOnce.current && bounds.length > 0) {
      map.fitBounds(L.latLngBounds(bounds), { padding: [30, 30] })
      fittedOnce.current = true
    }
  }, [activities, restaurants])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !foodLayer.current || !placesLayer.current) return
    if (showFood) map.addLayer(foodLayer.current)
    else map.removeLayer(foodLayer.current)
    if (showPlaces) map.addLayer(placesLayer.current)
    else map.removeLayer(placesLayer.current)
  }, [showFood, showPlaces])

  return (
    <section id="map" ref={ref} className="reveal">
      <div className="container">
        <div className="section-head">
          <div className="section-kicker">Get your bearings</div>
          <h2 className="section-title">🗺️ Where everything is</h2>
          <p className="section-sub">
            Every spot on the lists, pinned across Jordan. Tap a pin for the name and a Google Maps link — pins are
            approximate, the Maps link is exact.
          </p>
        </div>
        <div className="chip-row">
          <button className={`chip${showFood ? ' on' : ''}`} onClick={() => setShowFood((v) => !v)}>🍽️ Food</button>
          <button className={`chip${showPlaces ? ' on' : ''}`} onClick={() => setShowPlaces((v) => !v)}>🏜️ Places</button>
        </div>
        <div ref={mapEl} className="trip-map" aria-label="Map of trip locations" />
      </div>
    </section>
  )
}
