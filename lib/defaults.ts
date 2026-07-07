import type { Breed, BreedField, CalculatorState } from "@/types";

export const BREED_DEFAULTS: Record<
  Exclude<Breed, "custom">,
  Record<BreedField, number>
> = {
  cornish: {
    processingAgeDays: 56,
    mortalityPct: 5,
    targetLiveWeight: 6.0,
    dressedYieldPct: 72,
    fcr: 3.2,
  },
  ranger: {
    processingAgeDays: 77,
    mortalityPct: 5,
    targetLiveWeight: 5.8,
    dressedYieldPct: 70,
    fcr: 4.1,
  },
};

export const BREED_FIELDS: BreedField[] = [
  "processingAgeDays",
  "mortalityPct",
  "targetLiveWeight",
  "dressedYieldPct",
  "fcr",
];

export const TYPICAL_DEFAULTS = {
  feedCostPerBag: 24,
  bagSize: 50,
  chickCost: 3.5,
  processingCostPerBird: 4.0,
  packagingCostPerBird: 0.75,
  miscCostPerBird: 0.5,
  retailPricePerLb: 6.5,
  wholesalePricePerLb: 4.5,
  laborHours: 40,
  targetWage: 20,
} as const;

/** Local-timezone YYYY-MM-DD (toISOString would shift dates near midnight). */
export function isoDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function defaultState(today: Date = new Date()): CalculatorState {
  return {
    chicksStarted: 100,
    breed: "cornish",
    arrivalDate: isoDate(today),
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
  };
}
