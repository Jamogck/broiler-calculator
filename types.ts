export type Breed = "cornish" | "ranger" | "custom";

/** Numeric inputs may be transiently empty while the user is typing. */
export type NumField = number | "";

export interface CalculatorState {
  chicksStarted: NumField;
  breed: Breed;
  /** YYYY-MM-DD */
  arrivalDate: string;
  processingAgeDays: NumField;
  feedCostPerBag: NumField;
  bagSize: NumField;
  mortalityPct: NumField;
  targetLiveWeight: NumField;
  dressedYieldPct: NumField;
  fcr: NumField;
  chickCost: NumField;
  processingCostPerBird: NumField;
  packagingCostPerBird: NumField;
  miscCostPerBird: NumField;
  retailPricePerLb: NumField;
  wholesalePricePerLb: NumField;
  birdsSoldRetail: NumField;
  birdsSoldWholesale: NumField;
  laborHours: NumField;
  targetWage: NumField;
  includeSales: boolean;
  includeLabor: boolean;
}

/** The five fields whose defaults come from the selected breed. */
export type BreedField =
  | "processingAgeDays"
  | "mortalityPct"
  | "targetLiveWeight"
  | "dressedYieldPct"
  | "fcr";

export interface WeeklyRow {
  week: number;
  startDay: number;
  endDay: number;
  birdsAlive: number;
  feedPerDay: number;
  feedWeek: number;
  bagsWeek: number;
  cumFeed: number;
  cumCost: number;
}

export interface CostCategory {
  key: "feed" | "chicks" | "processing" | "packaging" | "misc" | "labor";
  label: string;
  value: number;
}

export interface Results {
  survivingBirds: number;
  totalFeedLb: number;
  feedBags: number;
  feedCost: number;
  feedCostPerLb: number;
  dressedWeightPerBird: number;
  totalDressedWeight: number;
  soldRetail: number;
  soldWholesale: number;
  revenue: number;
  chickCostTotal: number;
  processingCostTotal: number;
  packagingCostTotal: number;
  miscCostTotal: number;
  laborCostTotal: number;
  totalCost: number;
  profit: number;
  profitPerBird: number;
  breakEvenPricePerLb: number;
  costPerBird: number;
  costPerDressedLb: number;
  laborEarnedPerHour: number;
  /** Clamped, rounded processing age actually used in the math. */
  processingAge: number;
  /** lb of feed per day, length === processingAge, sums to totalFeedLb. */
  daily: number[];
  peakRation: number;
  averageDailyRation: number;
  finalWeekDailyRation: number;
  todayRation: number;
  weeklyRows: WeeklyRow[];
  costCategories: CostCategory[];
  includeSales: boolean;
  includeLabor: boolean;
}
