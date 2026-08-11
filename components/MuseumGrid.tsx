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
//   "grid"     — two cards per row (Gia, 2026-08 — was one full-width card per
//                row). The category pages, where the grid IS the page and
//                browsing beats swiping.
const CONTAINER = {
  base: "flex md:flex-wrap md:justify-center md:gap-x-6 md:gap-y-16 md:px-12",
  carousel:
    "px-3 snap-x snap-mandatory scroll-px-3 gap-x-3 overflow-x-auto overscroll-x-contain pb-2 [scrollbar-width:none] md:snap-none md:overflow-x-visible md:pb-0 [&::-webkit-scrollbar]:hidden",
  // Half the carousel's mobile gutter and gaps (Gia, 2026-08): px-3/gap-3
  // horizontally, gap-y-7 vertically. md restores the site rhythm via base.
  grid: "px-3 flex-wrap justify-center gap-x-3 gap-y-7",
};

const CARD = {
  base: "group block md:w-auto md:basis-[calc((100%-4.5rem)/4)]",
  carousel: "w-[62%] shrink-0 snap-start sm:w-[42%] md:shrink",
  grid: "basis-[calc((100%-0.75rem)/2)]",
};

const SIZES = {
  carousel: "(max-width: 640px) 62vw, (max-width: 768px) 42vw, 25vw",
  grid: "(max-width: 768px) 50vw, 25vw",
};

// Both modes crop portrait 4:5 on mobile (Gia, 2026-08); md+ stays square.
const WELL = {
  carousel: "aspect-[4/5] md:aspect-square",
  grid: "aspect-[4/5] md:aspect-square",
};

// Both layers share the lift so the swap is pure opacity on the top image —
// nothing shifts underneath it mid-transition.
const IMAGE_CLASS =
  "object-cover transition-[transform,opacity] duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]";

export default function MuseumGrid({
  cards,
  mobile = "carousel",
}: {
  cards: GridCard[];
  mobile?: "carousel" | "grid";
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
            <div className={`relative w-full overflow-hidden bg-white ${WELL[mobile]}`}>
              {card.image && (
                <Image
                  src={card.image.url}
                  alt={card.image.altText ?? card.title}
                  fill
                  sizes={SIZES[mobile]}
                  className={IMAGE_CLASS}
                />
              )}
              {/* Second shot fades in ON TOP; the base never fades out, so the
                  white well is never visible between them (that read as a
                  flicker). Decorative — the first image already names the piece
                  — so empty alt. Never shown on touch, where there is no
                  hover. */}
              {card.hoverImage && (
                <Image
                  src={card.hoverImage.url}
                  alt=""
                  fill
                  sizes={SIZES[mobile]}
                  className={`${IMAGE_CLASS} opacity-0 group-hover:opacity-100`}
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
            {/* 10px on mobile, 12px from md (Gia, 2026-08). */}
            <div className="mt-5 text-center font-sans text-[10px] font-bold uppercase tracking-wide text-black md:text-[12px]">
              {card.title}
            </div>
            <div className="mt-1.5 text-center font-sans text-[10px] text-gun-metal md:text-[12px]">
              {formatMoney(card.price)}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
