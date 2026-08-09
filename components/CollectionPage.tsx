import type { GridCard } from "@/lib/cards";
import type { SplatinkKey } from "./splatink/paths";
import MuseumGrid from "./MuseumGrid";
import SplatinkHeading from "./SplatinkHeading";

// Shared body for the category pages (/helloworldcollection, /apparel):
// centered Splatink title — one per page, matching /private-collection — then
// the museum grid, 4 up on desktop and one per row on mobile (the grid is the
// page here, so browsing beats swiping). No count line.
export default function CollectionPage({
  title,
  cards,
}: {
  title: SplatinkKey;
  cards: GridCard[];
}) {
  return (
    <main className="flex-1 pb-24">
      <div className="flex flex-col items-center px-6 pt-10 text-center md:pt-14">
        <SplatinkHeading name={title} className="h-10 sm:h-11" />
      </div>

      <div className="mt-12 md:mt-16">
        {cards.length === 0 ? (
          <p className="py-16 text-center font-mono text-[11px] text-gun-metal">
            No pieces available.
          </p>
        ) : (
          <MuseumGrid cards={cards} mobile="single" />
        )}
      </div>
    </main>
  );
}
