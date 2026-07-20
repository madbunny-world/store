// Google Sheets append via a GCP service account (D-09). The Sheet is Gia's
// working record, not the mailing list (Shopify is the list). Credentials are the
// full service-account JSON in env; the sheet must be shared with the account's
// client_email. Never an Apps Script public URL, never client-side.

import { GoogleAuth } from "google-auth-library";

const SHEET_ID = process.env.GOOGLE_SHEET_ID;
const SA_JSON = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;

export function hasSheetsEnv(): boolean {
  return Boolean(SHEET_ID && SA_JSON);
}

let auth: GoogleAuth | null = null;
function getAuth(): GoogleAuth {
  if (!auth) {
    auth = new GoogleAuth({
      credentials: JSON.parse(SA_JSON!),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
  }
  return auth;
}

/** Append one subscriber row: [ISO timestamp, email, source]. */
export async function appendSubscriber(email: string, source = "jointheclub"): Promise<void> {
  if (!hasSheetsEnv()) throw new Error("Google Sheets not configured");

  const token = await getAuth().getAccessToken();
  const range = "Sheet1!A:C";
  const url =
    `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(range)}` +
    `:append?valueInputOption=USER_ENTERED`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify({ values: [[new Date().toISOString(), email, source]] }),
  });

  if (!res.ok) throw new Error(`Sheets append ${res.status}: ${await res.text()}`);
}
