// Generates the shared/subscribable itinerary calendar served at /itinerary.ics.
// Runs at build time (see package.json "build") so every deploy republishes it.
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { buildICS } from '../src/ics'
import { ACTIVITIES, RESTAURANTS, SEED_SCHEDULE } from '../src/data'

const out = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'itinerary.ics')
writeFileSync(out, buildICS(SEED_SCHEDULE, { activities: ACTIVITIES, restaurants: RESTAURANTS }))
console.log(`Wrote ${out}`)
