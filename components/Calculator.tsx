"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Breed, CalculatorState } from "@/types";
import { clamp, computeResults } from "@/lib/calculations";
import {
  BREED_DEFAULTS,
  BREED_FIELDS,
  TYPICAL_DEFAULTS,
  defaultState,
  isoDate,
} from "@/lib/defaults";
import { parse, serialize } from "@/lib/urlState";
import { fmt0, money, money0 } from "@/lib/format";
import InputsColumn, { type Handlers } from "./InputSection";
import { Economics, FeedHero } from "./OutputCards";
import WeeklyFeedTable from "./WeeklyFeedTable";
import CostBreakdown from "./CostBreakdown";
import {
  GREEN,
  INK,
  MONO,
  MUTED_LIGHT,
  RED_ACCENT,
  SANS,
  SECONDARY,
} from "./ui";

function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export default function Calculator() {
  const [state, setState] = useState<CalculatorState>(() => ({
    ...defaultState(new Date()),
    ...parse(window.location.search),
  }));
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Mirror every change into the URL so the current scenario is shareable.
  useEffect(() => {
    window.history.replaceState(
      null,
      "",
      window.location.pathname + "?" + serialize(state)
    );
  }, [state]);

  useEffect(() => {
    return () => {
      if (copyTimer.current) clearTimeout(copyTimer.current);
    };
  }, []);

  const currentAgeDays = useMemo(() => {
    const arrival = new Date(state.arrivalDate + "T00:00:00");
    const d = Math.floor(
      (startOfToday().getTime() - arrival.getTime()) / 86400000
    );
    return clamp(Number.isFinite(d) ? d : 0, 0, 400);
  }, [state.arrivalDate]);

  const results = useMemo(
    () => computeResults(state, currentAgeDays),
    [state, currentAgeDays]
  );

  const handlers: Handlers = {
    setNumber: (name, raw) =>
      setState((prev) => {
        const next = {
          ...prev,
          [name]: raw === "" ? "" : Number(raw),
        } as CalculatorState;
        // Editing a breed-default field means the scenario is now custom.
        if ((BREED_FIELDS as string[]).includes(name)) next.breed = "custom";
        return next;
      }),
    setBreed: (breed: Breed) =>
      setState((prev) =>
        breed === "custom"
          ? { ...prev, breed }
          : { ...prev, breed, ...BREED_DEFAULTS[breed] }
      ),
    setArrivalDate: (value) =>
      setState((prev) => ({ ...prev, arrivalDate: value })),
    setCurrentAge: (raw) =>
      setState((prev) => {
        const age = Math.max(0, Number(raw) || 0);
        const arrival = new Date(startOfToday().getTime() - age * 86400000);
        return { ...prev, arrivalDate: isoDate(arrival) };
      }),
    setToggle: (name, checked) =>
      setState((prev) => ({ ...prev, [name]: checked })),
    resetField: (name) =>
      setState((prev) => {
        const breedDefaults =
          BREED_DEFAULTS[prev.breed === "ranger" ? "ranger" : "cornish"];
        if (name in breedDefaults) {
          return {
            ...prev,
            [name]: breedDefaults[name as keyof typeof breedDefaults],
          };
        }
        if (name in TYPICAL_DEFAULTS) {
          return {
            ...prev,
            [name]: TYPICAL_DEFAULTS[name as keyof typeof TYPICAL_DEFAULTS],
          };
        }
        return prev;
      }),
  };

  const copyLink = () => {
    const url =
      window.location.origin + window.location.pathname + "?" + serialize(state);
    const done = () => {
      setCopied(true);
      if (copyTimer.current) clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 1700);
    };
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(url).then(done, done);
    } else {
      done();
    }
  };

  // Live summary sentence
  const r = results;
  let summarySentence: string;
  let summaryAccent: string;
  if (!r.includeSales) {
    summaryAccent = GREEN;
    summarySentence = `At these numbers, you need ${fmt0(r.totalFeedLb)} lb of feed, or ${r.feedBags} bags, and about ${money0(r.totalCost)} to raise the flock — roughly ${money(r.costPerBird)} per bird, or ${money(r.costPerDressedLb)} per dressed lb.`;
  } else if (r.profit >= 0) {
    summaryAccent = GREEN;
    summarySentence = `At these numbers, you need ${fmt0(r.totalFeedLb)} lb of feed, or ${r.feedBags} bags. The flock makes ${money0(r.profit)} total, about ${money(r.profitPerBird)} per bird, with a break-even price of ${money(r.breakEvenPricePerLb)}/lb dressed.`;
  } else {
    summaryAccent = RED_ACCENT;
    summarySentence = `At these numbers, this flock loses ${money0(-r.profit)}. You need at least ${money(r.breakEvenPricePerLb)}/lb dressed weight to break even.`;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f4f2ec",
        fontFamily: SANS,
        color: INK,
        padding: "26px 20px 64px",
        WebkitFontSmoothing: "antialiased",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 16,
            marginBottom: 18,
          }}
        >
          <div>
            <div
              style={{
                fontFamily: MONO,
                fontSize: 11,
                letterSpacing: ".14em",
                textTransform: "uppercase",
                color: GREEN,
                marginBottom: 6,
              }}
            >
              Pastured Poultry · Field Tool
            </div>
            <h1
              style={{
                margin: 0,
                fontSize: 29,
                fontWeight: 700,
                letterSpacing: "-0.01em",
                lineHeight: 1.1,
              }}
            >
              Broiler Feed &amp; Profit Calculator
            </h1>
            <p
              style={{
                margin: "6px 0 0",
                fontSize: 14,
                color: SECONDARY,
                maxWidth: 560,
                lineHeight: 1.5,
              }}
            >
              Plug in what you know. It fills in sensible defaults and
              estimates your feed, costs, and take-home—so you can plan a flock
              before you order chicks.
            </p>
          </div>
          <button
            type="button"
            onClick={copyLink}
            style={{
              fontFamily: MONO,
              fontSize: 12,
              letterSpacing: ".03em",
              background: GREEN,
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "11px 16px",
              cursor: "pointer",
              whiteSpace: "nowrap",
              fontWeight: 500,
            }}
          >
            {copied ? "Copied ✓" : "Copy scenario link"}
          </button>
        </div>

        {/* Live summary sentence */}
        <div
          style={{
            background: "#fffdf9",
            border: "1px solid #e5e1d7",
            borderLeft: `4px solid ${summaryAccent}`,
            borderRadius: 10,
            padding: "16px 18px",
            marginBottom: 20,
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: 17,
              lineHeight: 1.5,
              color: "#33302a",
              textWrap: "pretty",
            }}
          >
            {summarySentence}
          </p>
        </div>

        {/* Two-column body */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 22,
            alignItems: "flex-start",
          }}
        >
          <InputsColumn
            state={state}
            results={results}
            currentAgeDays={currentAgeDays}
            handlers={handlers}
          />
          <div style={{ flex: "999 1 560px", minWidth: 320 }}>
            <FeedHero
              results={results}
              state={state}
              currentAgeDays={currentAgeDays}
            />
            <Economics results={results} />
            <WeeklyFeedTable results={results} />
            <CostBreakdown results={results} />
          </div>
        </div>

        <p
          style={{
            margin: "24px auto 0",
            maxWidth: 1200,
            fontSize: 11,
            color: MUTED_LIGHT,
            lineHeight: 1.5,
            textAlign: "center",
          }}
        >
          Estimates only—actual results vary with weather, feed quality, and
          management. Numbers update live and are saved in this page&apos;s
          link so you can share a scenario.
        </p>
      </div>
    </div>
  );
}
