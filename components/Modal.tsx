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
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-stretch justify-center sm:items-start sm:overflow-y-auto sm:py-12"
    >
      {/* Backdrop (desktop) */}
      <div
        onClick={() => router.back()}
        className="absolute inset-0 hidden bg-black/50 sm:block"
        aria-hidden
      />
      <div
        ref={panelRef}
        className="relative z-10 flex w-full flex-col overflow-y-auto bg-white p-5 sm:my-auto sm:h-auto sm:max-w-4xl sm:overflow-visible sm:p-8"
      >
        <button
          onClick={() => router.back()}
          aria-label="Close"
          className="mb-4 self-end hover:opacity-60"
        >
          <X className="h-5 w-5" strokeWidth={1.5} />
        </button>
        {children}
      </div>
    </div>
  );
}
