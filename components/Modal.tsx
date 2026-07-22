"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

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
    // clickable above the detail view. No close button — backdrop click /
    // Escape / any nav link leaves the modal.
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
        className="relative z-10 flex w-full flex-col overflow-y-auto bg-white px-5 pb-5 pt-20 sm:my-auto sm:h-auto sm:max-w-4xl sm:overflow-visible sm:p-8"
      >
        {children}
      </div>
    </div>
  );
}
