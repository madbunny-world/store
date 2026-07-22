import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";
import { getAllProducts } from "@/lib/shopify/queries";
import { apparel, collectibles } from "@/lib/catalog";
import { slugify } from "@/lib/slug";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const staticRoutes = ["", "/collectibles", "/apparel", "/about", "/jointheclub", "/privacy"].map(
    (path) => ({ url: `${base}${path}`, changeFrequency: "weekly" as const }),
  );

  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    const products = await getAllProducts();
    const toEntry = (basePath: string) => (p: { handle: string }) => ({
      url: `${base}${basePath}/${slugify(p.handle)}`,
      changeFrequency: "weekly" as const,
    });
    productRoutes = [
      ...collectibles(products).map(toEntry("/collectibles")),
      ...apparel(products).map(toEntry("/apparel")),
    ];
  } catch {
    // Shopify unreachable at build — ship the static routes anyway.
  }

  return [...staticRoutes, ...productRoutes];
}
