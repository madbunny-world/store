import type { Metadata } from "next";
import { getAllProducts } from "@/lib/shopify/queries";
import { TAG } from "@/lib/catalog";
import { toGridCards } from "@/lib/cards";
import CollectionPage from "@/components/CollectionPage";

export const metadata: Metadata = {
  title: "“Hello, World” collection",
  description:
    "Madbunny Collection 001. Collectible figures in three colorways, available in limited numbers.",
  alternates: { canonical: "/helloworldcollection" },
};

// The toys, as their own page. Home still carries the same grid as a section;
// this is the shareable, linkable surface for the collection.
export default async function HelloWorldCollectionPage() {
  const toys = (await getAllProducts()).filter((p) => p.tags.includes(TAG.toy));
  const cards = toGridCards(toys, { basePath: "/shop" });

  return <CollectionPage title="helloWorld" cards={cards} />;
}
