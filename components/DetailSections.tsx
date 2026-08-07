"use client";

import { useState } from "react";
import type { Product } from "@/lib/shopify/types";

// Reference-style disclosure rows fed by the store's product metafields
// (custom.product_details / custom.fabric / custom.care_instructions — set on
// apparel). Rows without content don't render, so the block is graceful-empty
// for products whose metafields aren't filled in Admin yet.
export default function DetailSections({ product }: { product: Product }) {
  const sections = [
    { label: "Product details", body: product.productDetails },
    { label: "Fabric", body: product.fabric },
    { label: "Care instructions", body: product.careInstructions },
  ].filter((s): s is { label: string; body: string } => Boolean(s.body));

  const [open, setOpen] = useState<string | null>(null);

  if (sections.length === 0) return null;

  return (
    <div className="mt-10 font-sans text-[12px]">
      {sections.map((s) => {
        const isOpen = open === s.label;
        return (
          <div key={s.label}>
            <button
              onClick={() => setOpen(isOpen ? null : s.label)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between py-2 text-left font-bold text-black"
            >
              {s.label}
              <span aria-hidden className="font-mono text-[12px] text-gun-metal">
                {isOpen ? "−" : "+"}
              </span>
            </button>
            {/* Smooth open/close — the 0fr→1fr grid row transition animates to
                the content's natural height (no fixed max-height guess). */}
            <div
              className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none ${
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
              aria-hidden={!isOpen}
            >
              <div className="overflow-hidden">
                <p className="whitespace-pre-line pb-4 pt-1 leading-relaxed text-gun-metal">
                  {s.body}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
