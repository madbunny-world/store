import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";
import { getAllProducts } from "@/lib/shopify/queries";
import { buyables, isFineArt } from "@/lib/catalog";
import { slugify } from "@/lib/slug";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const staticRoutes = [
    "",
    "/toyfigures",
    "/clothing",
    "/private-collection",
    "/studio",
    "/collectorslounge",
    "/orders",
    "/returns",
    "/shipping",
    "/privacy",
    "/terms",
  ].map((path) => ({ url: `${base}${path}`, changeFrequency: "weekly" as const }));

  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    const products = await getAllProducts();
    const toEntry = (basePath: string) => (p: { handle: string }) => ({
      url: `${base}${basePath}/${slugify(p.handle)}`,
      changeFrequency: "weekly" as const,
    });
    productRoutes = [
      ...buyables(products).map(toEntry("/shop")),
      ...products.filter(isFineArt).map(toEntry("/private-collection")),
    ];
  } catch {
    // Shopify unreachable at build — ship the static routes anyway.
  }

  return [...staticRoutes, ...productRoutes];
}
