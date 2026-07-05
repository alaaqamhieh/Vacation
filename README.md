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
- **📆 Calendar subscription** — family phones subscribe once (Apple/Google) and the official itinerary
  stays synced; personal copies downloadable as `.ics`
- **🔗 Share plan** — anyone can edit their own copy and send it to the group as a link
- **Packing checklist, trip essentials, dark mode, animations**

## Data & privacy

The plan, shortlist, and checklist live in each visitor's browser (`localStorage`) — no accounts, no
analytics, no backend. The only external calls are OpenStreetMap tiles for the trip map and links out to
Google Maps/Calendar. Trip facts (names, dates) live in `src/config.ts`; all curated places in `src/data.ts`.

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
