import Image from "next/image";
import Link from "next/link";
import type { GridCard } from "@/lib/cards";
import { formatMoney } from "@/lib/money";

// "You may also like" row under the product detail. Deliberately lighter than
// the catalog grids — no (NN) index, since numbering a suggestion set would
// read as a position in the collection. Image well, name, price.
export default function RelatedProducts({
  cards,
  fit = "contain",
  heading = "You may also like",
}: {
  cards: GridCard[];
  /** contain = product cutouts (toys/art); cover = full-bleed photos (apparel). */
  fit?: "contain" | "cover";
  heading?: string;
}) {
  if (cards.length === 0) return null;

  return (
    <section className="mt-20 border-t border-black/10 pt-8">
      {/* Same type as the home section headers and cards (Gia, 2026-08):
          Helvetica bold caps throughout, captions centered. */}
      <h2 className="font-sans text-[10.4px] font-bold uppercase tracking-wide text-black md:text-[13px]">
        {heading}
      </h2>

      <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">
        {cards.map((card) => {
          // Same rule as the catalog grids: gray wash + SOLD OUT tab, and fine
          // art is exempt (inquiry-only, never reads as sold).
          const soldOut = !card.fineArt && !card.available;
          return (
            <Link key={card.key} href={card.href} prefetch className="group block">
              <div className="relative aspect-square w-full overflow-hidden bg-card">
                {card.image && (
                  <Image
                    src={card.image.url}
                    alt={card.image.altText ?? card.title}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className={`transition-transform duration-[350ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105 ${
                      fit === "cover" ? "object-cover" : "object-contain"
                    }`}
                  />
                )}
                {soldOut && (
                  <>
                    <div aria-hidden className="absolute inset-0 bg-black/20" />
                    <span className="absolute right-0 top-0 bg-black px-2.5 py-1.5 font-sans text-[10px] font-bold uppercase tracking-wide text-white">
                      Sold out
                    </span>
                  </>
                )}
              </div>
              <div className="mt-5 text-center font-sans text-[12px] font-bold uppercase tracking-wide text-black">
                {card.title}
              </div>
              <div className="mt-1.5 text-center font-sans text-[12px] text-gun-metal">
                {formatMoney(card.price)}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
