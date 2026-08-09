// Airtable logging for email subscribers — Gia's working record. The Shopify
// customer list remains the real sendable marketing list (D-09); Airtable is the
// convenient view. REST API + a Personal Access Token; server-side only.

const TOKEN = process.env.AIRTABLE_TOKEN;
const BASE_ID = process.env.AIRTABLE_BASE_ID;
const TABLE = process.env.AIRTABLE_TABLE ?? "Subscribers";

export function hasAirtableEnv(): boolean {
  return Boolean(TOKEN && BASE_ID);
}

/** Append one subscriber row. The table needs text fields "Email" and "Source". */
export async function appendSubscriber(email: string, source = "footer"): Promise<void> {
  if (!hasAirtableEnv()) throw new Error("Airtable not configured");

  const url = `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(TABLE)}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify({
      typecast: true,
      records: [{ fields: { Email: email, Source: source } }],
    }),
  });

  if (!res.ok) throw new Error(`Airtable ${res.status}: ${await res.text()}`);
}

// ---- Fine-art inquiries ----
// A different base from the subscriber list. Addressed by table ID (tbl…) rather
// than name, so renaming the tab in Airtable can't break the write — the class of
// bug that "Subscribers" vs "Email Signups" caused above. The PAT must be granted
// access to this base; if it isn't, Airtable answers 403
// INVALID_PERMISSIONS_OR_MODEL_NOT_FOUND, which reads like a missing table.
const INQUIRY_TOKEN = process.env.AIRTABLE_INQUIRIES_TOKEN ?? TOKEN;
const INQUIRY_BASE_ID = process.env.AIRTABLE_INQUIRIES_BASE_ID ?? "appQq5yZoOpZt95Fv";
const INQUIRY_TABLE = process.env.AIRTABLE_INQUIRIES_TABLE ?? "tbliIFPFe6xA42OhX";

export function hasInquiryEnv(): boolean {
  return Boolean(INQUIRY_TOKEN && INQUIRY_BASE_ID && INQUIRY_TABLE);
}

export type InquiryRecord = {
  email: string;
  fullName: string;
  address: string;
  note: string;
  product: string;
};

/**
 * Append one collector inquiry. Fields match the live table schema (verified
 * 2026-08): Email, Name, Address, Note, Product — Airtable 422s on any field it
 * doesn't know. "Created time" is computed and "Outreach Status" is Gia's manual
 * workflow column, so neither is written here. Returns true so callers can tell
 * a real write from a skipped one.
 */
export async function appendInquiry(rec: InquiryRecord): Promise<true> {
  if (!hasInquiryEnv()) throw new Error("Airtable inquiries not configured");

  const url = `https://api.airtable.com/v0/${INQUIRY_BASE_ID}/${encodeURIComponent(INQUIRY_TABLE)}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${INQUIRY_TOKEN}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify({
      typecast: true,
      records: [
        {
          fields: {
            Email: rec.email,
            Name: rec.fullName,
            Address: rec.address,
            Note: rec.note,
            Product: rec.product,
          },
        },
      ],
    }),
  });

  if (!res.ok) throw new Error(`Airtable ${res.status}: ${await res.text()}`);
  return true;
}
