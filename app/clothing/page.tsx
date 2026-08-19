import type { Metadata } from "next";
import { getAllProducts } from "@/lib/shopify/queries";
import { TAG } from "@/lib/catalog";
import { toGridCards } from "@/lib/cards";
import CollectionPage from "@/components/CollectionPage";
import { ogImages, openGraph } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const wear = (await getAllProducts()).filter((p) =>
    p.tags.includes(TAG.apparel),
  );
  return {
    title: "Clothing",
    description: "Madbunny clothing. Tees and caps, cut heavy.",
    alternates: { canonical: "/clothing" },
    openGraph: openGraph({
      description:
        "Madbunny Tees and caps features short sleeve t-shirts with bold icon.",
      images: ogImages(wear, "Madbunny clothing"),
    }),
  };
}

// Clothing, as its own page. Was /apparel until the 2026-08 rename; that URL
// 308s here, while /apparel/:handle still 308s to /shop/:handle — those old PDP
// URLs predate the unified shop namespace and that rule stays.
export default async function ClothingPage() {
  const wear = (await getAllProducts()).filter((p) =>
    p.tags.includes(TAG.apparel),
  );
  const cards = toGridCards(wear, { basePath: "/shop" });

  return <CollectionPage title="clothing" cards={cards} />;
}
