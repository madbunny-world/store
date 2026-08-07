import Link from "next/link";
import type { Product } from "@/lib/shopify/types";
import { TAG } from "@/lib/catalog";
import BuyPanel from "./BuyPanel";
import DetailSections from "./DetailSections";
import ProductGallery from "./ProductGallery";

// Shared by the modal (@modal/(.)[handle]) and the full page ([handle]) — both
// render this from the same data. Reference layout: breadcrumb top-left, gallery
// left (chevrons + progress line), info right — bold title, subtitle, options,
// CTA bar with price, then metafield-driven disclosure sections. Static
// product-level info here; variant-driven bits live in the client BuyPanel.
export default function ProductDetail({
  product,
  initialVariantId,
  requireVariantSelection = false,
}: {
  product: Product;
  initialVariantId?: string;
  requireVariantSelection?: boolean;
}) {
  const collection = product.tags.includes(TAG.apparel)
    ? { label: "Apparel", href: "/apparel" }
    : { label: "Collectibles", href: "/collectibles" };

  return (
    <div>
      {/* Breadcrumb — collection / product */}
      <nav aria-label="Breadcrumb" className="font-sans text-[12px] font-bold text-black">
        <Link href={collection.href} className="transition-opacity hover:opacity-60">
          {collection.label}
        </Link>
        <span className="mx-1.5 font-normal text-gun-metal">/</span>
        {product.title}
      </nav>

      <div className="mt-6 grid gap-8 md:grid-cols-2 md:gap-12">
        {/* Images — media.nodes, browsable */}
        <ProductGallery images={product.images} title={product.title} />

        {/* Info */}
        <div>
          <h2 className="font-sans text-[16px] font-bold leading-tight md:text-[18px]">
            {product.title}
          </h2>
          {/* Item description (Shopify product info), directly under the title —
              small bold (reference: "100% Cotton - White"). */}
          {product.descriptionHtml && (
            <div
              className="mt-2 max-w-none font-sans text-[14px] font-bold leading-relaxed text-black [&_p]:mb-1.5 [&_p:last-child]:mb-0"
              dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
            />
          )}
          <div className="mt-3">
            <BuyPanel
              product={product}
              initialVariantId={initialVariantId}
              requireSelection={requireVariantSelection}
            />
          </div>
          <DetailSections product={product} />
        </div>
      </div>
    </div>
  );
}
