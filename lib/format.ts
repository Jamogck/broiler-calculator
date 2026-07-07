/** Whole number with thousands separators. */
export function fmt0(n: number): string {
  if (!Number.isFinite(n)) n = 0;
  return Math.round(n).toLocaleString("en-US");
}

/** One decimal with thousands separators. */
export function fmt1(n: number): string {
  if (!Number.isFinite(n)) n = 0;
  return n.toLocaleString("en-US", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
}

/** $1,234.56 — negatives use a true minus sign. */
export function money(n: number): string {
  if (!Number.isFinite(n)) n = 0;
  return (
    (n < 0 ? "−$" : "$") +
    Math.abs(n).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
}

/** $1,234 — whole dollars, negatives use a true minus sign. */
export function money0(n: number): string {
  if (!Number.isFinite(n)) n = 0;
  return (n < 0 ? "−$" : "$") + Math.round(Math.abs(n)).toLocaleString("en-US");
}
