import { clamp } from "@/lib/calculations";
import { fmt1 } from "@/lib/format";
import { AMBER_LABEL, AMBER_MARKER, GREEN, MUTED_LIGHT } from "./ui";

const W = 600;
const H = 236;
const PAD_L = 42;
const PAD_R = 14;
const PAD_T = 18;
const PAD_B = 30;

export default function RationChart({
  daily,
  currentDay,
  peak,
}: {
  daily: number[];
  currentDay: number;
  peak: number;
}) {
  const n = daily.length;
  const iw = W - PAD_L - PAD_R;
  const ih = H - PAD_T - PAD_B;
  const max = peak > 0 ? peak : 1;
  const x = (i: number) => PAD_L + (n <= 1 ? 0 : (i / (n - 1)) * iw);
  const y = (v: number) => PAD_T + ih - (v / max) * ih;

  let line = "";
  let area = `M${x(0).toFixed(1)} ${(PAD_T + ih).toFixed(1)} `;
  daily.forEach((v, i) => {
    line += `${i ? "L" : "M"}${x(i).toFixed(1)} ${y(v).toFixed(1)} `;
    area += `L${x(i).toFixed(1)} ${y(v).toFixed(1)} `;
  });
  area += `L${x(n - 1).toFixed(1)} ${(PAD_T + ih).toFixed(1)} Z`;

  const weeks = Math.ceil(n / 7);
  const weekTicks = Array.from({ length: weeks }, (_, i) => {
    const w = i + 1;
    return { w, day: Math.min(w * 7, n) };
  });

  const showToday = currentDay >= 1 && currentDay <= n;
  const tx = showToday ? x(currentDay - 1) : 0;
  const ty = showToday ? y(daily[currentDay - 1]) : 0;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      preserveAspectRatio="xMidYMid meet"
      style={{ height: "auto", display: "block", maxHeight: 260 }}
      role="img"
      aria-label="Daily feed ration across the flock"
    >
      {[0, 0.5, 1].map((f) => {
        const gy = PAD_T + ih - f * ih;
        return (
          <g key={f}>
            <line
              x1={PAD_L}
              y1={gy}
              x2={W - PAD_R}
              y2={gy}
              stroke="#ece8de"
              strokeWidth={1}
            />
            <text
              x={PAD_L - 7}
              y={gy + 3}
              textAnchor="end"
              fontSize={9}
              fill={MUTED_LIGHT}
              fontFamily="var(--font-mono), 'IBM Plex Mono', monospace"
            >
              {fmt1(f * max)}
            </text>
          </g>
        );
      })}
      {weekTicks.map(({ w, day }) => (
        <text
          key={w}
          x={x(day - 1)}
          y={H - 9}
          textAnchor="middle"
          fontSize={9}
          fill={MUTED_LIGHT}
          fontFamily="var(--font-mono), 'IBM Plex Mono', monospace"
        >
          {`w${w}`}
        </text>
      ))}
      <path d={area} fill="oklch(0.52 0.09 150 / 0.13)" />
      <path
        d={line}
        fill="none"
        stroke={GREEN}
        strokeWidth={2}
        strokeLinejoin="round"
      />
      {showToday && (
        <>
          <line
            x1={tx}
            y1={PAD_T}
            x2={tx}
            y2={PAD_T + ih}
            stroke={AMBER_MARKER}
            strokeWidth={1.5}
            strokeDasharray="4 3"
          />
          <circle cx={tx} cy={ty} r={4} fill={AMBER_MARKER} />
          <text
            x={clamp(tx, PAD_L + 12, W - PAD_R - 12)}
            y={PAD_T - 5}
            textAnchor="middle"
            fontSize={9.5}
            fontWeight={600}
            fill={AMBER_LABEL}
            fontFamily="var(--font-mono), 'IBM Plex Mono', monospace"
          >
            today
          </text>
        </>
      )}
    </svg>
  );
}
