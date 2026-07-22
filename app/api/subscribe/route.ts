import { NextResponse } from "next/server";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { createSubscriber, hasAdminEnv } from "@/lib/shopify/admin";
import { appendSubscriber, hasAirtableEnv } from "@/lib/airtable";

// Public POST that writes to Shopify + Airtable — so it's hardened: honeypot,
// IP rate limit, server-side email validation. Two writes (D-09): Shopify is the
// real sendable list, Airtable is Gia's working log. Either credential set may be
// absent pre-launch; we persist wherever we can and never expose which.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const ip = clientIp(request.headers);
  const limit = rateLimit(`subscribe:${ip}`, { limit: 5, windowSec: 60 });
  if (!limit.ok) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Try again shortly." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSec) } },
    );
  }

  let body: { email?: unknown; company?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Bad request." }, { status: 400 });
  }

  // Honeypot: real users never fill "company". Pretend success, write nothing.
  if (typeof body.company === "string" && body.company.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!email || email.length > 254 || !EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: "Enter a valid email." }, { status: 422 });
  }

  // Persist to whatever backends are configured. Don't fail the whole request if
  // one write errors — record what we can and log the rest.
  const results = await Promise.allSettled([
    hasAdminEnv() ? createSubscriber(email) : Promise.resolve<null>(null),
    hasAirtableEnv() ? appendSubscriber(email) : Promise.resolve<null>(null),
  ]);

  for (const r of results) {
    if (r.status === "rejected") console.error("[subscribe] write failed:", r.reason);
  }

  const configured = hasAdminEnv() || hasAirtableEnv();
  const persisted = results.some((r) => r.status === "fulfilled" && r.value !== null);

  if (configured && !persisted) {
    // Backends configured but every write failed — surface an error.
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Try again." },
      { status: 502 },
    );
  }
  if (!configured) {
    // Pre-launch: no backend wired yet. Accept the email so the flow works; the
    // real writes light up the moment credentials are added — no code change.
    console.warn("[subscribe] no persistence configured; accepted", email, "without storing");
  }

  return NextResponse.json({ ok: true });
}
