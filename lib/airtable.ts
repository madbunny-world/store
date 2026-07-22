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
export async function appendSubscriber(email: string, source = "jointheclub"): Promise<void> {
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
