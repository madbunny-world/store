import { NextResponse } from "next/server";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { appendInquiry, hasInquiryEnv } from "@/lib/airtable";

// Public POST behind the fine-art "Inquire" CTA. Same hardening as /api/subscribe
// (honeypot, IP rate limit, server-side validation) but tighter limits — real
// inquiries are rare and high-value. Airtable is the only sink and therefore the
// record of truth: no email is sent by the app (Gia gets notified via an Airtable
// automation), so a failed write must surface to the visitor rather than vanish.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const MAX = { email: 254, fullName: 120, address: 400, note: 1000, product: 200 };

/** Trim, and collapse newlines so a value can't break the composed subject line. */
function oneLine(value: unknown): string {
  return typeof value === "string" ? value.replace(/[\r\n]+/g, " ").trim() : "";
}

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  const ip = clientIp(request.headers);
  const limit = rateLimit(`inquire:${ip}`, { limit: 3, windowSec: 600 });
  if (!limit.ok) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Try again shortly." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSec) } },
    );
  }

  let body: {
    email?: unknown;
    fullName?: unknown;
    address?: unknown;
    note?: unknown;
    productTitle?: unknown;
    company?: unknown;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Bad request." }, { status: 400 });
  }

  // Honeypot: real users never fill "company". Pretend success, write nothing.
  if (typeof body.company === "string" && body.company.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const email = text(body.email).toLowerCase();
  if (!email || email.length > MAX.email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: "Enter a valid email." }, { status: 422 });
  }

  const fullName = oneLine(body.fullName);
  if (!fullName || fullName.length > MAX.fullName) {
    return NextResponse.json({ ok: false, error: "Enter your full name." }, { status: 422 });
  }

  const address = text(body.address);
  if (!address || address.length > MAX.address) {
    return NextResponse.json({ ok: false, error: "Enter an address." }, { status: 422 });
  }

  const note = text(body.note);
  if (note.length > MAX.note) {
    return NextResponse.json({ ok: false, error: "Note is too long." }, { status: 422 });
  }

  // Display-only, and never trusted — it comes from the client. Which piece was
  // inquired about lives in its own Airtable column, so the notification email
  // (an Airtable automation, not this app) composes its subject from Name +
  // Product rather than us storing a pre-baked string.
  const product = oneLine(body.productTitle).slice(0, MAX.product);

  const record = { email, fullName, address, note, product };

  // One sink today; allSettled keeps the shape so a second (email) can be added
  // later without restructuring the outcome logic.
  const results = await Promise.allSettled([
    hasInquiryEnv() ? appendInquiry(record) : Promise.resolve<null>(null),
  ]);

  for (const r of results) {
    if (r.status === "rejected") console.error("[inquire] write failed:", r.reason);
  }

  const configured = hasInquiryEnv();
  const persisted = results.some((r) => r.status === "fulfilled" && r.value !== null);

  if (configured && !persisted) {
    // Airtable is the only record — don't pretend this worked.
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Try again." },
      { status: 502 },
    );
  }
  if (!configured) {
    // Pre-credentials: log the composed record so the whole flow is verifiable
    // without a token. Real writes light up when access is granted — no code change.
    console.warn("[inquire] no persistence configured; dropped inquiry from", email);
    console.info("[inquire] would write:", JSON.stringify(record, null, 2));
  }

  return NextResponse.json({ ok: true });
}
