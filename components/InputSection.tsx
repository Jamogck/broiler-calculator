import type { Breed, CalculatorState, Results } from "@/types";
import { fmt0, fmt1, money } from "@/lib/format";
import {
  HAIRLINE,
  INK,
  INPUT_BORDER,
  IncludeToggle,
  InputRow,
  MONO,
  MUTED_LIGHT,
  NumberField,
  SectionCard,
  TypicalButton,
  helperStyle,
} from "./ui";

export interface Handlers {
  setNumber: (name: keyof CalculatorState, raw: string) => void;
  setBreed: (breed: Breed) => void;
  setArrivalDate: (value: string) => void;
  setCurrentAge: (raw: string) => void;
  setToggle: (name: "includeSales" | "includeLabor", checked: boolean) => void;
  resetField: (name: keyof CalculatorState) => void;
}

export default function InputsColumn({
  state,
  results,
  currentAgeDays,
  handlers,
}: {
  state: CalculatorState;
  results: Results;
  currentAgeDays: number;
  handlers: Handlers;
}) {
  const h = handlers;
  return (
    <div style={{ flex: "1 1 350px", maxWidth: 430, minWidth: 300 }}>
      <SectionCard title="Quick estimate">
        <InputRow label="Chicks started">
          <NumberField
            name="chicksStarted"
            value={state.chicksStarted}
            onChange={(raw) => h.setNumber("chicksStarted", raw)}
            min={0}
          />
        </InputRow>
        <InputRow label="Breed / type">
          <select
            name="breed"
            value={state.breed}
            onChange={(e) => h.setBreed(e.target.value as Breed)}
            style={{
              width: 180,
              padding: "6px 8px",
              border: `1px solid ${INPUT_BORDER}`,
              borderRadius: 6,
              font: "inherit",
              fontSize: 13,
              background: "#fff",
              color: INK,
            }}
          >
            <option value="cornish">Cornish Cross</option>
            <option value="ranger">Red Ranger / Freedom Ranger</option>
            <option value="custom">Custom</option>
          </select>
        </InputRow>
        <InputRow label="Chick arrival date">
          <input
            type="date"
            name="arrivalDate"
            value={state.arrivalDate}
            onChange={(e) => h.setArrivalDate(e.target.value)}
            style={{
              width: 150,
              padding: "6px 8px",
              border: `1px solid ${INPUT_BORDER}`,
              borderRadius: 6,
              font: "inherit",
              fontSize: 13,
              background: "#fff",
              color: INK,
            }}
          />
        </InputRow>
        <InputRow label="Current age" unit="days">
          <NumberField
            name="currentAge"
            value={currentAgeDays}
            onChange={h.setCurrentAge}
            min={0}
          />
        </InputRow>
        <div style={{ ...helperStyle, padding: "2px 0 8px" }}>
          Set the arrival date <em>or</em> type today&apos;s age—each keeps the
          other in sync.
        </div>
        <InputRow label="Processing age" unit="days">
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <NumberField
              name="processingAgeDays"
              value={state.processingAgeDays}
              onChange={(raw) => h.setNumber("processingAgeDays", raw)}
              width={70}
              min={35}
              max={120}
            />
            <TypicalButton onClick={() => h.resetField("processingAgeDays")} />
          </div>
        </InputRow>
        <InputRow label="Feed cost per bag">
          <NumberField
            name="feedCostPerBag"
            value={state.feedCostPerBag}
            onChange={(raw) => h.setNumber("feedCostPerBag", raw)}
            width={70}
            min={0}
            step={0.5}
            dollar
          />
        </InputRow>
        <InputRow label="Bag size" unit="lb" divider="none">
          <NumberField
            name="bagSize"
            value={state.bagSize}
            onChange={(raw) => h.setNumber("bagSize", raw)}
            min={1}
          />
        </InputRow>
      </SectionCard>

      <SectionCard title="Assumptions">
        <InputRow label="Mortality" unit="%" divider="none">
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <NumberField
              name="mortalityPct"
              value={state.mortalityPct}
              onChange={(raw) => h.setNumber("mortalityPct", raw)}
              width={70}
              min={0}
              max={50}
              step={0.5}
            />
            <TypicalButton onClick={() => h.resetField("mortalityPct")} />
          </div>
        </InputRow>
        <div
          style={{
            ...helperStyle,
            padding: "0 0 8px",
            borderBottom: `1px solid ${HAIRLINE}`,
          }}
        >
          5% is a fair plan. Allowed range 0–50%.
        </div>

        <InputRow label="Target live weight" unit="lb" divider="none">
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <NumberField
              name="targetLiveWeight"
              value={state.targetLiveWeight}
              onChange={(raw) => h.setNumber("targetLiveWeight", raw)}
              width={70}
              min={0}
              step={0.1}
            />
            <TypicalButton onClick={() => h.resetField("targetLiveWeight")} />
          </div>
        </InputRow>
        <div
          style={{
            ...helperStyle,
            padding: "0 0 8px",
            borderBottom: `1px solid ${HAIRLINE}`,
          }}
        >
          That&apos;s about{" "}
          <strong style={{ color: "#33302a" }}>
            {fmt1(results.dressedWeightPerBird)} lb dressed
          </strong>{" "}
          (finished) per bird at your yield.
        </div>

        <InputRow label="Dressed yield" unit="%" divider="none">
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <NumberField
              name="dressedYieldPct"
              value={state.dressedYieldPct}
              onChange={(raw) => h.setNumber("dressedYieldPct", raw)}
              width={70}
              min={50}
              max={80}
              step={0.5}
            />
            <TypicalButton onClick={() => h.resetField("dressedYieldPct")} />
          </div>
        </InputRow>
        <div
          style={{
            ...helperStyle,
            padding: "0 0 8px",
            borderBottom: `1px solid ${HAIRLINE}`,
          }}
        >
          Dressed weight is usually about 70–72% of live weight.
        </div>

        <InputRow label="Feed conversion ratio" divider="none">
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <NumberField
              name="fcr"
              value={state.fcr}
              onChange={(raw) => h.setNumber("fcr", raw)}
              width={70}
              min={2}
              max={6}
              step={0.1}
            />
            <TypicalButton onClick={() => h.resetField("fcr")} />
          </div>
        </InputRow>
        <div
          style={{
            ...helperStyle,
            padding: "0 0 8px",
            borderBottom: `1px solid ${HAIRLINE}`,
          }}
        >
          Lower is better. 3.0 is excellent, 3.5 is common, 4.0+ means
          something may be off.
        </div>

        <InputRow label="Chick cost" unit="each" divider="none">
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <NumberField
              name="chickCost"
              value={state.chickCost}
              onChange={(raw) => h.setNumber("chickCost", raw)}
              width={64}
              min={0}
              step={0.25}
              dollar
            />
            <TypicalButton onClick={() => h.resetField("chickCost")} />
          </div>
        </InputRow>
        <InputRow label="Processing" unit="per bird" divider="top">
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <NumberField
              name="processingCostPerBird"
              value={state.processingCostPerBird}
              onChange={(raw) => h.setNumber("processingCostPerBird", raw)}
              width={64}
              min={0}
              step={0.25}
              dollar
            />
            <TypicalButton
              onClick={() => h.resetField("processingCostPerBird")}
            />
          </div>
        </InputRow>
        <InputRow label="Packaging" unit="per bird" divider="top">
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <NumberField
              name="packagingCostPerBird"
              value={state.packagingCostPerBird}
              onChange={(raw) => h.setNumber("packagingCostPerBird", raw)}
              width={64}
              min={0}
              step={0.25}
              dollar
            />
            <TypicalButton
              onClick={() => h.resetField("packagingCostPerBird")}
            />
          </div>
        </InputRow>
        <InputRow label="Misc" unit="per bird" divider="top">
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <NumberField
              name="miscCostPerBird"
              value={state.miscCostPerBird}
              onChange={(raw) => h.setNumber("miscCostPerBird", raw)}
              width={64}
              min={0}
              step={0.25}
              dollar
            />
            <TypicalButton onClick={() => h.resetField("miscCostPerBird")} />
          </div>
        </InputRow>
      </SectionCard>

      <SectionCard
        title="Sales"
        headerRight={
          <IncludeToggle
            name="includeSales"
            checked={state.includeSales}
            onChange={(checked) => h.setToggle("includeSales", checked)}
          />
        }
      >
        {!state.includeSales ? (
          <p
            style={{
              margin: 0,
              fontSize: 11.5,
              color: MUTED_LIGHT,
              lineHeight: 1.4,
              padding: "2px 0 6px",
            }}
          >
            Not counting sales — this flock is for your own table.
          </p>
        ) : (
          <>
            <InputRow label="Retail price" unit="$/lb">
              <NumberField
                name="retailPricePerLb"
                value={state.retailPricePerLb}
                onChange={(raw) => h.setNumber("retailPricePerLb", raw)}
                width={70}
                min={0}
                step={0.25}
                dollar
              />
            </InputRow>
            <InputRow label="Birds sold at retail" divider="none">
              <NumberField
                name="birdsSoldRetail"
                value={state.birdsSoldRetail}
                onChange={(raw) => h.setNumber("birdsSoldRetail", raw)}
                width={70}
                min={0}
              />
            </InputRow>
            <div style={{ ...helperStyle, padding: "0 0 10px" }}>
              You&apos;ll have about{" "}
              <strong style={{ color: "#33302a" }}>
                {fmt0(results.survivingBirds)} birds
              </strong>{" "}
              to sell after mortality. Any you keep just aren&apos;t counted as
              income.
            </div>
            <div
              style={{
                fontSize: 10.5,
                textTransform: "uppercase",
                letterSpacing: ".05em",
                color: MUTED_LIGHT,
                fontFamily: MONO,
                padding: "8px 0 2px",
                borderTop: `1px solid ${HAIRLINE}`,
              }}
            >
              Wholesale · optional
            </div>
            <InputRow label="Wholesale price" unit="$/lb">
              <NumberField
                name="wholesalePricePerLb"
                value={state.wholesalePricePerLb}
                onChange={(raw) => h.setNumber("wholesalePricePerLb", raw)}
                width={70}
                min={0}
                step={0.25}
                dollar
              />
            </InputRow>
            <InputRow label="Birds sold wholesale" divider="none">
              <NumberField
                name="birdsSoldWholesale"
                value={state.birdsSoldWholesale}
                onChange={(raw) => h.setNumber("birdsSoldWholesale", raw)}
                width={70}
                min={0}
              />
            </InputRow>
            <div style={{ ...helperStyle, padding: "0 0 8px" }}>
              Leave at 0 if you only sell retail.
            </div>
          </>
        )}
      </SectionCard>

      <SectionCard
        title="Labor"
        style={{ marginBottom: 0 }}
        headerRight={
          <IncludeToggle
            name="includeLabor"
            checked={state.includeLabor}
            onChange={(checked) => h.setToggle("includeLabor", checked)}
          />
        }
      >
        {!state.includeLabor ? (
          <p
            style={{
              margin: 0,
              fontSize: 11.5,
              color: MUTED_LIGHT,
              lineHeight: 1.4,
              padding: "2px 0 6px",
            }}
          >
            Not counting your labor as a cost.
          </p>
        ) : (
          <>
            <InputRow label="Total labor hours">
              <NumberField
                name="laborHours"
                value={state.laborHours}
                onChange={(raw) => h.setNumber("laborHours", raw)}
                min={0}
              />
            </InputRow>
            <InputRow label="Target wage" unit="$/hr" divider="none">
              <NumberField
                name="targetWage"
                value={state.targetWage}
                onChange={(raw) => h.setNumber("targetWage", raw)}
                width={70}
                min={0}
                step={0.5}
                dollar
              />
            </InputRow>
            <div style={{ ...helperStyle, padding: "6px 0 8px" }}>
              At the profit above, your labor actually earns{" "}
              <strong style={{ color: "#33302a" }}>
                {money(results.laborEarnedPerHour)}/hr
              </strong>
              .
            </div>
          </>
        )}
      </SectionCard>
    </div>
  );
}
