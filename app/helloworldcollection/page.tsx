import type { Metadata } from "next";
import { getAllProducts } from "@/lib/shopify/queries";
import { TAG } from "@/lib/catalog";
import { toGridCards } from "@/lib/cards";
import CollectionPage from "@/components/CollectionPage";
import { ogImages } from "@/lib/seo";

// Async so the share card can carry a real piece from the collection instead of
// the generic brand card every page used to share (Gia, 2026-08).
export async function generateMetadata(): Promise<Metadata> {
  const toys = (await getAllProducts()).filter((p) => p.tags.includes(TAG.toy));
  return {
    title: "“Hello, World” collection",
    description:
      "Madbunny Collection 001. Collectible figures in three colorways, available in limited numbers.",
    alternates: { canonical: "/helloworldcollection" },
    openGraph: {
      description: "Limited edition collectible toy figures at 100% size.",
      images: ogImages(toys, "Madbunny “Hello, World” collectible figure"),
    },
  };
}

// The toys, as their own page. Home still carries the same grid as a section;
// this is the shareable, linkable surface for the collection.
export default async function HelloWorldCollectionPage() {
  const toys = (await getAllProducts()).filter((p) => p.tags.includes(TAG.toy));
  const cards = toGridCards(toys, { basePath: "/shop" });

  return <CollectionPage title="helloWorld" cards={cards} />;
}
