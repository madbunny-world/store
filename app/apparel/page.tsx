import type { Metadata } from "next";
import { getAllProducts } from "@/lib/shopify/queries";
import { apparel } from "@/lib/catalog";
import { toGridCards } from "@/lib/cards";
import ArchiveGrid from "@/components/ArchiveGrid";
import SplatinkHeading from "@/components/SplatinkHeading";

export const metadata: Metadata = {
  title: "Apparel",
  description: "Madbunny apparel. Wear it every day.",
};

export default async function ApparelPage() {
  const products = apparel(await getAllProducts());
  const cards = toGridCards(products, { basePath: "/apparel" }); // one card per tee

  return (
    <main className="flex-1 pb-20">
      <div className="flex flex-col items-center gap-3 px-4 pb-10 pt-7">
        <SplatinkHeading name="apparel" className="h-10 sm:h-11" />
      </div>

      {cards.length === 0 ? (
        <p className="py-16 text-center font-mono text-[11px] text-gun-metal">
          No pieces available.
        </p>
      ) : (
        <ArchiveGrid cards={cards} fit="cover" />
      )}
    </main>
  );
}
