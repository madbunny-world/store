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
    <main className="flex flex-1 flex-col pb-20">
      {/* Mobile stacks video → title → items; sm+ keeps title → video → items. */}
      <div className="order-2 flex flex-col items-center gap-3 px-4 pb-6 pt-6 sm:order-1 sm:pb-10 sm:pt-7">
        <SplatinkHeading name="collectibles" className="h-7 sm:h-8" />
      </div>
      <div className="order-1 sm:order-2">
        <CollectionHero />
      </div>
      {cards.length === 0 ? (
        <p className="order-3 py-16 text-center font-mono text-[11px] text-gun-metal">
          No pieces available.
        </p>
      ) : (
        <div className="order-3 sm:mt-14">
          <ArchiveGrid cards={cards} />
        </div>
      )}
    </main>
  );
}
