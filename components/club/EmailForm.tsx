"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";

// Sits on the white panel — card-gray input bar. Success replaces the form with
// "You are on the list."
export default function EmailForm() {
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState(""); // honeypot
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage(null);
    setError(false);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, company }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (data.ok) {
        setStatus("done");
        setMessage("You are on the list.");
      } else {
        setStatus("idle");
        setError(true);
        setMessage(data.error ?? "Something went wrong. Try again.");
      }
    } catch {
      setStatus("idle");
      setError(true);
      setMessage("Something went wrong. Try again.");
    }
  }

  if (status === "done") {
    return (
      <p role="status" className="mt-6 font-mono text-[12px] text-black">
        {message}
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 w-full max-w-sm">
      <label htmlFor="email" className="sr-only">
        Email address
      </label>
      {/* Honeypot — visually hidden, ignored by humans, filled by bots. */}
      <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="company">Company</label>
        <input
          id="company"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
      </div>
      <div className="flex bg-card">
        <input
          id="email"
          name="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email"
          className="w-full flex-1 bg-transparent px-4 py-3 font-sans text-[13px] text-black outline-none placeholder:text-gun-metal/70"
        />
        <button
          type="submit"
          aria-label="Join the mailing list"
          disabled={status === "loading" || email.trim() === ""}
          className="px-4 text-black transition-opacity hover:opacity-60 disabled:opacity-30"
        >
          <ArrowRight className="h-4 w-4" strokeWidth={2} />
        </button>
      </div>
      {message && (
        <p
          role="status"
          className={`mt-3 text-center font-mono text-[12px] ${error ? "text-mad-red" : "text-black"}`}
        >
          {message}
        </p>
      )}
    </form>
  );
}
