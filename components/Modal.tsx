"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

// Wraps intercepted product detail. The content (ProductDetail) stays a Server
// Component; only this shell is client. Back button / Escape / backdrop close the
// modal via router.back() — the grid underneath stays mounted (D-02). On mobile
// it fills the screen: a full page with the same URL, no overlay chrome (D-14).
export default function Modal({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") router.back();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [router]);

  return (
    // z-30 sits under the sticky header (z-40): the nav stays visible and
    // clickable above the detail view. Exits: the X (top right), backdrop
    // click, Escape, or any nav link.
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-30 flex items-stretch justify-center sm:items-start sm:overflow-y-auto sm:py-12"
    >
      {/* Backdrop (desktop) */}
      <div
        onClick={() => router.back()}
        className="absolute inset-0 hidden bg-black/50 sm:block"
        aria-hidden
      />
      <div
        ref={panelRef}
        className="relative z-10 flex w-full flex-col overflow-y-auto bg-white px-5 pb-5 pt-16 sm:my-auto sm:h-auto sm:max-w-4xl sm:overflow-visible sm:p-8"
      >
        {/* Sits on the breadcrumb's line (top-right); -m-2/p-2 keeps a generous
            tap area without shifting the glyph off that alignment. */}
        <button
          onClick={() => router.back()}
          aria-label="Close"
          className="absolute right-5 top-16 z-10 -m-2 p-2 hover:opacity-60 sm:right-8 sm:top-8"
        >
          <X className="h-5 w-5" strokeWidth={1.5} />
        </button>
        {children}
      </div>
    </div>
  );
}
