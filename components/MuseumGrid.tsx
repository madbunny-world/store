import Image from "next/image";
import Link from "next/link";
import type { GridCard } from "@/lib/cards";
import { formatMoney } from "@/lib/money";

// v3 gallery grid, reference-aligned: square 1:1 crops on white, centered bold
// caption + price. Sold-out buyables get a gray wash and a black SOLD OUT tab
// in the top-right; fine art never does (inquiry-only, decision log — no Sold
// state in the grid).
//
// At md and up it is always a static wrapped grid, 4 per row, with short rows
// self-centering (3 orders picks, the collection's trailing pair). Below md,
// `mobile` picks the shape:
//   "carousel" — one finger-swiped line with snap points, the next card peeking
//                in so the row reads as scrollable. Home + orders, where a
//                section is a teaser and vertical space is scarce.
//   "single"   — one card per row, full width. The category pages, where the
//                grid IS the page and browsing beats swiping (Gia, 2026-08).
const CONTAINER = {
  base: "flex px-6 md:flex-wrap md:justify-center md:gap-x-6 md:gap-y-16 md:px-12",
  carousel:
    "snap-x snap-mandatory scroll-px-6 gap-x-6 overflow-x-auto overscroll-x-contain pb-2 [scrollbar-width:none] md:snap-none md:overflow-x-visible md:pb-0 [&::-webkit-scrollbar]:hidden",
  single: "flex-wrap justify-center gap-y-14",
};

const CARD = {
  base: "group block md:w-auto md:basis-[calc((100%-4.5rem)/4)]",
  carousel: "w-[62%] shrink-0 snap-start sm:w-[42%] md:shrink",
  single: "w-full",
};

export default function MuseumGrid({
  cards,
  mobile = "carousel",
}: {
  cards: GridCard[];
  mobile?: "carousel" | "single";
}) {
  return (
    // Full width with the site gutter (px-6 md:px-12) — same offset as the
    // banner labels, so grid edges align with "In the studio" above/below.
    <div className={`${CONTAINER.base} ${CONTAINER[mobile]}`}>
      {cards.map((card) => {
        const soldOut = !card.fineArt && !card.available;
        return (
          <Link
            key={card.key}
            href={card.href}
            prefetch
            className={`${CARD.base} ${CARD[mobile]}`}
          >
            <div className="relative aspect-square w-full overflow-hidden bg-white">
              {card.image && (
                <Image
                  src={card.image.url}
                  alt={card.image.altText ?? card.title}
                  fill
                  sizes={
                    mobile === "single"
                      ? "(max-width: 768px) 100vw, 25vw"
                      : "(max-width: 640px) 62vw, (max-width: 768px) 42vw, 25vw"
                  }
                  className="object-cover transition-transform duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
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
  );
}
