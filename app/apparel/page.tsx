import type { Metadata } from "next";
import { getAllProducts } from "@/lib/shopify/queries";
import { apparel } from "@/lib/catalog";
import { toGridCards } from "@/lib/cards";
import ProductCard from "@/components/ProductCard";
import SplatinkHeading from "@/components/SplatinkHeading";

export const metadata: Metadata = { title: "Apparel" };

export default async function ApparelPage() {
  const products = apparel(await getAllProducts());
  const cards = toGridCards(products, { basePath: "/apparel" }); // one card per tee

  return (
    <main className="flex-1 pb-20">
      {/* Hero — campaign shoot pending (the mock's reference photo isn't usable).
          Gray placeholder block until Gia's shoot lands. */}
      <div className="flex aspect-[16/7] w-full items-center justify-center bg-card font-mono text-[11px] uppercase tracking-wider text-gun-metal">
        Campaign photo pending
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="my-12 flex justify-center">
          <SplatinkHeading name="apparel" className="h-8 sm:h-9" />
        </div>
        {cards.length === 0 ? (
          <p className="py-16 text-center font-mono text-[11px] text-gun-metal">
            No pieces available.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 md:grid-cols-3">
            {cards.map((card) => (
              <ProductCard key={card.key} card={card} fit="cover" />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
