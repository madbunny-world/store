// TEMPORARY Phase 0 exit check. Dev-only. Remove once /collectibles renders
// this same data. Visit /api/_debug/shopify with .env.local set to confirm the
// Storefront token works AND metafields come back non-null (proves the 7
// definitions have "Storefront API access: read").
import { NextResponse } from "next/server";
import { getAllProducts } from "@/lib/shopify/queries";
import { collectibles } from "@/lib/catalog";

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  try {
    const products = collectibles(await getAllProducts());
    const summary = products.map((p) => ({
      title: p.title,
      tags: p.tags,
      year: p.year,
      tier: p.tier,
      dimensions: p.dimensionsMetric,
      availableForSale: p.availableForSale,
      variants: p.variants.map((v) => ({
        title: v.title,
        medium: v.medium,
        editionSize: v.editionSize,
        quantityAvailable: v.quantityAvailable,
      })),
    }));
    return NextResponse.json({ count: products.length, products: summary });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}
