import type { CalculatorState, Results } from "@/types";
import { fmt0, fmt1, money, money0 } from "@/lib/format";
import RationChart from "./RationChart";
import {
  AMBER,
  BODY,
  GREEN_DARK,
  GREEN_DEEP,
  INK,
  MONO,
  MUTED,
  RED,
  SECONDARY,
  StatCard,
} from "./ui";

export function FeedHero({
  results,
  state,
  currentAgeDays,
}: {
  results: Results;
  state: CalculatorState;
  currentAgeDays: number;
}) {
  const r = results;
  return (
    <section
      style={{
        background: "linear-gradient(180deg,#f3f7f0,#fffdf9 60%)",
        border: "1px solid oklch(0.83 0.05 150)",
        borderRadius: 14,
        padding: "22px 22px 6px",
        marginBottom: 18,
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "24px 32px",
          alignItems: "flex-start",
        }}
      >
        <div style={{ flex: "2 1 260px", minWidth: 220 }}>
          <div
            style={{
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: ".08em",
              color: "oklch(0.5 0.06 150)",
              fontFamily: MONO,
              marginBottom: 6,
            }}
          >
            Feed to raise this flock
          </div>
          <div
            style={{
              fontSize: 52,
              fontWeight: 700,
              lineHeight: 0.95,
              letterSpacing: "-0.02em",
              fontVariantNumeric: "tabular-nums",
              color: INK,
            }}
          >
            {fmt0(r.totalFeedLb)}
            <span
              style={{
                fontSize: 20,
                fontWeight: 500,
                color: MUTED,
                marginLeft: 6,
              }}
            >
              lb
            </span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 14,
              marginTop: 14,
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
              <span
                style={{
                  fontSize: 26,
                  fontWeight: 600,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {r.feedBags}
              </span>
              <span style={{ fontSize: 13, color: MUTED }}>
                × {state.bagSize || 50} lb bags
              </span>
            </div>
            <span style={{ color: "oklch(0.8 0.03 150)" }}>→</span>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
              <span
                style={{
                  fontSize: 26,
                  fontWeight: 700,
                  fontVariantNumeric: "tabular-nums",
                  color: GREEN_DARK,
                }}
              >
                {money0(r.feedCost)}
              </span>
              <span style={{ fontSize: 13, color: MUTED }}>in feed</span>
            </div>
          </div>
        </div>

        <div
          style={{
            flex: "1 1 200px",
            minWidth: 180,
            display: "flex",
            flexDirection: "column",
            gap: 12,
            borderLeft: "1px solid oklch(0.87 0.03 150)",
            paddingLeft: 24,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 10.5,
                textTransform: "uppercase",
                letterSpacing: ".05em",
                color: MUTED,
                fontFamily: MONO,
              }}
            >
              Feed today · day {currentAgeDays}
            </div>
            <div
              style={{
                fontSize: 34,
                fontWeight: 700,
                lineHeight: 1.05,
                fontVariantNumeric: "tabular-nums",
                color: AMBER,
              }}
            >
              {fmt1(r.todayRation)}
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: MUTED,
                  marginLeft: 5,
                }}
              >
                lb/day
              </span>
            </div>
          </div>
          <div
            style={{
              borderTop: "1px dashed oklch(0.86 0.03 150)",
              paddingTop: 10,
            }}
          >
            <div
              style={{
                fontSize: 10.5,
                textTransform: "uppercase",
                letterSpacing: ".05em",
                color: MUTED,
                fontFamily: MONO,
              }}
            >
              Peak day
            </div>
            <div
              style={{
                fontSize: 19,
                fontWeight: 600,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {fmt1(r.peakRation)}{" "}
              <span style={{ fontSize: 12, color: MUTED, fontWeight: 400 }}>
                lb/day
              </span>
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: 18,
          borderTop: "1px solid oklch(0.9 0.02 150)",
          paddingTop: 14,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            gap: 12,
            flexWrap: "wrap",
            marginBottom: 2,
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: 13,
              fontWeight: 600,
              color: BODY,
            }}
          >
            Daily ration across the flock
          </h3>
          <span style={{ fontSize: 11, color: MUTED, fontFamily: MONO }}>
            lb / day · all birds
          </span>
        </div>
        <p
          style={{
            margin: "0 0 8px",
            fontSize: 11.5,
            color: MUTED,
            lineHeight: 1.4,
          }}
        >
          Don&apos;t average this—feed need rises sharply in the final weeks.
          The dashed line marks today.
        </p>
        <RationChart
          daily={r.daily}
          currentDay={currentAgeDays}
          peak={r.peakRation}
        />
      </div>
    </section>
  );
}

export function Economics({ results }: { results: Results }) {
  const r = results;
  const profitColor = r.profit >= 0 ? GREEN_DEEP : RED;
  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))",
    gap: 10,
  } as const;

  return (
    <section style={{ marginBottom: 20 }}>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          gap: 12,
          margin: "0 2px 10px",
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: 12,
            fontFamily: MONO,
            letterSpacing: ".08em",
            textTransform: "uppercase",
            color: MUTED,
          }}
        >
          The economics
        </h3>
        {r.includeSales ? (
          <span style={{ fontSize: 12, color: SECONDARY }}>
            Flock profit{" "}
            <strong
              style={{
                color: profitColor,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {money0(r.profit)}
            </strong>
          </span>
        ) : (
          <span style={{ fontSize: 12, color: SECONDARY }}>
            Cost to raise{" "}
            <strong
              style={{ color: "#33302a", fontVariantNumeric: "tabular-nums" }}
            >
              {money0(r.totalCost)}
            </strong>
          </span>
        )}
      </div>
      {r.includeSales ? (
        <div style={gridStyle}>
          <StatCard label="Revenue" value={money0(r.revenue)} />
          <StatCard label="Total cost" value={money0(r.totalCost)} />
          <StatCard
            label="Break-even /lb"
            value={money(r.breakEvenPricePerLb)}
          />
          <StatCard
            label="Profit / bird"
            value={money(r.profitPerBird)}
            valueColor={profitColor}
          />
          <StatCard
            label="Flock profit"
            value={money0(r.profit)}
            valueColor={profitColor}
            valueWeight={700}
            background={
              r.profit >= 0 ? "oklch(0.97 0.02 150)" : "oklch(0.97 0.03 30)"
            }
            borderColor={
              r.profit >= 0 ? "oklch(0.85 0.05 150)" : "oklch(0.85 0.07 30)"
            }
          />
        </div>
      ) : (
        <div style={gridStyle}>
          <StatCard
            label="Total cost"
            value={money0(r.totalCost)}
            valueColor="#33302a"
            valueWeight={700}
          />
          <StatCard label="Cost / bird" value={money(r.costPerBird)} />
          <StatCard
            label="Cost / dressed lb"
            value={money(r.costPerDressedLb)}
          />
        </div>
      )}
    </section>
  );
}
