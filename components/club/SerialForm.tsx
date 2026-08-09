"use client";

import { useState, useTransition } from "react";
import { ArrowRight } from "lucide-react";
import { registerSerial } from "@/app/actions/club";

// Ticket-stub serial input for the collectors lounge: mono, wide-tracked,
// corner tick marks — it should look like the plate the serial came from.
// Submission logic and the exact rejection copy (D-04) are unchanged.
export default function SerialForm() {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    startTransition(async () => {
      const res = await registerSerial(code);
      setMessage(res.ok ? "Serial registered." : (res.message ?? "Not a valid serial."));
    });
  }

  // Dark ticks now — the lounge is a white page, not the dark room.
  const tick = "pointer-events-none absolute h-3 w-3 border-black/40";

  // Fills its column, which sets the width. No top margin: the heading it used
  // to sit under is gone, so the form leads the column.
  return (
    <form onSubmit={onSubmit} className="w-full">
      <label
        htmlFor="serial"
        className="block text-left font-mono text-[10px] uppercase tracking-[0.3em] text-gun-metal"
      >
        Enter serial no.
      </label>
      <div className="relative mt-2 p-[6px]">
        {/* Corner ticks */}
        <span aria-hidden className={`${tick} left-0 top-0 border-l border-t`} />
        <span aria-hidden className={`${tick} right-0 top-0 border-r border-t`} />
        <span aria-hidden className={`${tick} bottom-0 left-0 border-b border-l`} />
        <span aria-hidden className={`${tick} bottom-0 right-0 border-b border-r`} />

        <div className="flex bg-card">
          <input
            id="serial"
            name="serial"
            type="text"
            autoComplete="off"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="— — — —"
            className="w-full flex-1 bg-transparent px-4 py-[9.8px] font-mono text-[13px] uppercase tracking-[0.35em] text-black outline-none placeholder:text-gun-metal/50"
          />
          <button
            type="submit"
            aria-label="Register serial"
            disabled={isPending || code.trim() === ""}
            className="px-4 text-black transition-opacity hover:opacity-60 disabled:opacity-30"
          >
            <ArrowRight className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>
      </div>
      {message && (
        <p role="status" className="mt-3 text-center font-mono text-[12px] text-black">
          {message}
        </p>
      )}
    </form>
  );
}
