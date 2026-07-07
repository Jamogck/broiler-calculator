import type { Results } from "@/types";
import { fmt0, fmt1, money0 } from "@/lib/format";
import {
  CARD_BG,
  CARD_BORDER,
  GREEN_HEADING,
  HAIRLINE,
  MONO,
  MUTED,
  SECONDARY,
} from "./ui";

const headerCell = {
  padding: "0 8px 8px",
  fontWeight: 500,
} as const;

export default function WeeklyFeedTable({ results }: { results: Results }) {
  return (
    <section
      style={{
        background: CARD_BG,
        border: `1px solid ${CARD_BORDER}`,
        borderRadius: 10,
        padding: "16px 18px 8px",
        marginBottom: 20,
        overflowX: "auto",
      }}
    >
      <h3 style={{ margin: "0 0 12px", fontSize: 15, fontWeight: 600 }}>
        Week-by-week feed plan
      </h3>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: 12.5,
          fontVariantNumeric: "tabular-nums",
          minWidth: 520,
        }}
      >
        <thead>
          <tr
            style={{
              textAlign: "right",
              color: MUTED,
              fontFamily: MONO,
              fontSize: 10.5,
              textTransform: "uppercase",
              letterSpacing: ".04em",
            }}
          >
            <th style={{ ...headerCell, textAlign: "left", paddingLeft: 0 }}>
              Wk
            </th>
            <th style={{ ...headerCell, textAlign: "left" }}>Age (days)</th>
            <th style={headerCell}>Birds</th>
            <th style={headerCell}>Feed/day</th>
            <th style={headerCell}>Feed/wk</th>
            <th style={headerCell}>Bags/wk</th>
            <th style={headerCell}>Cum. feed</th>
            <th style={{ ...headerCell, paddingRight: 0 }}>Cum. cost</th>
          </tr>
        </thead>
        <tbody>
          {results.weeklyRows.map((row) => (
            <tr
              key={row.week}
              style={{ textAlign: "right", borderTop: `1px solid ${HAIRLINE}` }}
            >
              <td
                style={{
                  textAlign: "left",
                  padding: "7px 8px 7px 0",
                  fontWeight: 600,
                  color: GREEN_HEADING,
                }}
              >
                {row.week}
              </td>
              <td
                style={{
                  textAlign: "left",
                  padding: "7px 8px",
                  color: SECONDARY,
                }}
              >
                {row.startDay}–{row.endDay}
              </td>
              <td style={{ padding: "7px 8px" }}>{fmt0(row.birdsAlive)}</td>
              <td style={{ padding: "7px 8px" }}>{fmt1(row.feedPerDay)}</td>
              <td style={{ padding: "7px 8px" }}>{fmt0(row.feedWeek)}</td>
              <td style={{ padding: "7px 8px" }}>{fmt1(row.bagsWeek)}</td>
              <td style={{ padding: "7px 8px", color: SECONDARY }}>
                {fmt0(row.cumFeed)}
              </td>
              <td style={{ padding: "7px 0 7px 8px", color: SECONDARY }}>
                {money0(row.cumCost)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
