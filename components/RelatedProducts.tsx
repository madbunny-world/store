import Image from "next/image";
import Link from "next/link";
import type { GridCard } from "@/lib/cards";
import { formatMoney } from "@/lib/money";

// "You may also like" row under the product detail. Deliberately lighter than
// the catalog grids — no (NN) index, since numbering a suggestion set would
// read as a position in the collection. Image well, name, price.
// Both layers share the lift so the swap is pure opacity on the top image.
const imageClass =
  "transition-[transform,opacity] duration-[350ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105";

export default function RelatedProducts({
  cards,
  heading = "You may also like",
}: {
  cards: GridCard[];
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
              {/* object-cover on white, exactly like the catalog grids —
                  object-contain letterboxed the cutouts and left the gray well
                  showing (Gia, 2026-08). */}
              <div className="relative aspect-square w-full overflow-hidden bg-white">
                {card.image && (
                  <Image
                    src={card.image.url}
                    alt={card.image.altText ?? card.title}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className={`${imageClass} object-cover`}
                  />
                )}
                {/* Second shot fades in ON TOP; the base never fades out, so no
                    translucent frame between them. Same rule as the grids. */}
                {card.hoverImage && (
                  <Image
                    src={card.hoverImage.url}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className={`${imageClass} object-cover opacity-0 group-hover:opacity-100`}
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
