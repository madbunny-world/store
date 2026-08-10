import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { getAllProducts, getProductBySlug } from "@/lib/shopify/queries";
import { isFineArt, productCategory, relatedProducts } from "@/lib/catalog";
import { toGridCards } from "@/lib/cards";
import { slugify } from "@/lib/slug";
import ProductDetail from "@/components/ProductDetail";
import RelatedProducts from "@/components/RelatedProducts";
import JsonLd from "@/components/JsonLd";
import { breadcrumbJsonLd, metaDescription, productJsonLd } from "@/lib/seo";

type Params = { handle: string };

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
    alternates: {
      canonical: `/private-collection/${slugify(product.handle)}`,
    },
    openGraph: {
      title: product.title,
      description: metaDescription(product),
      type: "website",
      images: image ? [{ url: image }] : undefined,
    },
  };
}

// Fine-art PDP: ProductDetail's fine-art branch shows Inquire (dialog → Airtable)
// instead of a cart, and never a Sold state. A buyable slug requested here heals
// to its /shop URL.
export default async function PrivateCollectionWorkPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { handle } = await params;
  const product = await getProductBySlug(handle);
  if (!product) notFound();

  if (!isFineArt(product)) {
    permanentRedirect(`/shop/${slugify(product.handle)}`);
  }

  const pool = (await getAllProducts()).filter(isFineArt);
  const suggestions = toGridCards(relatedProducts(pool, product), {
    basePath: "/private-collection",
  });

  return (
    <main className="flex-1 px-4 py-10 sm:px-6">
      <JsonLd data={productJsonLd(product)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Madbunny", path: "/" },
          // Same resolver the visible breadcrumb uses — never hand-rolled here.
          productCategory(product),
          {
            name: product.title,
            path: `/private-collection/${slugify(product.handle)}`,
          },
        ])}
      />
      <ProductDetail product={product} />
      <RelatedProducts cards={suggestions} heading="From the collection" />
    </main>
  );
}
