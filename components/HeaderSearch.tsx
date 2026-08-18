"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";

// SEARCH in the header. Opening swaps the nav row itself for a search field
// (Gia, 2026-08 — it lives on the header, not as a full-page takeover), with
// matches dropping below the bar. The catalog is tiny, so Nav passes every
// product as {title, href} and filtering is client-side with no request.
// Escape, the close button, or a click outside closes; state resets on close so
// each open starts blank.
export default function HeaderSearch({
  items,
  variant = "text",
}: {
  items: { title: string; href: string }[];
  /** "text" for the desktop utility row; "icon" for the mobile header. */
  variant?: "text" | "icon";
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setQ("");
      }
    };
    // Click outside the bar + results closes. Pointerdown (not click) so it
    // fires before a result link's navigation is cancelled by unmounting.
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpen(false);
        setQ("");
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointerDown);
    inputRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  const close = () => {
    setOpen(false);
    setQ("");
  };

  const query = q.trim().toLowerCase();
  const results = query
    ? items.filter((i) => i.title.toLowerCase().includes(query))
    : [];

  return (
    <>
      {variant === "icon" ? (
        <button
          onClick={() => setOpen(true)}
          aria-label="Search"
          className="-m-3 p-3 transition-opacity hover:opacity-60"
        >
          <Search className="h-5 w-5" strokeWidth={1.5} />
        </button>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="uppercase transition-opacity hover:opacity-60"
        >
          Search
        </button>
      )}

      {open && (
        // Absolute against the nav (position: sticky on the header makes it the
        // containing block), so the bar covers the nav row exactly — same
        // height, no layout shift, page untouched behind it.
        <div ref={rootRef}>
          <div
            role="search"
            aria-label="Search products"
            className="absolute inset-0 z-50 flex items-center gap-4 bg-white px-3 md:px-12"
          >
            <input
              ref={inputRef}
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search"
              aria-label="Search products"
              className="w-full bg-transparent font-sans text-[11.7px] font-medium uppercase tracking-wide text-black outline-none placeholder:text-gun-metal/60 [&::-webkit-search-cancel-button]:hidden"
            />
            <button
              onClick={close}
              aria-label="Close search"
              className="-m-2 shrink-0 p-2 transition-opacity hover:opacity-60"
            >
              <X className="h-5 w-5" strokeWidth={1.5} />
            </button>
          </div>

          {query && (
            <div className="absolute inset-x-0 top-full z-50 bg-white shadow-[0_12px_32px_rgba(0,0,0,0.1)]">
              <ul className="flex flex-col gap-4 px-3 pb-6 pt-2 md:px-12">
                {results.map((r) => (
                  <li key={r.href}>
                    <Link
                      href={r.href}
                      onClick={close}
                      className="font-sans text-[11.7px] font-medium uppercase tracking-wide text-black transition-opacity hover:opacity-60"
                    >
                      {r.title}
                    </Link>
                  </li>
                ))}
                {results.length === 0 && (
                  <li className="font-mono text-[11px] uppercase tracking-wider text-gun-metal">
                    No matches.
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      )}
    </>
  );
}
