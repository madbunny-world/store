import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/shopify/queries";
import ProductDetail from "@/components/ProductDetail";

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
    description: `${product.title}. ${product.tier ?? ""}`.trim(),
    openGraph: {
      title: product.title,
      images: image ? [{ url: image }] : undefined,
    },
  };
}

export default async function ProductPage({
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

  return (
    <main className="flex-1 px-4 py-10 sm:px-6">
      <ProductDetail product={product} initialVariantId={variant} />
    </main>
  );
}
