import { getAllProducts } from "@/lib/shopify/queries";
import { buyables } from "@/lib/catalog";
import { slugify } from "@/lib/slug";
import CartDrawer from "./CartDrawer";

export type UpsellItem = {
  /** Raw Shopify handle — what a cart line reports, so it is the dedupe key. */
  handle: string;
  /** Present only when the product has a single variant — the "Add" path. */
  variantId: string | null;
  title: string;
  price: string;
  image: { url: string; alt: string } | null;
  href: string;
};

// Server wrapper: the drawer is a client component and can't reach Shopify, so
// the upsell pool is resolved here and handed down. Only in-stock buyables —
// suggesting a sold-out piece inside the bag would be a dead end.
export default async function CartUpsells() {
  const products = await getAllProducts();
  const items: UpsellItem[] = buyables(products)
    .filter((p) => p.availableForSale)
    .map((p) => ({
      handle: p.handle,
      // Multi-variant products need a size chosen, so they link to the PDP
      // instead of adding blind.
      variantId: p.variants.length === 1 ? p.variants[0].id : null,
      title: p.title,
      price: p.minPrice.amount,
      image: p.featuredImage
        ? { url: p.featuredImage.url, alt: p.featuredImage.altText ?? p.title }
        : null,
      href: `/shop/${slugify(p.handle)}`,
    }));

  return <CartDrawer upsells={items} />;
}
