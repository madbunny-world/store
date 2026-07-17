import Image from "next/image";
import Link from "next/link";
import type { GridCard } from "@/lib/cards";
import { formatMoney } from "@/lib/money";

// Caption, centered under the card: name / "N left" or "sold out" / price.
// Fine-art pieces are inquiry-only, so they skip the stock line.
export default function ProductCard({
  card,
  fit = "contain",
}: {
  card: GridCard;
  /** contain = padded product shot (toys/art); cover = full-bleed photo (apparel). */
  fit?: "contain" | "cover";
}) {
  const qty = card.quantityAvailable;
  const soldOut = !card.available || qty === 0;

  return (
    <Link href={card.href} className="group block" prefetch>
      <div className="relative aspect-square overflow-hidden bg-white">
        {card.image ? (
          <Image
            src={card.image.url}
            alt={card.image.altText ?? card.title}
            fill
            sizes="(max-width: 640px) 100vw, 33vw"
            className={
              fit === "cover"
                ? "object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                : "object-contain p-8 transition-transform duration-300 group-hover:scale-[1.03]"
            }
          />
        ) : null}
      </div>
      <div className="mt-4 space-y-1 text-center font-mono text-[11px] leading-snug">
        <div className="font-medium">{card.title}</div>
        {!card.fineArt &&
          (soldOut ? (
            <div className="uppercase tracking-wider text-mad-red">Sold out</div>
          ) : qty != null ? (
            <div className="text-gun-metal">{qty} left</div>
          ) : null)}
        <div>{formatMoney(card.price)}</div>
      </div>
    </Link>
  );
}
