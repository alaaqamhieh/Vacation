# Adam & Leen Wedding — Amman 2026 💍🇯🇴

The family site for **Adam & Leen's wedding in Amman, Jordan (August 2, 2026)** and the trip around it
(**July 23 – August 4, 2026**), hosted by Alaa & Bissan. Live at
**https://alaaqamhieh.github.io/Vacation/**

## What it does

- **Wedding countdown hero** — live countdown to August 2, with the trip dates below
- **Two itinerary views** — a day-by-day timeline and a real Monday–Sunday week calendar; drag & drop
  restaurants/activities onto days (breakfast, lunch, or dinner slots for food)
- **✎ Editable events** — rename, move, or annotate anything; the flights and wedding ship pre-pinned
- **🍽️ The food list** — 30 curated spots with **popularity stars**, **👨‍👩‍👧 family pick** badges, shortlist
  hearts, tried-it tracking, price/order-in filters, and search
- **🏜️ Things to do across Jordan** — filterable by category and region, with popularity ratings
- **🗺️ Trip map** — every spot pinned on an interactive map, plus a 📍 Google Maps button on each card
- **🔎 Add from Google** — search Google Places by name and import a restaurant/activity with its cuisine,
  neighborhood, price, coordinates, and a fitting emoji
- **📆 Calendar subscription** — family phones subscribe once (Apple/Google) and the official itinerary
  stays synced; personal copies downloadable as `.ics`
- **🔗 Share plan** — anyone can edit their own copy and send it to the group as a link
- **Packing checklist, trip essentials, dark mode, animations**

## Data & privacy

By default the plan, shortlist, and checklist live in each visitor's browser (`localStorage`) — no accounts,
no backend. External calls: OpenStreetMap tiles for the map, the Google Places API for search (key is
referrer-restricted to this site), and links out to Google Maps/Calendar. Trip facts live in
`src/config.ts`; curated places in `src/data.ts`.

## Turn on shared family sync (optional)

To make everyone edit **one shared plan** (add a restaurant → the whole family sees it):

1. Create a free **Firebase** project → **Build → Realtime Database → Create database** (test mode is fine
   for a family; the URL is semi-public).
2. Copy the database URL (e.g. `https://your-db.firebaseio.com`).
3. Set `SHARED_DB_URL` in `src/config.ts` to `https://your-db.firebaseio.com/plan` and redeploy.

Sync is last-write-wins and polls every ~10 s. With `SHARED_DB_URL` empty it stays fully local.

## Develop

```bash
npm install
npm run dev      # local dev server
npm run build    # regenerates public/itinerary.ics, type-checks, builds dist/
npm run lint     # oxlint
```

Node 18+ required.

## Deploy

Pushes to the deploy branches trigger `.github/workflows/deploy.yml` → GitHub Pages. The build also
regenerates `public/itinerary.ics`, so calendar subscriptions pick up itinerary changes automatically.

> **One-time setup (done):** repo *Settings → Pages* → source **GitHub Actions**.
