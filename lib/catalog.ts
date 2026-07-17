import type { Product } from "./shopify/types";

// The store has no collectibles/apparel collections; the catalog is organized by
// tags. Pages are driven off these (confirmed with Gia).
export const TAG = {
  toy: "Collectible toys",
  fineArt: "Fine art collection",
  apparel: "Apparel",
} as const;

export function isFineArt(product: Product): boolean {
  return product.tags.includes(TAG.fineArt);
}

/** Collectibles = toys first, then fine-art pieces (store order within each). */
export function collectibles(products: Product[]): Product[] {
  const toys = products.filter((p) => p.tags.includes(TAG.toy));
  const art = products.filter((p) => p.tags.includes(TAG.fineArt));
  return [...toys, ...art];
}

export function apparel(products: Product[]): Product[] {
  return products.filter((p) => p.tags.includes(TAG.apparel));
}
