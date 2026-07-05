import { useState } from 'react'
import Modal from './Modal'
import { ICS_URL, WEBCAL_URL } from '../config'

interface Props {
  onDownload: () => void
  onClose: () => void
}

const GOOGLE_URL = `https://calendar.google.com/calendar/r?cid=${encodeURIComponent(WEBCAL_URL)}`

export default function SubscribeModal({ onDownload, onClose }: Props) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(ICS_URL)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      window.prompt('Copy the calendar link:', ICS_URL)
    }
  }

  return (
    <Modal onClose={onClose}>
      <h3>📆 The trip calendar</h3>
      <p style={{ color: 'var(--text-soft)', margin: '6px 0 0', fontSize: '0.9rem' }}>
        Subscribe once and the official itinerary stays up to date on your phone — flights, the wedding, and the
        family plan.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 18 }}>
        <a className="btn" href={WEBCAL_URL} style={{ justifyContent: 'center' }}>
           iPhone / Apple Calendar
        </a>
        <a className="btn" href={GOOGLE_URL} target="_blank" rel="noreferrer" style={{ justifyContent: 'center' }}>
          🗓️ Google Calendar
        </a>
        <button className="btn ghost" onClick={copy} style={{ justifyContent: 'center' }}>
          {copied ? '✓ Copied!' : '🔗 Copy calendar link'}
        </button>
      </div>
      <p style={{ color: 'var(--text-soft)', fontSize: '0.8rem', marginTop: 16 }}>
        Subscriptions follow the shared family plan. Your personal edits on this device aren't included — for those,{' '}
        <button
          onClick={() => { onDownload(); onClose() }}
          style={{ border: 'none', background: 'none', color: 'var(--accent)', fontWeight: 700, cursor: 'pointer', padding: 0, font: 'inherit', fontSize: '0.8rem' }}
        >
          download your own copy (.ics)
        </button>
        .
      </p>
      <div className="modal-actions">
        <button className="btn ghost" onClick={onClose}>Close</button>
      </div>
    </Modal>
  )
}
