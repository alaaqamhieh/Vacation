import { useState } from 'react'

const EMOJI = [
  '🎉', '💍', '🥳', '🎊', '💃', '🕺', '👗', '💄', '🧖', '🎁',
  '📸', '🍽️', '🍰', '☕', '🧆', '🏛️', '🕌', '🏜️', '🌊', '🏖️',
  '⛺', '🎈', '✈️', '🚗', '🛍️', '👨‍👩‍👧', '🎶', '🌙', '❤️', '📌',
]

interface Props {
  value: string
  onChange: (emoji: string) => void
}

/** Tappable emoji grid with a free-text fallback for anything not listed. */
export default function EmojiPicker({ value, onChange }: Props) {
  const [showOther, setShowOther] = useState(() => !EMOJI.includes(value))

  return (
    <div>
      <div className="emoji-grid" role="radiogroup" aria-label="Pick an emoji">
        {EMOJI.map((e) => (
          <button
            key={e}
            type="button"
            role="radio"
            aria-checked={value === e}
            className={`emoji-opt${value === e ? ' on' : ''}`}
            onClick={() => {
              onChange(e)
              setShowOther(false)
            }}
          >
            {e}
          </button>
        ))}
        <button
          type="button"
          className={`emoji-opt other${showOther ? ' on' : ''}`}
          onClick={() => setShowOther((v) => !v)}
          aria-label="Type a different emoji"
          title="Something else"
        >
          …
        </button>
      </div>
      {showOther && (
        <input
          className="emoji-other-input"
          value={value}
          maxLength={4}
          placeholder="Any emoji"
          onChange={(e) => onChange(e.target.value)}
          aria-label="Custom emoji"
        />
      )}
    </div>
  )
}
