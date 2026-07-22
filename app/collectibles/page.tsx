import type { Metadata } from "next";
import { getAllProducts } from "@/lib/shopify/queries";
import { collectibles } from "@/lib/catalog";
import { toGridCards } from "@/lib/cards";
import ArchiveGrid from "@/components/ArchiveGrid";
import CollectionHero from "@/components/CollectionHero";
import SplatinkHeading from "@/components/SplatinkHeading";

export const metadata: Metadata = {
  title: "Collectibles",
  description: "The Hello, World collection — Madbunny collectible figures and fine art. Available in limited numbers.",
};

export default async function CollectiblesPage() {
  const products = collectibles(await getAllProducts());
  const cards = toGridCards(products);

  return (
    <main className="flex-1 pb-20">
      <div className="flex flex-col items-center gap-3 px-4 pb-10 pt-7">
        <SplatinkHeading name="collectibles" className="h-7 sm:h-8" />
      </div>
      <CollectionHero />
      {cards.length === 0 ? (
        <p className="py-16 text-center font-mono text-[11px] text-gun-metal">
          No pieces available.
        </p>
      ) : (
        <div className="mt-14">
          <ArchiveGrid cards={cards} />
        </div>
      )}
    </main>
  );
}
