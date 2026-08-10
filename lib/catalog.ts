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

/**
 * The category page a piece belongs to — the single source for the visible
 * breadcrumb AND the breadcrumb JSON-LD. They must agree: structured data that
 * disagrees with what the page shows is a spam signal, and they drifted once
 * already. Untagged products fall back to the shop index rather than guessing.
 */
export function productCategory(product: Product): {
  name: string;
  path: string;
} {
  if (product.tags.includes(TAG.fineArt))
    return { name: "Private Collection", path: "/private-collection" };
  if (product.tags.includes(TAG.apparel))
    return { name: "Apparel", path: "/apparel" };
  if (product.tags.includes(TAG.toy))
    return { name: "“Hello, world” collection", path: "/helloworldcollection" };
  return { name: "Shop", path: "/" };
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

/** Everything that goes through the cart — toys first, then apparel. Fine art
 *  is inquiry-only and deliberately excluded (it lives in /private-collection). */
export function buyables(products: Product[]): Product[] {
  const toys = products.filter((p) => p.tags.includes(TAG.toy));
  const wear = products.filter((p) => p.tags.includes(TAG.apparel));
  return [...toys, ...wear];
}

/** Which of the three groups a product belongs to. Apparel wins if double-tagged. */
function group(p: Product): string {
  if (p.tags.includes(TAG.apparel)) return TAG.apparel;
  if (p.tags.includes(TAG.fineArt)) return TAG.fineArt;
  return TAG.toy;
}

/**
 * Suggestions for the "You may also like" row: same group first (a toy suggests
 * toys, a painting suggests paintings), then the rest of the pool. The CALLER
 * scopes the pool — shop PDPs pass buyables only, collection PDPs pass fine art
 * only — so cart items and inquiry-only works never cross-suggest.
 */
export function relatedProducts(
  pool: Product[],
  current: Product,
  limit = 4,
): Product[] {
  const rest = pool.filter((p) => p.id !== current.id);
  const currentGroup = group(current);
  const sameGroup = rest.filter((p) => group(p) === currentGroup);
  const others = rest.filter((p) => group(p) !== currentGroup);
  return [...sameGroup, ...others].slice(0, limit);
}
