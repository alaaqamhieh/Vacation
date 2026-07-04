# Amman 2026 — Alaa & Bissan ✈️🇯🇴

An animated welcome site and trip planner for **Alaa & Bissan's vacation to Amman, Jordan** —
**July 23 – August 4, 2026** — built around the trip's centerpiece: 💍 **Bissan's cousin's wedding on August 2**.

## What it does

- **Countdown hero** — live days/hours/minutes/seconds to departure, plus a countdown chip to the wedding
- **Two itinerary views** — a day-by-day timeline and a calendar grid, toggleable, backed by the same plan
- **Drag & drop planning** — drag any restaurant or activity onto a day (or tap ➕ Plan on any card); drag items between days to reshuffle
- **Pinned milestones** — the flights and the wedding ship pre-booked on the calendar with gold shimmer styling and a confirmation prompt before removal; add your own important dates too
- **🍽️ The food list** — a curated guide to Amman's food scene (plus Petra/Jerash/Aqaba stops): shortlist favorites ❤️, mark them ✓ tried, filter by price / order-in friendly, and schedule them as lunch or dinner
- **🏜️ Activity library** — ~35 curated things to do across all of Jordan, filterable by category and region, searchable
- **📆 .ics export** — download the whole plan and import it into a phone calendar
- **🧳 Packing checklist & 🧭 trip essentials** — currency, weather, phrases, plugs, tipping
- **Dark/light theme**, fully responsive, animated throughout (and quiet under `prefers-reduced-motion`)

## Privacy

No backend, no accounts, no analytics, no external API calls. The plan, shortlist, and checklist live in this
browser's `localStorage` — nothing leaves the device.

## Develop

```bash
npm install
npm run dev      # local dev server
npm run build    # type-check + production build to dist/
npm run lint     # oxlint
```

Node 18+ required. All trip facts (names, dates, the wedding) live in `src/config.ts`; the curated
activities, restaurants, and pinned events live in `src/data.ts`.

## Deploy

Pushes to the deploy branches trigger `.github/workflows/deploy.yml`, which builds the site and publishes
`dist/` to **GitHub Pages**.

> **One-time setup:** in the repo's *Settings → Pages*, set the source to **GitHub Actions**.
