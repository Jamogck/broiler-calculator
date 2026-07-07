# Handoff: Pastured Broiler Feed & Profit Calculator

## Overview
A single-page, client-side calculator for pastured broiler producers. The user enters only what they know (chick count, breed, processing age, feed price) and the tool fills in smart defaults to estimate feed volume, cost, a daily-ration curve, and profitability. It is designed to feel practical and farm-useful, not academic — and to work equally well for market growers and homesteaders raising birds for their own table.

The design leads with **feed volume** (how much feed, what it costs, how much today) as the visual hero; profitability is secondary.

## About the Design Files
The file in this bundle — `Broiler Calculator.dc.html` — is a **design reference created in HTML**. It is a working prototype showing the intended look, layout, copy, and calculation behavior. It is **not** production code to ship directly.

The original request specified a **Next.js + React + TypeScript** app. The task is to recreate this design and its logic in that stack (or the team's preferred stack), using the target codebase's established patterns, component conventions, charting library, and styling approach. All calculations are client-side; no backend is required for v1.

> Note on the prototype's format: the HTML file is authored as a "Design Component" with a small custom template runtime (`{{ }}` holes, `<sc-for>`, `<sc-if>`) and a `class Component` logic block. **Ignore that runtime.** Read it only as a reference implementation — the formulas in the logic class are the source of truth. Reimplement with normal React state/props and standard JSX.

## Fidelity
**High-fidelity.** Colors, typography, spacing, layout hierarchy, copy, and all calculations are final and should be recreated faithfully. Exact tokens are listed below. The daily-ration line chart and the cost-breakdown stacked bar are drawn manually in the prototype (inline SVG / flex divs) — reimplement these with the codebase's charting library (e.g. Recharts, visx) or keep them as lightweight SVG; match the visual intent, not the exact SVG markup.

---

## Suggested file structure (from original spec)
```
/app/page.tsx
/components/Calculator.tsx
/components/InputSection.tsx
/components/OutputCards.tsx
/components/WeeklyFeedTable.tsx
/components/RationChart.tsx
/components/CostBreakdown.tsx
/lib/defaults.ts
/lib/calculations.ts
/lib/urlState.ts
/types.ts
```

---

## Layout

Overall: centered container, `max-width: 1200px`, page padding `26px 20px 64px`.

1. **Header row** (flex, space-between, wraps): left = eyebrow ("PASTURED POULTRY · FIELD TOOL") + `<h1>` title + one-line description (max-width 560px). Right = primary "Copy scenario link" button.
2. **Live summary sentence**: full-width card, left accent border (4px). Holds one plain-English sentence (see Copy). Accent color = green when profitable / for homestead mode, red when losing money.
3. **Two-column body** (flex, `flex-wrap: wrap`, gap `22px`, align-items flex-start):
   - **Left = Inputs** (`flex: 1 1 350px; max-width: 430px; min-width: 300px`). Four stacked section cards: Quick Estimate, Assumptions, Sales, Labor.
   - **Right = Outputs** (`flex: 999 1 560px; min-width: 320px`). Feed hero, then economics, then weekly table, then cost breakdown.
4. **Footer disclaimer**: small centered muted text about estimates.

The two columns wrap to a single stacked column on narrow screens purely via flex-basis (no media queries in the prototype — a real build can use proper breakpoints).

### Input section cards
Each is a card (`background #fffdf9; border 1px solid #e5e1d7; border-radius 10px; padding 16px`). Section heading is monospace, uppercase, letter-spacing `.08em`, `12px`, green (`oklch(0.5 0.05 150)`).

Each input row: flex, space-between, `padding: 8px 0`, `border-bottom: 1px solid #f0ede4`. Label left (13px, `#3f3b33`), control right. Number inputs are right-aligned, `~70–96px` wide, `padding 6px 8px; border 1px solid #d8d3c7; border-radius 6px; font-size 13px`. Currency inputs prefix a muted `$`.

**"typical" reset buttons**: small monospace outline buttons (`10px`, green text, `border 1px solid #e0dccf; border-radius 5px`) next to most Assumptions fields and the processing-age field. Clicking resets that one field to its typical/breed-default value.

**Sales & Labor include toggles**: each of these two section headers has a checkbox on the right labeled "include" (monospace, 11px). Unchecking collapses that section's inputs to a short muted note and removes it from the math (see Behavior). `accent-color` on the checkbox is the green `oklch(0.52 0.09 150)`.

### Feed hero (the focal point)
A prominent panel: `background: linear-gradient(180deg,#f3f7f0,#fffdf9 60%); border: 1px solid oklch(0.83 0.05 150); border-radius: 14px; padding: 22px`.
- **Primary block** (flex 2): eyebrow "FEED TO RAISE THIS FLOCK"; the **total feed** number at `52px / 700 / letter-spacing -0.02em` with a `20px` "lb" suffix; below it a row showing `{bags} × {bagSize} lb bags → {feedCost} in feed` (bags & cost at `26px`, cost in green `oklch(0.44 0.09 150)`).
- **Secondary rail** (flex 1, left border): "FEED TODAY · day {age}" with today's ration at `34px / 700` in amber (`oklch(0.5 0.13 55)`); below a dashed divider, "PEAK DAY" with peak ration at `19px`.
- **Ration chart** tucked below a top divider (see Charts).

### Economics (secondary, quieter)
Section label "THE ECONOMICS" (monospace, muted `#8a8474`) with a right-aligned headline ("Flock profit **$X**" when selling; "Cost to raise **$X**" in homestead mode). Below: a responsive grid of small cards (`minmax(140px,1fr)`, gap 10px), values at `19px`, muted card style (`border #e8e4da`). When selling: Revenue, Total cost, Break-even/lb, Profit/bird, Flock profit. In homestead mode (Sales off): Total cost, Cost/bird, Cost/dressed lb.

### Weekly feed table
Card with an `overflow-x: auto` wrapper (min-width 520px table). Monospace uppercase column headers. Columns: Wk, Age (days), Birds, Feed/day, Feed/wk, Bags/wk, Cum. feed, Cum. cost. Right-aligned numeric cells, `font-variant-numeric: tabular-nums`, `12.5px`. Week number in green.

### Cost breakdown
Card. A single horizontal stacked bar (`height 26px; border-radius 6px; overflow hidden`) with one colored segment per cost category, widths = % of total. Below, a legend table: color swatch, label, percent (monospace), dollar amount, then a bold Total row. Zero-value categories are hidden.

---

## Interactions & Behavior

- **Everything recomputes live** on any input change. No submit button.
- **Breed select** (Cornish Cross / Red Ranger–Freedom Ranger / Custom): choosing Cornish or Ranger applies that breed's defaults to processing age, mortality, target live weight, dressed yield, and FCR. Editing any of those five fields flips the breed to "Custom." Custom keeps current values and lets everything be edited.
- **Arrival date ↔ current age stay in sync.** Editing the date recomputes current age = today − arrival; editing current age back-computes arrival = today − age.
- **"typical" buttons** reset a single field to its default (breed default for the five breed fields, otherwise the typical constant).
- **Sales include toggle OFF** → revenue = 0; economics switches to the cost-only view; summary sentence reframes for homestead use.
- **Labor include toggle OFF** → labor cost = 0 (drops from total cost and from the cost breakdown).
- **Copy scenario link** button serializes all inputs to URL query params and copies the full URL to the clipboard; button label briefly changes to "Copied ✓" for ~1.7s.
- On load, the app reads query params and overrides defaults so a shared link restores the exact scenario.

### Validation / clamping
Clamp on compute (prevent nonsense output); inputs also carry `min`/`max` attributes as hints.
- No negative numbers anywhere.
- Mortality: 0–50%.
- Dressed yield: 50–80%.
- FCR: 2.0–6.0.
- Processing age: 35–120 days.
- Birds sold at retail + wholesale is capped at surviving birds (wholesale count is capped to whatever's left after retail).

---

## State Management
All state is client-side and mirrored to the URL. State fields (all serialized to query params):

`chicksStarted, breed, arrivalDate (YYYY-MM-DD), processingAgeDays, feedCostPerBag, bagSize, mortalityPct, targetLiveWeight, dressedYieldPct, fcr, chickCost, processingCostPerBird, packagingCostPerBird, miscCostPerBird, retailPricePerLb, wholesalePricePerLb, birdsSoldRetail, birdsSoldWholesale, laborHours, targetWage, includeSales (bool), includeLabor (bool)`

`currentAgeDays` is **derived** from `arrivalDate` and today — not stored. Percentages are stored as whole numbers (e.g. `mortalityPct: 5`, `dressedYieldPct: 72`) and divided by 100 in the math.

URL helpers (`/lib/urlState.ts`): `serialize(state) → query string` and `parse(searchParams) → Partial<State>`. Booleans serialize as `"true"`/`"false"`.

---

## Default scenario (loads populated — never an empty form)
```
chicksStarted:         100
breed:                 "cornish"
arrivalDate:           today − 28 days   (so current age = 28 by default)
processingAgeDays:     56
feedCostPerBag:        24      // dollars
bagSize:               50      // lb
mortalityPct:          5
targetLiveWeight:      6.0     // lb
dressedYieldPct:       72
fcr:                   3.2
chickCost:             3.50    // per chick
processingCostPerBird: 4.00
packagingCostPerBird:  0.75
miscCostPerBird:       0.50
retailPricePerLb:      6.50
wholesalePricePerLb:   4.50
birdsSoldRetail:       95
birdsSoldWholesale:    0
laborHours:            40
targetWage:            20      // $/hr
includeSales:          true
includeLabor:          true
```

### Breed defaults (`/lib/defaults.ts`)
```
Cornish Cross:  { processingAgeDays: 56, mortalityPct: 5, targetLiveWeight: 6.0, dressedYieldPct: 72, fcr: 3.2 }
Ranger:         { processingAgeDays: 77, mortalityPct: 5, targetLiveWeight: 5.8, dressedYieldPct: 70, fcr: 4.1 }
Custom:         uses current values; all fields editable
```
Typical constants for the "typical" reset buttons on non-breed fields:
```
feedCostPerBag: 24, bagSize: 50, chickCost: 3.50, processingCostPerBird: 4.00,
packagingCostPerBird: 0.75, miscCostPerBird: 0.50, retailPricePerLb: 6.50,
wholesalePricePerLb: 4.50, laborHours: 40, targetWage: 20
```

---

## Calculations (`/lib/calculations.ts`) — source of truth

All rates below are the fractional forms (`mortalityRate = mortalityPct/100`, `dressedYield = dressedYieldPct/100`). Clamp inputs to the validation ranges before computing.

### Feed
```
survivingBirds   = chicksStarted * (1 - mortalityRate)
totalFeedLb      = survivingBirds * targetLiveWeight * fcr
feedBags         = ceil(totalFeedLb / bagSize)
feedCost         = feedBags * feedCostPerBag
feedCostPerLb    = feedCostPerBag / bagSize
```

### Dressed weight
```
dressedWeightPerBird = targetLiveWeight * dressedYield
totalDressedWeight   = survivingBirds * dressedWeightPerBird
```

### Sales (retail-first, by bird count — NOT percentages)
```
soldRetail    = min(birdsSoldRetail, survivingBirds)
soldWholesale = min(birdsSoldWholesale, max(0, survivingBirds - soldRetail))
revenue       = includeSales
                ? soldRetail    * dressedWeightPerBird * retailPricePerLb
                + soldWholesale * dressedWeightPerBird * wholesalePricePerLb
                : 0
```
(Birds not sold are simply not counted as income.)

### Costs
```
chickCostTotal      = chicksStarted  * chickCost
processingCostTotal = survivingBirds * processingCostPerBird
packagingCostTotal  = survivingBirds * packagingCostPerBird
miscCostTotal       = survivingBirds * miscCostPerBird
laborCostTotal      = includeLabor ? (laborHours * targetWage) : 0
totalCost = feedCost + chickCostTotal + processingCostTotal
          + packagingCostTotal + miscCostTotal + laborCostTotal
```

### Results
```
profit                = revenue - totalCost
profitPerBird         = survivingBirds > 0 ? profit / survivingBirds : 0
breakEvenPricePerLb   = totalDressedWeight > 0 ? totalCost / totalDressedWeight : 0
costPerBird           = survivingBirds > 0 ? totalCost / survivingBirds : 0   // homestead view
costPerDressedLb      = breakEvenPricePerLb                                   // homestead view
laborEarnedPerHour    = laborHours > 0 ? (profit + laborCostTotal) / laborHours : 0
```

### Daily ration curve — back-loaded, NOT averaged
Feed need rises sharply in the final weeks. Do not divide feed evenly.

Weekly distribution percentages by breed (Custom uses the Cornish curve):
```
Cornish (8 wk): [3, 7, 10, 13, 16, 18, 17, 16]
Ranger (11 wk): [2, 4, 6, 8, 10, 11, 12, 12, 12, 12, 11]
```

Build a daily array of length `processingAgeDays` that sums exactly to `totalFeedLb`, scaling the curve shape across whatever processing age is chosen:
1. Normalize the weekly curve to a cumulative distribution over `[0,1]`: `cum[0]=0`, `cum[i]=cum[i-1]+week[i]`, then divide all by the final total so `cum` runs 0→1 across `weeks` points.
2. `cumFrac(t)` for `t ∈ [0,1]`: map `x = t * weeks`, linearly interpolate between `cum[floor(x)]` and `cum[floor(x)+1]`. Clamp to 0/1 at the ends.
3. For each day `d = 1..processingAgeDays`:
   `daily[d-1] = (cumFrac(d/processingAgeDays) − cumFrac((d-1)/processingAgeDays)) * totalFeedLb`

Derived ration figures:
```
peakRation           = max(daily)
averageDailyRation   = totalFeedLb / processingAgeDays   // shown for reference only; do NOT use to plan
finalWeekDailyRation = average of the last 7 daily values
todayRation          = daily[currentAgeDays - 1] when 1 ≤ currentAgeDays ≤ processingAgeDays;
                       0 if past processing age; daily[0] if age 0
```

### Weekly table rows
For each week `w = 1..ceil(processingAgeDays/7)`:
```
startDay   = (w-1)*7 + 1
endDay     = min(w*7, processingAgeDays)
days       = endDay - startDay + 1
feedWeek   = sum of daily[startDay-1 .. endDay-1]
feedPerDay = feedWeek / days
bagsWeek   = feedWeek / bagSize                    // shown to 1 decimal
birdsAlive = chicksStarted - (chicksStarted - survivingBirds) * (endDay / processingAgeDays)  // linear decline
cumFeed    = running sum of feedWeek
cumCost    = cumFeed * feedCostPerLb
```

---

## Charts

**Ration line chart** (in the feed hero): x-axis = day 1..processingAgeDays with weekly tick labels ("w1", "w2"…); y-axis = lb/day with min/mid/max gridlines. Green line (`oklch(0.52 0.09 150)`) with a soft filled area beneath (`oklch(0.52 0.09 150 / 0.13)`). A dashed amber vertical line + dot marks **today** (`currentAgeDays`) with a "today" label. Caption: "Don't average this — feed need rises sharply in the final weeks. The dashed line marks today."

**Cost breakdown stacked bar + legend** categories and colors:
```
Feed        oklch(0.52 0.09 150)   (green)
Chicks      oklch(0.66 0.11 90)    (yellow-green)
Processing  oklch(0.62 0.12 40)    (terracotta)
Packaging   oklch(0.6 0.08 300)    (muted violet)
Misc        oklch(0.7 0.04 250)    (grey-blue)
Labor       oklch(0.5 0.07 220)    (slate blue)
```
Each segment width = category / totalCost. Hide any zero-value category.

---

## Copy (exact strings)

Live summary sentence (updates on every change):
- **Profitable:** "At these numbers, you need `{totalFeedLb}` lb of feed, or `{feedBags}` bags. The flock makes `{profit}` total, about `{profitPerBird}` per bird, with a break-even price of `{breakEven}`/lb dressed."
- **Losing money:** "At these numbers, this flock loses `{|profit|}`. You need at least `{breakEven}`/lb dressed weight to break even."
- **Homestead (Sales off):** "At these numbers, you need `{totalFeedLb}` lb of feed, or `{feedBags}` bags, and about `{totalCost}` to raise the flock — roughly `{costPerBird}` per bird, or `{costPerDressedLb}` per dressed lb."

Helper texts:
- **FCR:** "Lower is better. 3.0 is excellent, 3.5 is common, 4.0+ means something may be off."
- **Dressed yield:** "Dressed weight is usually about 70–72% of live weight."
- **Ration chart:** "Don't average this — feed need rises sharply in the final weeks. The dashed line marks today."
- **Mortality:** "5% is a fair plan. Allowed range 0–50%."
- **Birds sold at retail:** "You'll have about `{survivingBirds}` birds to sell after mortality. Any you keep just aren't counted as income."
- **Labor:** "At the profit above, your labor actually earns `{laborEarnedPerHour}`/hr."

Number formatting: thousands separators; feed lb rounded to whole; rations to 1 decimal; money to whole dollars on cards (`$1,234`) and 2 decimals for per-unit values (`$6.50`). Negative money uses a minus sign, e.g. `−$120`.

---

## Design Tokens

### Color (warm neutral base + green accent + amber/red signals)
```
Page background        #f4f2ec
Card / panel           #fffdf9
Muted panel border     #e5e1d7  (softer variant #e8e4da)
Hairline divider       #f0ede4
Ink (headings/values)  #26241f
Body text              #3f3b33
Secondary text         #736d61
Muted / captions       #8a8474  (lighter #a39c8d, #9a9384)
Input border           #d8d3c7

Green accent           oklch(0.52 0.09 150)     // buttons, chart line, section headings
Green accent (dark)    oklch(0.44 0.09 150)     // link hover, cost emphasis
Green accent (deep)    oklch(0.46 0.11 150)     // positive profit text
Hero panel border      oklch(0.83 0.05 150)
Profit card bg (pos)   oklch(0.97 0.02 150), border oklch(0.85 0.05 150)

Amber (today / peak)   oklch(0.5 0.13 55)  /  label oklch(0.55 0.13 55)  /  marker oklch(0.6 0.13 55)
Red (loss)             oklch(0.53 0.16 27)  /  summary accent oklch(0.55 0.15 27)
Loss card bg           oklch(0.97 0.03 30), border oklch(0.85 0.07 30)
```

### Typography
- **Sans:** "IBM Plex Sans" (Google Fonts), weights 400/500/600/700 — all UI text.
- **Mono:** "IBM Plex Mono" (Google Fonts), weights 400/500 — eyebrows, section headings, table headers, unit labels, numeric captions.
- Numeric values use `font-variant-numeric: tabular-nums`.
- Notable sizes: h1 `29px/700`; hero total-feed `52px/700` (letter-spacing −0.02em); today ration `34px/700`; card values `19px`/`23px/600`; body `13–14px`; captions/eyebrows `10.5–11px`.

### Radius / spacing / misc
```
Radius:  inputs & swatches 5–6px · cards 9–10px · feed hero 14px
Gaps:    column gap 22px · card grids 10–11px · input row padding 8px 0
Borders: 1px solid on cards/inputs; hero uses a tinted green border; 4px left accent on the summary card
Focus:   inputs → outline 2px oklch(0.72 0.09 150 / 0.5)
```
No drop shadows are used — separation is by border and background tint. Keep it flat and utilitarian.

---

## Testing (from original spec)
Add unit tests (Jest/Vitest) for `/lib/calculations.ts`:
- **total feed** = `survivingBirds * targetLiveWeight * fcr` (e.g. 100 chicks, 5% mortality, 6.0 lb, FCR 3.2 → 95 × 6.0 × 3.2 = 1,824 lb).
- **feed bags** rounds up (`ceil(totalFeedLb / bagSize)`; e.g. 1,824 / 50 → 37 bags).
- **revenue** by bird count (e.g. 95 sold retail × (6.0×0.72) dressed lb × $6.50 → check total).
- **break-even price** = `totalCost / totalDressedWeight`.
- **feed curve sums to totalFeedLb** for both breeds and for off-default processing ages (e.g. 49, 63, 84 days) — within a small epsilon.
- **bird-count sales behavior**: retail + wholesale caps at surviving birds; unsold birds contribute no revenue.
- **include toggles**: sales off → revenue 0 and cost-only outputs; labor off → labor removed from total cost.

## Assets
No image assets. Fonts load from Google Fonts (IBM Plex Sans, IBM Plex Mono). Charts are drawn from data (no static images). The prototype draws them as inline SVG / flex divs — swap for the codebase's charting approach.

## Files
- `Broiler Calculator.dc.html` — the full high-fidelity prototype (reference implementation of layout, copy, and every formula above). Read the `class Component` block for the exact calculation code; ignore the custom template runtime and reimplement in React/TSX.
