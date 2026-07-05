import type { Activity, Restaurant, ScheduledItem, TripState } from './types'

/** The slice of state that travels inside a share link. */
export interface SharedPlan {
  scheduled: ScheduledItem[]
  customActivities: Activity[]
  customRestaurants: Restaurant[]
}

function toBase64Url(bytes: Uint8Array): string {
  let bin = ''
  for (const b of bytes) bin += String.fromCharCode(b)
  return btoa(bin).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '')
}

function fromBase64Url(text: string): Uint8Array {
  const bin = atob(text.replaceAll('-', '+').replaceAll('_', '/'))
  return Uint8Array.from(bin, (c) => c.charCodeAt(0))
}

async function pipe(bytes: Uint8Array, stream: CompressionStream | DecompressionStream): Promise<Uint8Array> {
  const piped = new Blob([bytes as BlobPart]).stream().pipeThrough(stream)
  return new Uint8Array(await new Response(piped).arrayBuffer())
}

/** Encode a plan for the URL hash. Prefix marks the encoding: z=deflate, j=plain. */
export async function encodePlan(state: TripState): Promise<string> {
  const payload: SharedPlan = {
    scheduled: state.scheduled,
    customActivities: state.customActivities,
    customRestaurants: state.customRestaurants,
  }
  const raw = new TextEncoder().encode(JSON.stringify(payload))
  if (typeof CompressionStream !== 'undefined') {
    return 'z' + toBase64Url(await pipe(raw, new CompressionStream('deflate-raw')))
  }
  return 'j' + toBase64Url(raw)
}

export async function decodePlan(encoded: string): Promise<SharedPlan | null> {
  try {
    const kind = encoded[0]
    const bytes = fromBase64Url(encoded.slice(1))
    const raw = kind === 'z' ? await pipe(bytes, new DecompressionStream('deflate-raw')) : bytes
    const parsed = JSON.parse(new TextDecoder().decode(raw)) as SharedPlan
    if (!Array.isArray(parsed.scheduled)) return null
    return {
      scheduled: parsed.scheduled,
      customActivities: parsed.customActivities ?? [],
      customRestaurants: parsed.customRestaurants ?? [],
    }
  } catch {
    return null
  }
}

/** Read a shared plan out of the current URL hash, if present. */
export function planFromLocation(): string | null {
  const match = /#plan=([A-Za-z0-9_-]+)/.exec(window.location.hash)
  return match ? match[1] : null
}
