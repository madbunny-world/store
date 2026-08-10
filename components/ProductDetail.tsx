import Link from "next/link";
import type { Product } from "@/lib/shopify/types";
import { TAG } from "@/lib/catalog";
import BuyPanel from "./BuyPanel";
import DetailSections from "./DetailSections";
import ProductGallery from "./ProductGallery";

// The full product page ([handle]) for both buyables and fine art — the same
// data, one branch on tags. Reference layout: breadcrumb top-left, gallery
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
  // Breadcrumb names the piece's own category page, not the shop root — the
  // three categories each have a real page now (Gia, 2026-08). Untagged
  // products fall back to the shop index rather than guessing a category.
  const collection = product.tags.includes(TAG.fineArt)
    ? { label: "Private Collection", href: "/private-collection" }
    : product.tags.includes(TAG.apparel)
      ? { label: "Apparel", href: "/apparel" }
      : product.tags.includes(TAG.toy)
        ? { label: "“Hello, world” collection", href: "/helloworldcollection" }
        : { label: "Shop", href: "/" };

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
          {/* h1, not h2: this is the page's subject. The modal that once shared
              this component is gone, so it is always the top-level heading. */}
          <h1 className="font-sans text-[16px] font-bold leading-tight md:text-[18px]">
            {product.title}
          </h1>
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
