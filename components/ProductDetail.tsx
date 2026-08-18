import Link from "next/link";
import type { Product } from "@/lib/shopify/types";
import { productCategory } from "@/lib/catalog";
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
  // Shared with the breadcrumb JSON-LD so the two can never disagree.
  const collection = productCategory(product);

  return (
    <div>
      {/* Breadcrumb — collection / product. Hidden on mobile: the title now
          leads the page there, so the crumb was just noise above the fold
          (Gia, 2026-08). Still present on desktop and in the JSON-LD. */}
      <nav
        aria-label="Breadcrumb"
        className="hidden font-sans text-[12px] font-bold text-black md:block"
      >
        <Link href={collection.path} className="transition-opacity hover:opacity-60">
          {collection.name}
        </Link>
        <span className="mx-1.5 font-normal text-gun-metal">/</span>
        {product.title}
      </nav>

      {/* Source order is the mobile order: name/description, then images, then
          the buy panel — so a shopper reads what it is before scrolling past a
          full-width photo (Gia, 2026-08). md+ places the three blocks
          explicitly into the original two columns, gallery left. */}
      <div className="grid gap-4 md:mt-6 md:grid-cols-2 md:gap-x-12 md:gap-y-5">
        <div className="md:col-start-2 md:row-start-1">
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
        </div>

        {/* Images — media.nodes, browsable */}
        <div className="md:col-start-1 md:row-start-1 md:row-span-2">
          <ProductGallery images={product.images} title={product.title} />
        </div>

        <div className="md:col-start-2 md:row-start-2">
          <BuyPanel
            product={product}
            initialVariantId={initialVariantId}
            requireSelection={requireVariantSelection}
          />
          <DetailSections product={product} />
        </div>
      </div>
    </div>
  );
}
