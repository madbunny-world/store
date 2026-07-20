"use server";

import { headers } from "next/headers";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { SERIAL_REJECTION, validateSerial } from "@/lib/serial";

export type SerialResult = { ok: boolean; message?: string };

// Serial registration. The form, route, and rate limiting are real; validation
// always rejects in v1 (D-04). v2 swaps lib/serial.ts only.
export async function registerSerial(code: string): Promise<SerialResult> {
  const ip = clientIp(await headers());
  const limit = rateLimit(`serial:${ip}`, { limit: 10, windowSec: 60 });
  if (!limit.ok) {
    return { ok: false, message: "Too many attempts. Try again shortly." };
  }

  const trimmed = code.trim();
  if (!trimmed) return { ok: false, message: SERIAL_REJECTION };

  const valid = await validateSerial(trimmed);
  if (!valid) return { ok: false, message: SERIAL_REJECTION };

  return { ok: true };
}
