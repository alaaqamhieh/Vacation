import type { Popularity } from '../types'

/** Gold star popularity row, 1–5. */
export default function Stars({ value }: { value?: Popularity }) {
  const v = value ?? 3
  return (
    <span className="stars" title={`Popularity ${v}/5`} aria-label={`Popularity ${v} out of 5`}>
      {'★'.repeat(v)}
      <span className="stars-off">{'★'.repeat(5 - v)}</span>
    </span>
  )
}
