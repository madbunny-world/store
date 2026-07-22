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
        <SplatinkHeading name="apparel" className="h-7 sm:h-8" />
      </div>

      {/* Hero — Madbunny apparel campaign photo. Cropped to 16:7 on mobile;
          full native ratio from sm up. */}
      <div className="aspect-[16/7] w-full overflow-hidden bg-card sm:aspect-auto">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/media/apparel-campaign-1.webp"
          alt=""
          width={1710}
          height={594}
          className="h-full w-full object-cover sm:h-auto"
        />
      </div>

      {cards.length === 0 ? (
        <p className="py-16 text-center font-mono text-[11px] text-gun-metal">
          No pieces available.
        </p>
      ) : (
        <div className="mt-14">
          <ArchiveGrid cards={cards} fit="cover" />
        </div>
      )}
    </main>
  );
}
