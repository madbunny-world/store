import { notFound, permanentRedirect } from "next/navigation";
import { getProductBySlug } from "@/lib/shopify/queries";
import { isFineArt } from "@/lib/catalog";
import { slugify } from "@/lib/slug";

type Params = { handle: string };
type Search = { variant?: string };

// v2 → v3 URL healer. Old /collectibles URLs covered both toys (now /shop) and
// fine art (now /private-collection) — only a catalog lookup can tell them
// apart, so this can't be a next.config redirect. Keep until old-URL traffic
// dies. Preserves ?variant= so shared colorway links still preselect.
export default async function LegacyCollectiblePage({
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

  const slug = slugify(product.handle);
  const query = variant ? `?variant=${encodeURIComponent(variant)}` : "";
  permanentRedirect(
    isFineArt(product)
      ? `/private-collection/${slug}`
      : `/shop/${slug}${query}`,
  );
}
