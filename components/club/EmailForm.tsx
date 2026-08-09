"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";

// Two skins over one subscribe flow (same POST, honeypot and state machine):
// "light" sits on the white club panel with an arrow button; "dark" is the black
// footer bar with a SUBSCRIBE label. Success replaces the form with
// "You are on the list."
export default function EmailForm({
  variant = "light",
}: {
  variant?: "light" | "dark";
}) {
  const dark = variant === "dark";
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
      <p
        role="status"
        className={`mt-6 font-mono ${dark ? "text-[10px] text-bunny-white" : "text-[12px] text-black"}`}
      >
        {message}
      </p>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className={dark ? "mt-4 w-full" : "mt-6 w-full max-w-[16.8rem]"}
    >
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
      <div className={`flex ${dark ? "bg-[#333333]" : "bg-card"}`}>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={dark ? "Email Address*" : "Enter email"}
          className={`w-full flex-1 bg-transparent px-4 font-sans outline-none ${
            dark
              ? "py-[9px] text-[13px] text-bunny-white placeholder:text-white/45"
              : "py-3 text-[13px] text-black placeholder:text-gun-metal/70"
          }`}
        />
        {/* Dark stays full white on an empty field (it reads as a label, not a
            dimmed control); the input's `required` shows native validation on an
            empty submit. Only the in-flight state disables it. */}
        <button
          type="submit"
          aria-label="Join the mailing list"
          disabled={
            dark ? status === "loading" : status === "loading" || email.trim() === ""
          }
          className={
            dark
              ? "shrink-0 px-5 font-sans text-[12px] uppercase tracking-wide text-white transition-opacity hover:opacity-60"
              : "px-4 text-black transition-opacity hover:opacity-60 disabled:opacity-30"
          }
        >
          {dark ? (
            status === "loading" ? (
              "Sending"
            ) : (
              "Subscribe"
            )
          ) : (
            <ArrowRight className="h-4 w-4" strokeWidth={2} />
          )}
        </button>
      </div>
      {message && (
        <p
          role="status"
          className={`mt-3 font-mono ${dark ? "text-[10px] " : "text-[12px] text-center "}${
            error ? "text-mad-red" : dark ? "text-bunny-white" : "text-black"
          }`}
        >
          {message}
        </p>
      )}
    </form>
  );
}
