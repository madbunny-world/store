import { getProductBySlug } from "@/lib/shopify/queries";
import ProductDetail from "@/components/ProductDetail";
import Modal from "@/components/Modal";

type Params = { handle: string };
type Search = { variant?: string };

export default async function InterceptedApparel({
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
      <ProductDetail product={product} initialVariantId={variant} requireVariantSelection />
    </Modal>
  );
}
