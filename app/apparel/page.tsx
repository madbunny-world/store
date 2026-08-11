import type { Metadata } from "next";
import { getAllProducts } from "@/lib/shopify/queries";
import { TAG } from "@/lib/catalog";
import { toGridCards } from "@/lib/cards";
import CollectionPage from "@/components/CollectionPage";
import { ogImages } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const wear = (await getAllProducts()).filter((p) =>
    p.tags.includes(TAG.apparel),
  );
  return {
    title: "Apparel",
    description: "Madbunny apparel. Tees and caps, cut heavy.",
    alternates: { canonical: "/apparel" },
    openGraph: {
      description:
        "Madbunny Tees and caps features short sleeve t-shirts with bold icon.",
      images: ogImages(wear, "Madbunny apparel"),
    },
  };
}

// Apparel, as its own page. /apparel/:handle still 308s to /shop/:handle — the
// old PDP URLs predate the unified shop namespace and that rule stays.
export default async function ApparelPage() {
  const wear = (await getAllProducts()).filter((p) =>
    p.tags.includes(TAG.apparel),
  );
  const cards = toGridCards(wear, { basePath: "/shop" });

  return <CollectionPage title="apparel" cards={cards} />;
}
