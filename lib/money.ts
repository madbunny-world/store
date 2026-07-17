import type { Money } from "./shopify/types";

/**
 * Format a price with NO cents (brand rule, spec §8): `$35`, `$6,400`.
 * Rounds to whole units and groups thousands.
 */
export function formatMoney(money: Money): string {
  const amount = Math.round(parseFloat(money.amount));
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: money.currencyCode || "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
