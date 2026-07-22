import Image from "next/image";
import Link from "next/link";
import type { GridCard } from "@/lib/cards";

// Collection-archive lattice (reference: numbered specimen grid). Each cell:
// (NN) top-left, small centered image that enlarges ~2x on hover inside corner
// brackets, item name typing on at bottom-left (.archive-name in globals.css).
// No price or stock on the grid — the detail modal carries those. Unlike the
// grayscale reference, images stay in full color at all sizes (Gia's rule).

function Crosses() {
  // + marks on all four lattice intersections of the cell. Shared corners
  // overlap identically, completing the grid without edge cases.
  const pos = [
    "left-0 top-0",
    "right-0 top-0 translate-x-1/2",
    "left-0 bottom-0 translate-y-1/2",
    "right-0 bottom-0 translate-x-1/2 translate-y-1/2",
  ];
  return (
    <>
      {pos.map((p) => (
        <span
          key={p}
          aria-hidden
          className={`pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-1/2 text-black/50 ${p}`}
        >
          <svg viewBox="0 0 9 9" className="h-[9px] w-[9px]" stroke="currentColor" strokeWidth="1">
            <line x1="4.5" y1="0" x2="4.5" y2="9" />
            <line x1="0" y1="4.5" x2="9" y2="4.5" />
          </svg>
        </span>
      ))}
    </>
  );
}

export default function ArchiveGrid({
  cards,
  fit = "contain",
}: {
  cards: GridCard[];
  /** contain = product cutouts (toys/art); cover = full-bleed photos (apparel). */
  fit?: "contain" | "cover";
}) {
  return (
    <div className="grid grid-cols-2 border-t border-black/10 md:grid-cols-3 xl:grid-cols-5">
      {cards.map((card, i) => (
        <Link
          key={card.key}
          href={card.href}
          prefetch
          className="group archive-cell relative aspect-square border-b border-r border-black/10 md:aspect-[10/9]"
        >
          <Crosses />

          {/* Index — z-lifted so an enlarged image can never paint over it */}
          <span className="absolute left-3 top-3 z-10 font-mono text-[11px] tracking-wider text-black">
            ({String(i + 1).padStart(2, "0")})
          </span>

          {/* Specimen image — 66% of cell at rest; gentle 1.1x on hover, sized so
              the enlarged image never reaches the (NN) index. */}
          <div className="absolute left-1/2 top-1/2 aspect-square w-[66%] -translate-x-1/2 -translate-y-1/2 transition-transform duration-[350ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110">
            {card.image && (
              <Image
                src={card.image.url}
                alt={card.image.altText ?? card.title}
                fill
                sizes="(max-width: 768px) 50vw, 20vw"
                className={fit === "cover" ? "object-cover" : "object-contain"}
              />
            )}
          </div>

          {/* White fade under the name — appears only on hover, when the name
              reveals (between image layer and text layer by DOM order). */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[15%] bg-[linear-gradient(to_top,white_35%,transparent)] opacity-0 transition-opacity duration-200 group-hover:opacity-100"
          />

          {/* Name — bottom-left, types on (globals.css .archive-name) */}
          <span className="archive-name absolute bottom-3 left-3 right-3 font-mono text-[11px] leading-snug text-black">
            {card.title}
          </span>
        </Link>
      ))}
    </div>
  );
}
