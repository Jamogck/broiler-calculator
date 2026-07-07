import type { Breed, CalculatorState } from "@/types";

const SERIAL_KEYS: (keyof CalculatorState)[] = [
  "chicksStarted",
  "breed",
  "arrivalDate",
  "processingAgeDays",
  "feedCostPerBag",
  "bagSize",
  "mortalityPct",
  "targetLiveWeight",
  "dressedYieldPct",
  "fcr",
  "chickCost",
  "processingCostPerBird",
  "packagingCostPerBird",
  "miscCostPerBird",
  "retailPricePerLb",
  "wholesalePricePerLb",
  "birdsSoldRetail",
  "birdsSoldWholesale",
  "laborHours",
  "targetWage",
  "includeSales",
  "includeLabor",
];

const BREEDS: Breed[] = ["cornish", "ranger", "custom"];

export function serialize(state: CalculatorState): string {
  const q = new URLSearchParams();
  SERIAL_KEYS.forEach((k) => q.set(k, String(state[k])));
  return q.toString();
}

export function parse(
  search: string | URLSearchParams
): Partial<CalculatorState> {
  const q =
    typeof search === "string" ? new URLSearchParams(search) : search;
  const patch: Partial<CalculatorState> = {};
  SERIAL_KEYS.forEach((k) => {
    if (!q.has(k)) return;
    const raw = q.get(k)!;
    if (k === "breed") {
      if (BREEDS.includes(raw as Breed)) patch.breed = raw as Breed;
    } else if (k === "arrivalDate") {
      if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) patch.arrivalDate = raw;
    } else if (k === "includeSales" || k === "includeLabor") {
      patch[k] = raw === "true" || raw === "1";
    } else {
      const n = Number(raw);
      if (Number.isFinite(n)) (patch as Record<string, unknown>)[k] = n;
    }
  });
  return patch;
}
