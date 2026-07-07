import type { CSSProperties, ReactNode } from "react";

// ---- Design tokens (from the handoff) ----
export const SANS =
  "var(--font-sans), 'IBM Plex Sans', system-ui, sans-serif";
export const MONO = "var(--font-mono), 'IBM Plex Mono', monospace";

export const INK = "#26241f";
export const BODY = "#3f3b33";
export const SECONDARY = "#736d61";
export const MUTED = "#8a8474";
export const MUTED_LIGHT = "#a39c8d";
export const MUTED_ALT = "#9a9384";
export const CARD_BG = "#fffdf9";
export const CARD_BORDER = "#e5e1d7";
export const CARD_BORDER_SOFT = "#e8e4da";
export const HAIRLINE = "#f0ede4";
export const INPUT_BORDER = "#d8d3c7";

export const GREEN = "oklch(0.52 0.09 150)";
export const GREEN_DARK = "oklch(0.44 0.09 150)";
export const GREEN_DEEP = "oklch(0.46 0.11 150)";
export const GREEN_HEADING = "oklch(0.5 0.05 150)";
export const AMBER = "oklch(0.5 0.13 55)";
export const AMBER_LABEL = "oklch(0.55 0.13 55)";
export const AMBER_MARKER = "oklch(0.6 0.13 55)";
export const RED = "oklch(0.53 0.16 27)";
export const RED_ACCENT = "oklch(0.55 0.15 27)";

// ---- Shared style fragments ----
export const sectionHeadingStyle: CSSProperties = {
  margin: 0,
  fontSize: 12,
  fontFamily: MONO,
  letterSpacing: ".08em",
  textTransform: "uppercase",
  color: GREEN_HEADING,
};

export const labelStyle: CSSProperties = {
  fontSize: 13,
  color: BODY,
  flex: 1,
};

export const unitStyle: CSSProperties = {
  color: MUTED_LIGHT,
  fontFamily: MONO,
  fontSize: 11,
};

export const helperStyle: CSSProperties = {
  fontSize: 11,
  color: MUTED,
  lineHeight: 1.4,
};

const inputBaseStyle: CSSProperties = {
  padding: "6px 8px",
  border: `1px solid ${INPUT_BORDER}`,
  borderRadius: 6,
  font: "inherit",
  fontSize: 13,
  background: "#fff",
  color: INK,
};

// ---- Primitives ----

export function SectionCard({
  title,
  headerRight,
  children,
  style,
}: {
  title: string;
  headerRight?: ReactNode;
  children: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <section
      style={{
        background: CARD_BG,
        border: `1px solid ${CARD_BORDER}`,
        borderRadius: 10,
        padding: "16px 16px 8px",
        marginBottom: 14,
        ...style,
      }}
    >
      {headerRight ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
            margin: "0 0 6px",
          }}
        >
          <h3 style={sectionHeadingStyle}>{title}</h3>
          {headerRight}
        </div>
      ) : (
        <h3 style={{ ...sectionHeadingStyle, margin: "0 0 6px" }}>{title}</h3>
      )}
      {children}
    </section>
  );
}

export function InputRow({
  label,
  unit,
  divider = "bottom",
  children,
}: {
  label: string;
  unit?: string;
  divider?: "bottom" | "top" | "none";
  children: ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        padding: divider === "none" ? "8px 0 4px" : "8px 0",
        borderBottom:
          divider === "bottom" ? `1px solid ${HAIRLINE}` : undefined,
        borderTop: divider === "top" ? `1px solid ${HAIRLINE}` : undefined,
      }}
    >
      <label style={labelStyle}>
        {label}
        {unit ? <span style={unitStyle}> ({unit})</span> : null}
      </label>
      {children}
    </div>
  );
}

export function NumberField({
  name,
  value,
  onChange,
  width = 96,
  min,
  max,
  step,
  dollar = false,
}: {
  name: string;
  value: number | "";
  onChange: (raw: string) => void;
  width?: number;
  min?: number;
  max?: number;
  step?: number;
  dollar?: boolean;
}) {
  const input = (
    <input
      type="number"
      name={name}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      min={min}
      max={max}
      step={step}
      style={{ ...inputBaseStyle, width, textAlign: "right" }}
    />
  );
  if (!dollar) return input;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <span style={{ color: MUTED_LIGHT, fontSize: 13 }}>$</span>
      {input}
    </div>
  );
}

export function TypicalButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        fontSize: 10,
        letterSpacing: ".03em",
        color: GREEN_HEADING,
        background: "none",
        border: "1px solid #e0dccf",
        borderRadius: 5,
        padding: "5px 6px",
        cursor: "pointer",
        fontFamily: MONO,
      }}
    >
      typical
    </button>
  );
}

export function IncludeToggle({
  name,
  checked,
  onChange,
}: {
  name: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        cursor: "pointer",
        fontSize: 11,
        color: MUTED,
        fontFamily: MONO,
        userSelect: "none",
      }}
    >
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        style={{
          width: 15,
          height: 15,
          accentColor: GREEN,
          cursor: "pointer",
        }}
      />
      include
    </label>
  );
}

export function StatCard({
  label,
  value,
  valueColor = "#54503f",
  valueWeight = 600,
  background = CARD_BG,
  borderColor = CARD_BORDER_SOFT,
}: {
  label: string;
  value: string;
  valueColor?: string;
  valueWeight?: number;
  background?: string;
  borderColor?: string;
}) {
  return (
    <div
      style={{
        background,
        border: `1px solid ${borderColor}`,
        borderRadius: 9,
        padding: "11px 13px",
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      <div
        style={{
          fontSize: 10,
          textTransform: "uppercase",
          letterSpacing: ".05em",
          color: MUTED_ALT,
          fontFamily: MONO,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 19,
          fontWeight: valueWeight,
          fontVariantNumeric: "tabular-nums",
          color: valueColor,
        }}
      >
        {value}
      </div>
    </div>
  );
}
