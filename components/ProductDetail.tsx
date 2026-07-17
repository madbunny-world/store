import type { Product } from "@/lib/shopify/types";
import BuyPanel from "./BuyPanel";
import ProductGallery from "./ProductGallery";

// Shared by the modal (@modal/(.)[handle]) and the full page ([handle]) — both
// render this from the same data. Static product-level info here; variant-driven
// bits (price, medium, edition, stock, action) live in the client BuyPanel.
export default function ProductDetail({
  product,
  initialVariantId,
  requireVariantSelection = false,
}: {
  product: Product;
  initialVariantId?: string;
  requireVariantSelection?: boolean;
}) {
  return (
    <div className="grid gap-8 md:grid-cols-2 md:gap-12">
      {/* Images — media.nodes, browsable */}
      <ProductGallery images={product.images} title={product.title} />

      {/* Info */}
      <div>
        <h2 className="font-mono text-lg leading-tight">{product.title}</h2>
        <div className="mt-6">
          <BuyPanel
            product={product}
            initialVariantId={initialVariantId}
            requireSelection={requireVariantSelection}
          />
        </div>
        {product.descriptionHtml && (
          <div
            className="prose-sm mt-8 max-w-none font-sans text-[13px] leading-relaxed text-gun-metal [&_p]:mb-3"
            dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
          />
        )}
      </div>
    </div>
  );
}
