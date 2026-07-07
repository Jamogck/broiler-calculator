"use client";

import dynamic from "next/dynamic";

// The calculator derives "today" from the clock and reads the URL query on
// first render, so it is rendered client-only to avoid hydration mismatches.
const Calculator = dynamic(() => import("@/components/Calculator"), {
  ssr: false,
});

export default function Page() {
  return <Calculator />;
}
