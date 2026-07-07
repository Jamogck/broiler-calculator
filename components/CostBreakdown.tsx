import type { CostCategory, Results } from "@/types";
import { money0 } from "@/lib/format";
import { BODY, CARD_BG, CARD_BORDER, HAIRLINE, MONO, MUTED } from "./ui";

const CATEGORY_COLORS: Record<CostCategory["key"], string> = {
  feed: "oklch(0.52 0.09 150)",
  chicks: "oklch(0.66 0.11 90)",
  processing: "oklch(0.62 0.12 40)",
  packaging: "oklch(0.6 0.08 300)",
  misc: "oklch(0.7 0.04 250)",
  labor: "oklch(0.5 0.07 220)",
};

export default function CostBreakdown({ results }: { results: Results }) {
  const total = results.totalCost;
  const segments = results.costCategories
    .filter((c) => c.value > 0.005)
    .map((c) => ({
      ...c,
      color: CATEGORY_COLORS[c.key],
      pct: total > 0 ? (c.value / total) * 100 : 0,
    }));

  return (
    <section
      style={{
        background: CARD_BG,
        border: `1px solid ${CARD_BORDER}`,
        borderRadius: 10,
        padding: "16px 18px",
      }}
    >
      <h3 style={{ margin: "0 0 14px", fontSize: 15, fontWeight: 600 }}>
        Where the money goes
      </h3>
      <div
        style={{
          display: "flex",
          height: 26,
          borderRadius: 6,
          overflow: "hidden",
          marginBottom: 16,
          background: "#efece3",
        }}
      >
        {segments.map((seg) => (
          <div
            key={seg.key}
            title={seg.label}
            style={{
              width: `${seg.pct}%`,
              background: seg.color,
              height: "100%",
            }}
          />
        ))}
      </div>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: 13,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        <tbody>
          {segments.map((seg) => (
            <tr key={seg.key} style={{ borderTop: `1px solid ${HAIRLINE}` }}>
              <td style={{ padding: "7px 0", width: 20 }}>
                <span
                  style={{
                    display: "inline-block",
                    width: 11,
                    height: 11,
                    borderRadius: 3,
                    background: seg.color,
                  }}
                />
              </td>
              <td style={{ padding: "7px 8px", color: BODY }}>{seg.label}</td>
              <td
                style={{
                  padding: "7px 8px",
                  textAlign: "right",
                  color: MUTED,
                  fontFamily: MONO,
                  fontSize: 12,
                }}
              >
                {Math.round(seg.pct)}%
              </td>
              <td
                style={{ padding: "7px 0", textAlign: "right", fontWeight: 500 }}
              >
                {money0(seg.value)}
              </td>
            </tr>
          ))}
          <tr style={{ borderTop: `2px solid ${CARD_BORDER}` }}>
            <td />
            <td style={{ padding: "9px 8px", fontWeight: 600 }}>Total cost</td>
            <td />
            <td
              style={{
                padding: "9px 0",
                textAlign: "right",
                fontWeight: 700,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {money0(total)}
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  );
}
