# Broiler Feed & Profit Calculator

A single-page, client-side calculator for pastured broiler producers. Enter
what you know (chick count, breed, processing age, feed price) and it fills in
smart defaults to estimate feed volume, cost, a daily-ration curve, and
profitability. Built from the design handoff in
`design_handoff_broiler_calculator/`.

Next.js + React + TypeScript, fully static (`output: "export"`) — no backend,
no database. Scenarios are shareable via URL query params.

## Develop

```sh
npm install
npm run dev        # http://localhost:3000
npm test           # unit tests for lib/calculations.ts
```

## Build & deploy

```sh
npm run build      # static site in out/
```

The build is plain static files, so any static host works:

- **Vercel (recommended):** `npx vercel` for a preview, `npx vercel --prod`
  for production. Or connect the repo on vercel.com for deploy-on-push.
- **Cloudflare Pages / Netlify / GitHub Pages:** point the host at the
  `out/` directory (build command `npm run build`, output dir `out`).

## Structure

```
app/page.tsx                  entry (client-only render)
components/Calculator.tsx     state, URL sync, layout
components/InputSection.tsx   the four input cards
components/OutputCards.tsx    feed hero + economics
components/RationChart.tsx    daily ration SVG chart
components/WeeklyFeedTable.tsx
components/CostBreakdown.tsx
lib/calculations.ts           all formulas (source of truth, unit-tested)
lib/defaults.ts               default scenario + breed/typical defaults
lib/urlState.ts               scenario <-> query string
lib/format.ts                 number/money formatting
types.ts
```
