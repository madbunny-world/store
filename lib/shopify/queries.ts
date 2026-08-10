import { hasShopifyEnv, shopifyFetch } from "./client";
import type { Image, Product, ProductVariant } from "./types";
import { slugify } from "../slug";

let warnedNoEnv = false;
function warnNoEnv(what: string) {
  if (!warnedNoEnv) {
    console.warn(
      `[shopify] ${what}: Storefront credentials not set. Set .env.local (see .env.local.example). Returning empty.`,
    );
    warnedNoEnv = true;
  }
}

// ---- GraphQL ----

// Metafields we read, in a stable order. `metafields(identifiers:)` returns a
// positional array with `null` for any not set — so order matters here.
const PRODUCT_METAFIELD_IDS = `[
  {namespace: "custom", key: "year"},
  {namespace: "custom", key: "dimensions_metric"},
  {namespace: "custom", key: "dimensions_in"},
  {namespace: "custom", key: "scale"},
  {namespace: "custom", key: "tier"},
  {namespace: "custom", key: "product_details"},
  {namespace: "custom", key: "fabric"},
  {namespace: "custom", key: "care_instructions"}
]`;

const VARIANT_METAFIELD_IDS = `[
  {namespace: "custom", key: "medium"},
  {namespace: "custom", key: "edition_size"}
]`;

const PRODUCT_FRAGMENT = `
  fragment ProductDetail on Product {
    id
    handle
    title
    descriptionHtml
    # Plain-text twin of descriptionHtml — used for meta descriptions and
    # JSON-LD, where markup would have to be stripped.
    description
    availableForSale
    productType
    tags
    options { id name optionValues { name } }
    priceRange { minVariantPrice { amount currencyCode } }
    featuredImage { url altText width height }
    media(first: 10) {
      nodes {
        ... on MediaImage { image { url altText width height } }
      }
    }
    metafields(identifiers: ${PRODUCT_METAFIELD_IDS}) { key value }
    variants(first: 25) {
      nodes {
        id
        title
        availableForSale
        quantityAvailable
        selectedOptions { name value }
        price { amount currencyCode }
        image { url altText width height }
        metafields(identifiers: ${VARIANT_METAFIELD_IDS}) { key value }
      }
    }
  }
`;

// ---- Raw shapes (only what we read) ----

type RawMetafield = { key: string; value: string } | null;

type RawImage = Image | null;

type RawProduct = {
  id: string;
  handle: string;
  title: string;
  descriptionHtml: string;
  description: string;
  availableForSale: boolean;
  productType: string;
  tags: string[];
  options: { id: string; name: string; optionValues: { name: string }[] }[];
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
  featuredImage: RawImage;
  media: { nodes: { image?: RawImage }[] };
  metafields: RawMetafield[];
  variants: {
    nodes: {
      id: string;
      title: string;
      availableForSale: boolean;
      quantityAvailable: number | null;
      selectedOptions: { name: string; value: string }[];
      price: { amount: string; currencyCode: string };
      image: RawImage;
      metafields: RawMetafield[];
    }[];
  };
};

// ---- Normalization ----

/** Build a key→value map from the positional metafields array (nulls dropped). */
function metafieldMap(fields: RawMetafield[]): Record<string, string> {
  const map: Record<string, string> = {};
  for (const f of fields) {
    if (f && f.value != null) map[f.key] = f.value;
  }
  return map;
}

function toInt(v: string | undefined): number | null {
  if (v == null) return null;
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : null;
}

function normalizeVariant(v: RawProduct["variants"]["nodes"][number]): ProductVariant {
  const m = metafieldMap(v.metafields);
  return {
    id: v.id,
    title: v.title,
    availableForSale: v.availableForSale,
    quantityAvailable: v.quantityAvailable,
    selectedOptions: v.selectedOptions,
    price: v.price,
    image: v.image,
    medium: m.medium ?? null,
    editionSize: toInt(m.edition_size),
  };
}

function normalizeProduct(p: RawProduct): Product {
  const m = metafieldMap(p.metafields);
  const images: Image[] = p.media.nodes
    .map((n) => n.image)
    .filter((img): img is Image => Boolean(img));
  return {
    id: p.id,
    handle: p.handle,
    title: p.title,
    descriptionHtml: p.descriptionHtml,
    description: p.description ?? "",
    availableForSale: p.availableForSale,
    productType: p.productType,
    tags: p.tags,
    options: p.options.map((o) => ({
      id: o.id,
      name: o.name,
      values: o.optionValues.map((ov) => ov.name),
    })),
    minPrice: p.priceRange.minVariantPrice,
    featuredImage: p.featuredImage,
    images,
    variants: p.variants.nodes.map(normalizeVariant),
    year: toInt(m.year),
    dimensionsMetric: m.dimensions_metric ?? null,
    dimensionsIn: m.dimensions_in ?? null,
    scale: m.scale ?? null,
    tier: m.tier ?? null,
    productDetails: m.product_details ?? null,
    fabric: m.fabric ?? null,
    careInstructions: m.care_instructions ?? null,
  };
}

// ---- Public API ----

/**
 * Fetch FULL detail for EVERY product (spec §6.2). The catalog is tiny, so
 * prefetching everything means modals open instantly. The store has no
 * collectibles/apparel collections — pages split this list by tag (lib/catalog).
 * Revisit fetch-on-click / per-collection queries only past ~50 products.
 */
export async function getAllProducts(): Promise<Product[]> {
  if (!hasShopifyEnv()) {
    warnNoEnv("getAllProducts()");
    return [];
  }
  const data = await shopifyFetch<{ products: { nodes: RawProduct[] } }>(
    `
      ${PRODUCT_FRAGMENT}
      query AllProducts {
        products(first: 50) { nodes { ...ProductDetail } }
      }
    `,
    { revalidate: 60, tags: ["products"] },
  );
  return data.products.nodes.map(normalizeProduct);
}

/**
 * Resolve a product by its URL slug (slugify(handle)). Handles may contain
 * characters that can't live in a clean URL, so we match on the slug against the
 * (cached) full catalog rather than query Shopify by raw handle.
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const all = await getAllProducts();
  return all.find((p) => slugify(p.handle) === slug) ?? null;
}

export async function getProduct(handle: string): Promise<Product | null> {
  if (!hasShopifyEnv()) {
    warnNoEnv(`getProduct("${handle}")`);
    return null;
  }
  const data = await shopifyFetch<{ product: RawProduct | null }>(
    `
      ${PRODUCT_FRAGMENT}
      query ProductByHandle($handle: String!) {
        product(handle: $handle) { ...ProductDetail }
      }
    `,
    { variables: { handle }, revalidate: 60, tags: [`product:${handle}`] },
  );
  return data.product ? normalizeProduct(data.product) : null;
}
