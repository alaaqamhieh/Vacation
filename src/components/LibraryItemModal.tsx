import { useState } from 'react'
import Modal from './Modal'
import EmojiPicker from './EmojiPicker'
import { searchPlaces, getGoogleKey, setGoogleKey, nearestRegion, type PlaceResult } from '../placeSearch'
import { CATEGORY_META, REGION_META, type Activity, type Category, type PriceTier, type Region, type Restaurant } from '../types'

interface Props {
  kind: 'activity' | 'restaurant'
  onSaveActivity: (a: Activity) => void
  onSaveRestaurant: (r: Restaurant) => void
  onClose: () => void
}

/** Rough OSM kind → activity category mapping for imports. */
function guessCategory(kind: string): Category {
  const k = kind.toLowerCase()
  if (/(attraction|museum|monument|archaeological|castle|ruins|historic|artwork|place of worship)/.test(k)) return 'history'
  if (/(peak|beach|nature|park|water|viewpoint|cave|reserve)/.test(k)) return 'nature'
  if (/(mall|market|marketplace|shop|souk)/.test(k)) return 'market'
  return 'relax'
}

/** Add your own activity or restaurant to the library, by search or by hand. */
export default function LibraryItemModal({ kind, onSaveActivity, onSaveRestaurant, onClose }: Props) {
  const [title, setTitle] = useState('')
  const [emoji, setEmoji] = useState(kind === 'restaurant' ? '🍽️' : '✨')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<Category>('relax')
  const [region, setRegion] = useState<Region>('amman')
  const [duration, setDuration] = useState('2 hrs')
  const [cuisine, setCuisine] = useState('')
  const [neighborhood, setNeighborhood] = useState('')
  const [price, setPrice] = useState<PriceTier>(2)
  const [orderIn, setOrderIn] = useState(false)
  const [coords, setCoords] = useState<[number, number] | undefined>(undefined)

  // Find-online state
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<PlaceResult[] | null>(null)
  const [searching, setSearching] = useState(false)
  const [searchError, setSearchError] = useState('')
  const [showKey, setShowKey] = useState(false)
  const [gkey, setGkey] = useState(getGoogleKey)

  const runSearch = async () => {
    if (!query.trim() || searching) return
    setSearching(true)
    setSearchError('')
    setResults(null)
    try {
      setResults(await searchPlaces(query.trim()))
    } catch {
      setSearchError('Search didn’t go through — check the connection, or fill the form in manually below.')
    } finally {
      setSearching(false)
    }
  }

  const applyResult = (p: PlaceResult) => {
    setTitle(p.name)
    setNeighborhood(p.neighborhood)
    setRegion(nearestRegion(p.coords))
    setCoords(p.coords)
    if (p.cuisine) setCuisine(p.cuisine)
    if (p.price) setPrice(p.price)
    if (kind === 'activity') setCategory(guessCategory(p.kind))
    setResults(null)
    setQuery('')
  }

  const save = () => {
    if (!title.trim()) return
    const id = `custom-${kind}-${Date.now()}`
    if (kind === 'activity') {
      onSaveActivity({
        id, title: title.trim(), emoji, category, region, duration, coords,
        description: description.trim() || 'Our own idea.', custom: true,
      })
    } else {
      onSaveRestaurant({
        id, name: title.trim(), emoji, cuisine: cuisine.trim() || 'To try', neighborhood: neighborhood.trim() || 'Amman',
        region, vibe: 'Our pick', price, signature: description.trim() || 'TBD', orderIn, coords,
        description: description.trim() || 'Recommended to us — let’s try it.', custom: true,
      })
    }
  }

  return (
    <Modal onClose={onClose}>
      <h3>{kind === 'restaurant' ? '🍽️ Add a restaurant' : '✨ Add an activity'}</h3>

      <div className="field">
        <label>
          🔎 Find it online{' '}
          <button type="button" className="gear-link" onClick={() => setShowKey((v) => !v)} title="Search settings">⚙️</button>
        </label>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && runSearch()}
            placeholder={kind === 'restaurant' ? 'e.g. Hashem restaurant Amman' : 'e.g. Ajloun castle'}
            style={{ flex: 1 }}
          />
          <button type="button" className="btn ghost" onClick={runSearch} disabled={searching || !query.trim()}>
            {searching ? '…' : 'Search'}
          </button>
        </div>
        {showKey && (
          <div className="key-box">
            <label>Google Places API key (optional — upgrades search results on this device only)</label>
            <input
              value={gkey}
              onChange={(e) => {
                setGkey(e.target.value)
                setGoogleKey(e.target.value)
              }}
              placeholder="Paste key, or leave empty to use OpenStreetMap"
            />
          </div>
        )}
        {searchError && <p className="search-hint error">{searchError}</p>}
        {results && results.length === 0 && (
          <p className="search-hint">No matches found — try adding “Amman”, or fill the form in below.</p>
        )}
        {results && results.length > 0 && (
          <div className="place-results">
            {results.map((p, i) => (
              <div key={i} className="place-row">
                <button type="button" className="place-pick" onClick={() => applyResult(p)}>
                  <span className="place-name">{p.name}</span>
                  <span className="place-meta">
                    {p.kind}
                    {p.cuisine ? ` · ${p.cuisine}` : ''} · {p.neighborhood}
                  </span>
                </button>
                <span className="tag">{p.source === 'google' ? 'Google' : 'OSM'}</span>
                <a className="mini-btn" href={p.googleUrl} target="_blank" rel="noreferrer">↗</a>
              </div>
            ))}
          </div>
        )}
        {coords && <p className="search-hint">📍 Location imported — this spot will pin on the trip map.</p>}
      </div>

      <div className="field">
        <label>{kind === 'restaurant' ? 'Name' : 'Title'}</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div className="field">
        <label>Emoji</label>
        <EmojiPicker value={emoji} onChange={setEmoji} />
      </div>
      {kind === 'activity' ? (
        <>
          <div className="field">
            <label>Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value as Category)}>
              {Object.entries(CATEGORY_META).map(([k, v]) => (
                <option key={k} value={k}>{v.emoji} {v.label}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Region</label>
            <select value={region} onChange={(e) => setRegion(e.target.value as Region)}>
              {Object.entries(REGION_META).map(([k, v]) => (
                <option key={k} value={k}>{v.emoji} {v.label}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>How long?</label>
            <input value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="e.g. Half day" />
          </div>
        </>
      ) : (
        <>
          <div className="field">
            <label>Cuisine</label>
            <input value={cuisine} onChange={(e) => setCuisine(e.target.value)} placeholder="e.g. Shawarma" />
          </div>
          <div className="field">
            <label>Neighborhood</label>
            <input value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} placeholder="e.g. Abdoun" />
          </div>
          <div className="field">
            <label>Price</label>
            <select value={price} onChange={(e) => setPrice(Number(e.target.value) as PriceTier)}>
              <option value={1}>JD — cheap & glorious</option>
              <option value={2}>JD JD — casual night out</option>
              <option value={3}>JD JD JD — special occasion</option>
            </select>
          </div>
          <div className="field">
            <label style={{ display: 'flex', gap: 8, alignItems: 'center', cursor: 'pointer' }}>
              <input type="checkbox" checked={orderIn} onChange={(e) => setOrderIn(e.target.checked)} />
              Delivers (order-in friendly)
            </label>
          </div>
        </>
      )}
      <div className="field">
        <label>Notes</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
      </div>
      <div className="modal-actions">
        <button className="btn ghost" onClick={onClose}>Cancel</button>
        <button className="btn" onClick={save} disabled={!title.trim()}>Add</button>
      </div>
    </Modal>
  )
}
