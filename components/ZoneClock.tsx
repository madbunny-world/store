"use client";

import { useEffect, useState } from "react";
import { zoneTime, type ZoneReadout } from "@/lib/time";

// Client-only clock with a stable SSR placeholder — rendering live time on the
// server would throw a hydration mismatch (spec §7.1). Time AND offset come from
// Intl in lib/time.ts; nothing is hardcoded here.
export default function ZoneClock({ timeZone }: { timeZone: string }) {
  const [readout, setReadout] = useState<ZoneReadout | null>(null);

  useEffect(() => {
    const tick = () => setReadout(zoneTime(new Date(), timeZone));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [timeZone]);

  if (!readout) {
    // Stable SSR placeholder — must not differ from first client render.
    return (
      <span className="tabular-nums" suppressHydrationWarning>
        --:-- —
      </span>
    );
  }

  return (
    <span className="tabular-nums" suppressHydrationWarning>
      {readout.hh}
      <span className="animate-clock-blink mx-px">:</span>
      {readout.mm} {readout.offset}
    </span>
  );
}
