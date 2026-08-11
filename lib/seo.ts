import type { Metadata } from "next";
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

/** The purpose-made 1200×630 card. Default for any page without its own. */
export const SITE_CARD = {
  url: "/media/social-card.jpg",
  width: 1200,
  height: 630,
  alt: "Madbunny",
};

type OgImage = { url: string; width?: number; height?: number; alt: string };

/**
 * Builds a COMPLETE openGraph object.
 *
 * Next replaces a parent's `openGraph` wholesale as soon as a child declares
 * one — it does not merge field by field. A page that set only `title` silently
 * lost its image, site name and type, which is how the home page ended up
 * sharing with no og:image at all (Gia spotted it in a KakaoTalk card, 2026-08;
 * Kakao then fell back to scraping a random product photo off the page). Every
 * page that customizes ANY og field must go through here.
 */
export function openGraph({
  title,
  description,
  images,
}: {
  title?: string;
  description: string;
  images?: OgImage[];
}): Metadata["openGraph"] {
  return {
    siteName: "Madbunny",
    type: "website",
    ...(title ? { title } : {}),
    description,
    images: images ?? [SITE_CARD],
  };
}

/**
 * Share-card image for a category page: the first piece that actually has a
 * photo. Undefined falls back to SITE_CARD via openGraph(), so a category with
 * no imagery still shares something branded.
 */
export function ogImages(
  products: Product[],
  alt: string,
): OgImage[] | undefined {
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
