import type { Product } from "./shopify/types";
import { isFineArt } from "./catalog";
import { siteUrl } from "./site";
import { slugify } from "./slug";

// Structured data (schema.org JSON-LD). Google reads this to show price and
// stock in results and to qualify products for Shopping surfaces — none of
// which the visible markup can express on its own.

export const ORG_ID = `${siteUrl()}/#organization`;

/** Site-wide Organization + WebSite. Rendered once, in the root layout. */
export function organizationJsonLd() {
  const base = siteUrl();
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": ORG_ID,
        name: "Madbunny",
        url: base,
        logo: `${base}/icon.svg`,
        email: "world.madbunny@gmail.com",
        sameAs: ["https://www.instagram.com/madbunny.world/"],
      },
      {
        "@type": "WebSite",
        "@id": `${base}/#website`,
        url: base,
        name: "Madbunny",
        publisher: { "@id": ORG_ID },
      },
    ],
  };
}

/**
 * Share-card image for a category page: the first piece that actually has a
 * photo. Undefined falls back to the site-wide card in the root layout, so a
 * category with no imagery still shares something branded.
 */
export function ogImages(products: Product[], alt: string) {
  const url = products.find((p) => p.featuredImage?.url)?.featuredImage?.url;
  return url ? [{ url, alt }] : undefined;
}

/**
 * Meta description for a product. Prefers the real Shopify copy ("100% Cotton
 * - Black") over repeating the title, which is what search results used to
 * show. Capped near the ~155 chars Google renders.
 */
export function metaDescription(product: Product): string {
  const copy = product.description.trim();
  const text = copy ? `${product.title}. ${copy}.` : `${product.title}.`;
  return text.length > 155 ? `${text.slice(0, 152).trimEnd()}…` : text;
}

/**
 * Product schema. Fine art is inquiry-only, so it never carries a buyable
 * offer — availability there would claim a checkout that does not exist.
 */
export function productJsonLd(product: Product) {
  const base = siteUrl();
  const path = isFineArt(product) ? "private-collection" : "shop";
  const url = `${base}/${path}/${slugify(product.handle)}`;
  const images = product.images.length
    ? product.images.map((i) => i.url)
    : product.featuredImage
      ? [product.featuredImage.url]
      : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${url}#product`,
    name: product.title,
    url,
    ...(product.description ? { description: product.description } : {}),
    ...(images ? { image: images } : {}),
    brand: { "@type": "Brand", name: "Madbunny" },
    ...(product.productType ? { category: product.productType } : {}),
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: product.minPrice.currencyCode,
      price: product.minPrice.amount,
      availability: isFineArt(product)
        ? "https://schema.org/InStoreOnly"
        : product.availableForSale
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      seller: { "@id": ORG_ID },
    },
  };
}

/** Breadcrumb trail: Madbunny → category → product. */
export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  const base = siteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${base}${item.path}`,
    })),
  };
}
