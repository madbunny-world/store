"use client";

import { useCart } from "./CartProvider";

// Header cart control — the bag glyph with a live count badge. Sits in the
// nav's right cluster where Instagram used to (Gia, 2026-08: cart is chrome,
// Instagram is a floating bubble now).
export default function CartButton({ className }: { className?: string }) {
  const { cart, open } = useCart();
  const count = cart?.totalQuantity ?? 0;

  return (
    <button
      onClick={open}
      aria-label={count > 0 ? `Open cart, ${count} items` : "Open cart"}
      className={`relative transition-opacity hover:opacity-60 ${className ?? ""}`}
    >
      {/* bag glyph */}
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        aria-hidden="true"
      >
        <path d="M6 8h12l-1 12H7L6 8Z" />
        <path d="M9 8V6a3 3 0 0 1 6 0v2" />
      </svg>
      {count > 0 && (
        <span className="absolute -right-1.5 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-mad-red px-1 font-mono text-[9px] text-white">
          {count}
        </span>
      )}
    </button>
  );
}
