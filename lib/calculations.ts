import type {
  Breed,
  CalculatorState,
  CostCategory,
  NumField,
  Results,
  WeeklyRow,
} from "@/types";

/** Weekly feed distribution (% of total) — back-loaded, not averaged. */
export const CORNISH_CURVE = [3, 7, 10, 13, 16, 18, 17, 16];
export const RANGER_CURVE = [2, 4, 6, 8, 10, 11, 12, 12, 12, 12, 11];

export function num(x: NumField | null | undefined): number {
  const n = Number(x);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

export function clamp(v: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, v));
}

export function curveForBreed(breed: Breed): number[] {
  return breed === "ranger" ? RANGER_CURVE : CORNISH_CURVE;
}

/**
 * Distribute totalFeed across `days` days following the weekly curve shape,
 * scaled to whatever processing age is chosen. Sums exactly to totalFeed.
 */
export function buildDailyCurve(
  curve: number[],
  days: number,
  totalFeed: number
): number[] {
  const weeks = curve.length;
  const cum = [0];
  for (let i = 0; i < weeks; i++) cum.push(cum[cum.length - 1] + curve[i]);
  const tot = cum[weeks];
  for (let i = 0; i <= weeks; i++) cum[i] /= tot;
  const cumFrac = (t: number) => {
    if (t <= 0) return 0;
    if (t >= 1) return 1;
    const x = t * weeks;
    const i = Math.floor(x);
    return cum[i] + (cum[i + 1] - cum[i]) * (x - i);
  };
  const daily: number[] = [];
  for (let d = 1; d <= days; d++) {
    daily.push((cumFrac(d / days) - cumFrac((d - 1) / days)) * totalFeed);
  }
  return daily;
}

export function computeResults(
  state: CalculatorState,
  currentAgeDays: number
): Results {
  const chicks = num(state.chicksStarted);
  const mortalityRate = clamp(num(state.mortalityPct), 0, 50) / 100;
  const targetLiveWeight = num(state.targetLiveWeight);
  const dressedYield = clamp(Number(state.dressedYieldPct) || 0, 50, 80) / 100;
  const fcr = clamp(num(state.fcr), 2, 6);
  const processingAge = Math.round(
    clamp(num(state.processingAgeDays) || 56, 35, 120)
  );
  const bagSize = Math.max(1, num(state.bagSize) || 50);
  const feedCostPerBag = num(state.feedCostPerBag);

  // Feed
  const survivingBirds = chicks * (1 - mortalityRate);
  const totalFeedLb = survivingBirds * targetLiveWeight * fcr;
  const feedBags = Math.ceil(totalFeedLb / bagSize) || 0;
  const feedCost = feedBags * feedCostPerBag;
  const feedCostPerLb = feedCostPerBag / bagSize;

  // Dressed weight
  const dressedWeightPerBird = targetLiveWeight * dressedYield;
  const totalDressedWeight = survivingBirds * dressedWeightPerBird;

  // Sales — retail-first, by bird count
  const includeSales = state.includeSales !== false;
  const soldRetail = Math.min(num(state.birdsSoldRetail), survivingBirds);
  const soldWholesale = Math.min(
    num(state.birdsSoldWholesale),
    Math.max(0, survivingBirds - soldRetail)
  );
  const revenue = includeSales
    ? soldRetail * dressedWeightPerBird * num(state.retailPricePerLb) +
      soldWholesale * dressedWeightPerBird * num(state.wholesalePricePerLb)
    : 0;

  // Costs
  const chickCostTotal = chicks * num(state.chickCost);
  const processingCostTotal = survivingBirds * num(state.processingCostPerBird);
  const packagingCostTotal = survivingBirds * num(state.packagingCostPerBird);
  const miscCostTotal = survivingBirds * num(state.miscCostPerBird);
  const includeLabor = state.includeLabor !== false;
  const laborHours = num(state.laborHours);
  const laborCostTotal = includeLabor ? laborHours * num(state.targetWage) : 0;
  const totalCost =
    feedCost +
    chickCostTotal +
    processingCostTotal +
    packagingCostTotal +
    miscCostTotal +
    laborCostTotal;

  // Results
  const profit = revenue - totalCost;
  const profitPerBird = survivingBirds > 0 ? profit / survivingBirds : 0;
  const breakEvenPricePerLb =
    totalDressedWeight > 0 ? totalCost / totalDressedWeight : 0;
  const costPerBird = survivingBirds > 0 ? totalCost / survivingBirds : 0;
  const costPerDressedLb = breakEvenPricePerLb;
  const laborEarnedPerHour =
    laborHours > 0 ? (profit + laborCostTotal) / laborHours : 0;

  // Daily ration curve
  const daily = buildDailyCurve(
    curveForBreed(state.breed),
    processingAge,
    totalFeedLb
  );
  const peakRation = daily.length ? Math.max(...daily) : 0;
  const averageDailyRation = totalFeedLb / processingAge;
  const finalWeekDailyRation =
    daily.length > 0
      ? daily.slice(-7).reduce((a, b) => a + b, 0) /
        Math.min(7, daily.length)
      : 0;
  let todayRation = 0;
  if (currentAgeDays >= 1 && currentAgeDays <= processingAge) {
    todayRation = daily[currentAgeDays - 1];
  } else if (currentAgeDays > processingAge) {
    todayRation = 0;
  } else if (daily.length) {
    todayRation = daily[0];
  }

  // Weekly table rows
  const weeklyRows: WeeklyRow[] = [];
  let cum = 0;
  const numWeeks = Math.ceil(processingAge / 7);
  for (let w = 1; w <= numWeeks; w++) {
    const startDay = (w - 1) * 7 + 1;
    const endDay = Math.min(w * 7, processingAge);
    const days = endDay - startDay + 1;
    let feedWeek = 0;
    for (let d = startDay; d <= endDay; d++) feedWeek += daily[d - 1] || 0;
    cum += feedWeek;
    const birdsAlive =
      chicks - (chicks - survivingBirds) * (endDay / processingAge);
    weeklyRows.push({
      week: w,
      startDay,
      endDay,
      birdsAlive,
      feedPerDay: feedWeek / days,
      feedWeek,
      bagsWeek: feedWeek / bagSize,
      cumFeed: cum,
      cumCost: cum * feedCostPerLb,
    });
  }

  const costCategories: CostCategory[] = [
    { key: "feed", label: "Feed", value: feedCost },
    { key: "chicks", label: "Chicks", value: chickCostTotal },
    { key: "processing", label: "Processing", value: processingCostTotal },
    { key: "packaging", label: "Packaging", value: packagingCostTotal },
    { key: "misc", label: "Misc", value: miscCostTotal },
    { key: "labor", label: "Labor", value: laborCostTotal },
  ];

  return {
    survivingBirds,
    totalFeedLb,
    feedBags,
    feedCost,
    feedCostPerLb,
    dressedWeightPerBird,
    totalDressedWeight,
    soldRetail,
    soldWholesale,
    revenue,
    chickCostTotal,
    processingCostTotal,
    packagingCostTotal,
    miscCostTotal,
    laborCostTotal,
    totalCost,
    profit,
    profitPerBird,
    breakEvenPricePerLb,
    costPerBird,
    costPerDressedLb,
    laborEarnedPerHour,
    processingAge,
    daily,
    peakRation,
    averageDailyRation,
    finalWeekDailyRation,
    todayRation,
    weeklyRows,
    costCategories,
    includeSales,
    includeLabor,
  };
}
