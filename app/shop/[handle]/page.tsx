import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { getAllProducts, getProductBySlug } from "@/lib/shopify/queries";
import { isFineArt, productCategory, relatedProducts, TAG } from "@/lib/catalog";
import { toGridCards } from "@/lib/cards";
import { slugify } from "@/lib/slug";
import ProductDetail from "@/components/ProductDetail";
import RelatedProducts from "@/components/RelatedProducts";
import JsonLd from "@/components/JsonLd";
import {
  breadcrumbJsonLd,
  metaDescription,
  openGraph,
  productJsonLd,
} from "@/lib/seo";

type Params = { handle: string };
type Search = { variant?: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProductBySlug(handle);
  if (!product) return {};
  const image = product.featuredImage?.url;
  return {
    title: product.title,
    description: metaDescription(product),
    // Canonical drops ?variant= — colorways are separate products here, so a
    // variant URL is the same page, not a distinct one.
    alternates: { canonical: `/shop/${slugify(product.handle)}` },
    openGraph: openGraph({
      title: product.title,
      description: metaDescription(product),
      images: image ? [{ url: image, alt: product.title }] : undefined,
    }),
  };
}

// Unified buyable PDP — toys and apparel share it. Apparel gates Add to cart on
// option selection; fine art doesn't belong here and heals to its collection URL.
export default async function ShopProductPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<Search>;
}) {
  const { handle } = await params;
  const { variant } = await searchParams;
  const product = await getProductBySlug(handle);
  if (!product) notFound();

  if (isFineArt(product)) {
    permanentRedirect(`/private-collection/${slugify(product.handle)}`);
  }

  const apparel = product.tags.includes(TAG.apparel);
  // Suggestions never cross into fine art — the collection is reached
  // deliberately, not cross-sold into the cart flow.
  const pool = (await getAllProducts()).filter((p) => !isFineArt(p));
  const suggestions = toGridCards(relatedProducts(pool, product), {
    basePath: "/shop",
  });

  return (
    <main className="flex-1 px-3 py-10 md:px-12">
      <JsonLd data={productJsonLd(product)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Madbunny", path: "/" },
          // Same resolver the visible breadcrumb uses — never hand-rolled here.
          productCategory(product),
          { name: product.title, path: `/shop/${slugify(product.handle)}` },
        ])}
      />
      <ProductDetail
        product={product}
        initialVariantId={variant}
        requireVariantSelection={apparel}
      />
      <RelatedProducts cards={suggestions} />
    </main>
  );
}
