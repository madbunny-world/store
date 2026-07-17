import type { Metadata } from "next";
import { getAllProducts } from "@/lib/shopify/queries";
import { collectibles } from "@/lib/catalog";
import { toGridCards } from "@/lib/cards";
import ProductCard from "@/components/ProductCard";
import CollectionHero from "@/components/CollectionHero";
import SplatinkHeading from "@/components/SplatinkHeading";

export const metadata: Metadata = { title: "Collectibles" };

export default async function CollectiblesPage() {
  const products = collectibles(await getAllProducts());
  const cards = toGridCards(products);

  return (
    <main className="flex-1 pb-20">
      <CollectionHero
        left="[ Hello, world ] collection"
        right="available in limited numbers."
      />
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="my-12 flex justify-center">
          <SplatinkHeading name="collectibles" className="h-8 sm:h-9" />
        </div>
        {cards.length === 0 ? (
          <p className="py-16 text-center font-mono text-[11px] text-gun-metal">
            No pieces available.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 md:grid-cols-3">
            {cards.map((card) => (
              <ProductCard key={card.key} card={card} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
