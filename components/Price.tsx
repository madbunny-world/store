import { formatMoney } from "@/lib/money";
import type { Money } from "@/lib/shopify/types";

/**
 * The Madbunny coin: a solid disc with the M knocked out, so the letter shows
 * whatever is behind the icon — white on the store's white ground (Gia,
 * 2026-08).
 *
 * Disc and letter are ONE path with fill-rule evenodd, not two elements: a
 * knockout needs both subpaths in the same fill operation. The alternatives
 * (<mask> / <clipPath>) need an id, and this renders once per product card —
 * duplicate ids across a grid.
 *
 * Geometry follows lucide's conventions (24 viewBox, r-10 disc, currentColor)
 * so it stays in the same visual family as the other icons on the site. The M
 * spans y8–16, lucide's inner content box for circle glyphs, which is what
 * keeps it legible at the 10px cap height of a mobile caption.
 */
function CoinM({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className={className}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20ZM7.6 16V8h2l2.4 3.2L14.4 8h2v8h-2v-4.6L12 14.6l-2.4-3.2V16Z"
      />
    </svg>
  );
}

/**
 * A price label with the coin in front. Product CARDS only — the detail page
 * and the bag show bare prices (Gia, 2026-08).
 *
 * The icon is sized in `em`, so it tracks the caller's text size (10px
 * captions on mobile, 12px from md) with no per-site overrides.
 */
export default function Price({
  money,
  className = "",
}: {
  money: Money;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-1 ${className}`}>
      <CoinM className="h-[1em] w-[1em] shrink-0" />
      {formatMoney(money)}
    </span>
  );
}
