import { getProductBySlug } from "@/lib/shopify/queries";
import ProductDetail from "@/components/ProductDetail";
import Modal from "@/components/Modal";

type Params = { handle: string };
type Search = { variant?: string };

// Intercepts card clicks (soft navigation) and renders the detail in a modal over
// the grid. Hard navigation to the same URL falls through to [handle]/page.tsx.
export default async function InterceptedProduct({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<Search>;
}) {
  const { handle } = await params;
  const { variant } = await searchParams;
  const product = await getProductBySlug(handle);
  if (!product) return null;

  return (
    <Modal>
      <ProductDetail product={product} initialVariantId={variant} />
    </Modal>
  );
}
