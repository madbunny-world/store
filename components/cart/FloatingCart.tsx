"use client";

import { usePathname } from "next/navigation";
import { useCart } from "./CartProvider";

// Mock design: a circular gray bubble pinned to the right edge, vertically
// centered, opens the cart drawer. The home page doesn't show it.
export default function FloatingCart() {
  const pathname = usePathname();
  const { cart, open } = useCart();
  if (pathname === "/") return null;
  const count = cart?.totalQuantity ?? 0;

  return (
    <button
      onClick={open}
      aria-label={count > 0 ? `Open cart, ${count} items` : "Open cart"}
      className="fixed right-4 top-1/2 z-[60] flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-card text-gun-metal transition-opacity hover:opacity-70"
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
        <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-mad-red px-1 font-mono text-[9px] text-white">
          {count}
        </span>
      )}
    </button>
  );
}
