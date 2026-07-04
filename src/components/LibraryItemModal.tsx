import { useState } from 'react'
import Modal from './Modal'
import { CATEGORY_META, REGION_META, type Activity, type Category, type PriceTier, type Region, type Restaurant } from '../types'

interface Props {
  kind: 'activity' | 'restaurant'
  onSaveActivity: (a: Activity) => void
  onSaveRestaurant: (r: Restaurant) => void
  onClose: () => void
}

/** Add your own activity or restaurant to the library. */
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

  const save = () => {
    if (!title.trim()) return
    const id = `custom-${kind}-${Date.now()}`
    if (kind === 'activity') {
      onSaveActivity({
        id, title: title.trim(), emoji, category, region, duration,
        description: description.trim() || 'Our own idea.', custom: true,
      })
    } else {
      onSaveRestaurant({
        id, name: title.trim(), emoji, cuisine: cuisine.trim() || 'To try', neighborhood: neighborhood.trim() || 'Amman',
        region, vibe: 'Our pick', price, signature: description.trim() || 'TBD', orderIn,
        description: description.trim() || 'Recommended to us — let’s try it.', custom: true,
      })
    }
  }

  return (
    <Modal onClose={onClose}>
      <h3>{kind === 'restaurant' ? '🍽️ Add a restaurant' : '✨ Add an activity'}</h3>
      <div className="field">
        <label>{kind === 'restaurant' ? 'Name' : 'Title'}</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} autoFocus />
      </div>
      <div className="field">
        <label>Emoji</label>
        <input value={emoji} onChange={(e) => setEmoji(e.target.value)} maxLength={4} style={{ width: 80 }} />
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
