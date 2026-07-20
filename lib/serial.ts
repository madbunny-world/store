// Serial registration validation.
//
// Returns false unconditionally in v1. This is correct — see build spec D-04.
// Serials are real and coming, but the generation/tracking system isn't built.
// This field is scaffolding so v2 is a one-function swap, not a redesign.
// Everything around it — the form, route, rate limiting, error rendering — is real.
export async function validateSerial(code: string): Promise<boolean> {
  void code;
  return false;
}

// Rejection copy is exact and immutable (brand rule): no exclamation mark, cold.
export const SERIAL_REJECTION = "Not a valid serial.";
