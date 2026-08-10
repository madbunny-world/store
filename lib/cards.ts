import type { Money, Product, ProductVariant } from "./shopify/types";
import { isFineArt } from "./catalog";
import { slugify } from "./slug";

/** Total stock across variants; null when no variant tracks inventory. */
function totalQuantity(variants: ProductVariant[]): number | null {
  const tracked = variants.filter((v) => v.quantityAvailable != null);
  if (tracked.length === 0) return null;
  return tracked.reduce((sum, v) => sum + (v.quantityAvailable ?? 0), 0);
}

// Grid cards ≠ products. Product A ("Hello, World") is one product rendered as
// THREE cards, one per colorway (D-08). Paintings are one card each. The rule:
// a product with a "Color" option and >1 variant expands per variant.

export type GridCard = {
  key: string;
  href: string;
  title: string;
  year: number | null;
  medium: string | null;
  dimensionsMetric: string | null;
  dimensionsIn: string | null;
  image: { url: string; altText: string | null } | null;
  /** Second shot, revealed on hover. Null when the piece has only one image. */
  hoverImage: { url: string; altText: string | null } | null;
  available: boolean;
  /** Stock remaining (variant or product total); null when untracked. */
  quantityAvailable: number | null;
  price: Money;
  /** Inquiry-only piece — grid shows no stock line, just name + price. */
  fineArt: boolean;
};

function colorOption(p: Product) {
  return p.options.find((o) => o.name.toLowerCase() === "color");
}

function baseCard(
  p: Product,
): Omit<
  GridCard,
  | "key"
  | "href"
  | "medium"
  | "image"
  | "hoverImage"
  | "available"
  | "quantityAvailable"
  | "price"
  | "fineArt"
> {
  return {
    title: p.title,
    year: p.year,
    dimensionsMetric: p.dimensionsMetric,
    dimensionsIn: p.dimensionsIn,
  };
}

/** The first image that isn't the one already showing — the hover reveal. */
function secondImage(p: Product, shown: Product["featuredImage"]) {
  return p.images.find((img) => img.url !== shown?.url) ?? null;
}

function variantCard(p: Product, v: ProductVariant, basePath: string): GridCard {
  const image = v.image ?? p.featuredImage;
  return {
    ...baseCard(p),
    key: v.id,
    href: `${basePath}/${slugify(p.handle)}?variant=${encodeURIComponent(v.id)}`,
    medium: v.medium,
    image,
    hoverImage: secondImage(p, image),
    available: v.availableForSale,
    quantityAvailable: v.quantityAvailable,
    price: v.price,
    fineArt: isFineArt(p),
  };
}

function productCard(p: Product, basePath: string): GridCard {
  return {
    ...baseCard(p),
    key: p.id,
    href: `${basePath}/${slugify(p.handle)}`,
    medium: p.variants[0]?.medium ?? null,
    image: p.featuredImage,
    hoverImage: secondImage(p, p.featuredImage),
    available: p.availableForSale,
    quantityAvailable: totalQuantity(p.variants),
    price: p.minPrice,
    fineArt: isFineArt(p),
  };
}

/**
 * One card per product by default. `expandColorways` splits a Color-option
 * product into one card per colorway (spec D-08) — used only if a colorway
 * product is ever modeled as a single product with variants. Apparel keeps one
 * card per tee (choose the color in the detail view), so leave it off there.
 */
export function toGridCards(
  products: Product[],
  { basePath = "/collectibles", expandColorways = false } = {},
): GridCard[] {
  const cards: GridCard[] = [];
  for (const p of products) {
    if (expandColorways && colorOption(p) && p.variants.length > 1) {
      for (const v of p.variants) cards.push(variantCard(p, v, basePath));
    } else {
      cards.push(productCard(p, basePath));
    }
  }
  return cards;
}
