"use client";

import { useState, useTransition } from "react";
import { ArrowRight } from "lucide-react";
import { registerSerial } from "@/app/actions/club";

// Sits on the red madclub photo panel — white input bar, messages in white for
// legibility on the dark backsplash. Rejection copy is exact (D-04).
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

  return (
    <form onSubmit={onSubmit} className="mt-6 w-full max-w-[16.8rem]">
      <label htmlFor="serial" className="sr-only">
        Serial code
      </label>
      <div className="flex bg-white">
        <input
          id="serial"
          name="serial"
          type="text"
          autoComplete="off"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter serial code"
          className="w-full flex-1 bg-transparent px-4 py-3 font-sans text-[13px] text-black outline-none placeholder:text-gun-metal/70"
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
      {message && (
        <p role="status" className="mt-3 text-center font-mono text-[12px] text-bunny-white">
          {message}
        </p>
      )}
    </form>
  );
}
