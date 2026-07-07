import { describe, expect, it } from "vitest";
import type { CalculatorState } from "@/types";
import {
  CORNISH_CURVE,
  RANGER_CURVE,
  buildDailyCurve,
  computeResults,
} from "./calculations";

function baseState(overrides: Partial<CalculatorState> = {}): CalculatorState {
  return {
    chicksStarted: 100,
    breed: "cornish",
    arrivalDate: "2026-06-09",
    processingAgeDays: 56,
    feedCostPerBag: 24,
    bagSize: 50,
    mortalityPct: 5,
    targetLiveWeight: 6.0,
    dressedYieldPct: 72,
    fcr: 3.2,
    chickCost: 3.5,
    processingCostPerBird: 4.0,
    packagingCostPerBird: 0.75,
    miscCostPerBird: 0.5,
    retailPricePerLb: 6.5,
    wholesalePricePerLb: 4.5,
    birdsSoldRetail: 95,
    birdsSoldWholesale: 0,
    laborHours: 40,
    targetWage: 20,
    includeSales: true,
    includeLabor: true,
    ...overrides,
  };
}

describe("feed", () => {
  it("total feed = survivingBirds * targetLiveWeight * fcr", () => {
    const r = computeResults(baseState(), 28);
    // 100 chicks, 5% mortality, 6.0 lb, FCR 3.2 → 95 × 6.0 × 3.2 = 1,824 lb
    expect(r.survivingBirds).toBeCloseTo(95, 10);
    expect(r.totalFeedLb).toBeCloseTo(1824, 6);
  });

  it("feed bags round up", () => {
    const r = computeResults(baseState(), 28);
    expect(r.feedBags).toBe(Math.ceil(1824 / 50)); // 37
    expect(r.feedBags).toBe(37);
    expect(r.feedCost).toBeCloseTo(37 * 24, 6);
  });
});

describe("revenue and break-even", () => {
  it("revenue is computed by bird count at retail", () => {
    const r = computeResults(baseState(), 28);
    // 95 retail × (6.0 × 0.72) dressed lb × $6.50
    expect(r.dressedWeightPerBird).toBeCloseTo(4.32, 10);
    expect(r.revenue).toBeCloseTo(95 * 4.32 * 6.5, 6);
  });

  it("break-even price = totalCost / totalDressedWeight", () => {
    const r = computeResults(baseState(), 28);
    expect(r.breakEvenPricePerLb).toBeCloseTo(
      r.totalCost / r.totalDressedWeight,
      10
    );
    expect(r.totalDressedWeight).toBeCloseTo(95 * 4.32, 6);
  });

  it("retail + wholesale caps at surviving birds; unsold birds earn nothing", () => {
    const r = computeResults(
      baseState({ birdsSoldRetail: 80, birdsSoldWholesale: 40 }),
      28
    );
    // 95 surviving → 80 retail, wholesale capped to 15
    expect(r.soldRetail).toBeCloseTo(80, 10);
    expect(r.soldWholesale).toBeCloseTo(15, 10);
    expect(r.revenue).toBeCloseTo(80 * 4.32 * 6.5 + 15 * 4.32 * 4.5, 6);

    const unsold = computeResults(
      baseState({ birdsSoldRetail: 50, birdsSoldWholesale: 0 }),
      28
    );
    expect(unsold.revenue).toBeCloseTo(50 * 4.32 * 6.5, 6);
  });
});

describe("include toggles", () => {
  it("sales off → revenue 0 and cost-only outputs", () => {
    const r = computeResults(baseState({ includeSales: false }), 28);
    expect(r.revenue).toBe(0);
    expect(r.profit).toBeCloseTo(-r.totalCost, 10);
    expect(r.costPerBird).toBeCloseTo(r.totalCost / r.survivingBirds, 10);
    expect(r.costPerDressedLb).toBeCloseTo(r.breakEvenPricePerLb, 10);
  });

  it("labor off → labor removed from total cost", () => {
    const withLabor = computeResults(baseState(), 28);
    const withoutLabor = computeResults(
      baseState({ includeLabor: false }),
      28
    );
    expect(withoutLabor.laborCostTotal).toBe(0);
    expect(withLabor.totalCost - withoutLabor.totalCost).toBeCloseTo(
      40 * 20,
      6
    );
    const laborCategory = withoutLabor.costCategories.find(
      (c) => c.key === "labor"
    )!;
    expect(laborCategory.value).toBe(0);
  });
});

describe("daily feed curve", () => {
  const totals = { cornish: CORNISH_CURVE, ranger: RANGER_CURVE };
  for (const [breed, curve] of Object.entries(totals)) {
    for (const days of [49, 56, 63, 77, 84]) {
      it(`${breed} curve sums to total feed at ${days} days`, () => {
        const daily = buildDailyCurve(curve, days, 1824);
        expect(daily).toHaveLength(days);
        const sum = daily.reduce((a, b) => a + b, 0);
        expect(sum).toBeCloseTo(1824, 6);
        expect(daily.every((v) => v >= 0)).toBe(true);
      });
    }
  }

  it("curve is back-loaded: final week ration beats week one", () => {
    const daily = buildDailyCurve(CORNISH_CURVE, 56, 1824);
    expect(daily[55]).toBeGreaterThan(daily[0] * 3);
  });

  it("todayRation reads the daily curve; past processing age it is 0", () => {
    const mid = computeResults(baseState(), 28);
    expect(mid.todayRation).toBeCloseTo(mid.daily[27], 10);
    const past = computeResults(baseState(), 60);
    expect(past.todayRation).toBe(0);
    const dayZero = computeResults(baseState(), 0);
    expect(dayZero.todayRation).toBeCloseTo(dayZero.daily[0], 10);
  });
});

describe("weekly table", () => {
  it("weekly rows cover every day and cumulative feed equals total", () => {
    const r = computeResults(baseState(), 28);
    expect(r.weeklyRows).toHaveLength(8);
    const last = r.weeklyRows[r.weeklyRows.length - 1];
    expect(last.endDay).toBe(56);
    expect(last.cumFeed).toBeCloseTo(r.totalFeedLb, 6);
    expect(last.cumCost).toBeCloseTo(r.totalFeedLb * r.feedCostPerLb, 6);
  });

  it("partial final week is handled (off-default processing age)", () => {
    const r = computeResults(baseState({ processingAgeDays: 60 }), 28);
    expect(r.weeklyRows).toHaveLength(9);
    const last = r.weeklyRows[8];
    expect(last.startDay).toBe(57);
    expect(last.endDay).toBe(60);
    expect(last.cumFeed).toBeCloseTo(r.totalFeedLb, 6);
  });
});

describe("clamping", () => {
  it("clamps mortality, yield, fcr, and processing age", () => {
    const r = computeResults(
      baseState({
        mortalityPct: 90, // → 50
        dressedYieldPct: 95, // → 80
        fcr: 9, // → 6
        processingAgeDays: 300, // → 120
      }),
      28
    );
    expect(r.survivingBirds).toBeCloseTo(50, 10);
    expect(r.dressedWeightPerBird).toBeCloseTo(6 * 0.8, 10);
    expect(r.totalFeedLb).toBeCloseTo(50 * 6 * 6, 6);
    expect(r.processingAge).toBe(120);
    expect(r.daily).toHaveLength(120);
  });

  it("treats empty inputs as zero without NaN leaks", () => {
    const r = computeResults(
      baseState({ chicksStarted: "", feedCostPerBag: "" }),
      28
    );
    expect(r.totalFeedLb).toBe(0);
    expect(Number.isFinite(r.totalCost)).toBe(true);
    expect(Number.isFinite(r.breakEvenPricePerLb)).toBe(true);
  });
});
