"use client";

import { useMemo, useState } from "react";
import type { Product, ProductVariant } from "@/lib/shopify/types";
import { formatMoney } from "@/lib/money";
import { isFineArt } from "@/lib/catalog";
import { useCart } from "./cart/CartProvider";

// TODO(Gia): real inquiry address for Fine Art Edition pieces.
const INQUIRY_EMAIL = "hello@madbunny.com";

// Option-value name → brand swatch (colors). Falls back to gun-metal.
const SWATCH: Record<string, string> = {
  "bunny black": "#151312",
  black: "#151312",
  "mad red": "#ff402b",
  red: "#ff402b",
  "gun metal": "#4d5257",
  "bunny white": "#fff8f8",
  white: "#fff8f8",
};

// Shopify gives an option-less product a default "Title" option — ignore it.
function meaningfulOptions(product: Product) {
  return product.options.filter(
    (o) => !(o.values.length === 1 && o.values[0] === "Default Title"),
  );
}

export default function BuyPanel({
  product,
  initialVariantId,
  requireSelection = false,
}: {
  product: Product;
  initialVariantId?: string;
  /** Apparel: don't pre-select; gate Add to cart until options are chosen. */
  requireSelection?: boolean;
}) {
  const { addItem, isPending } = useCart();
  const options = useMemo(() => meaningfulOptions(product), [product]);

  const [selected, setSelected] = useState<Record<string, string>>(() => {
    const initial = initialVariantId
      ? product.variants.find((v) => v.id === initialVariantId)
      : undefined;
    // Seed from a variant unless selection is required and none was given.
    const seed = initial ?? (requireSelection ? undefined : product.variants[0]);
    const rec: Record<string, string> = {};
    if (seed) for (const so of seed.selectedOptions) rec[so.name] = so.value;
    return rec;
  });

  const allChosen = options.every((o) => selected[o.name]);
  const variant: ProductVariant | undefined =
    options.length === 0
      ? product.variants[0]
      : allChosen
        ? product.variants.find((v) =>
            options.every(
              (o) =>
                v.selectedOptions.find((so) => so.name === o.name)?.value ===
                selected[o.name],
            ),
          )
        : undefined;

  const fineArt = isFineArt(product);
  const available = variant ? variant.availableForSale : false;
  const qty = variant?.quantityAvailable ?? null;

  // A value is available if some in-stock variant matches it + current selections.
  function valueAvailable(optName: string, value: string): boolean {
    return product.variants.some((v) => {
      if (!v.availableForSale) return false;
      if (v.selectedOptions.find((so) => so.name === optName)?.value !== value) return false;
      return options.every((o) => {
        if (o.name === optName) return true;
        const sel = selected[o.name];
        return !sel || v.selectedOptions.find((so) => so.name === o.name)?.value === sel;
      });
    });
  }

  const priceMoney = variant?.price ?? product.minPrice;
  const showSold = !fineArt && (requireSelection ? variant && !available : !available);

  return (
    <div className="font-mono text-[13px] leading-relaxed">
      {/* Meta (variant-driven where relevant) */}
      <dl className="space-y-1 text-gun-metal">
        {product.year != null && <MetaRow label="Year" value={String(product.year)} />}
        {variant?.medium && <MetaRow label="Medium" value={variant.medium} />}
        {(product.dimensionsMetric || product.dimensionsIn) && (
          <MetaRow
            label="Dimensions"
            value={[product.dimensionsMetric, product.dimensionsIn].filter(Boolean).join(" / ")}
          />
        )}
        {variant?.editionSize != null && (
          <MetaRow label="Edition" value={`Edition of ${variant.editionSize}`} />
        )}
      </dl>

      {/* Option selectors (colorways, sizes …). Sold-out values struck through. */}
      {options.map((o) => {
        const isColor = o.name.toLowerCase() === "color";
        return (
          <div key={o.id} className="mt-6">
            <div className="mb-2 text-[11px] uppercase tracking-wider text-gun-metal">{o.name}</div>
            <div className="flex flex-wrap gap-2">
              {o.values.map((value) => {
                const sel = selected[o.name] === value;
                const avail = valueAvailable(o.name, value);
                return (
                  <button
                    key={value}
                    onClick={() => setSelected((prev) => ({ ...prev, [o.name]: value }))}
                    aria-pressed={sel}
                    title={value}
                    className={`flex items-center gap-2 border px-2 py-1 text-[11px] transition-colors ${
                      sel ? "border-black" : "border-black/20 hover:border-black/50"
                    } ${!avail ? "text-gun-metal line-through" : ""}`}
                  >
                    {isColor && (
                      <span
                        className="inline-block h-3 w-3 rounded-full border border-black/10"
                        style={{ backgroundColor: SWATCH[value.toLowerCase()] ?? "#4d5257" }}
                      />
                    )}
                    {value}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Amount left (Mad Red) above the price. Fine art is inquiry-only — no
          stock line, price + Inquire, never Sold. */}
      {!fineArt && !showSold && qty != null && (
        <div className="mt-6 text-mad-red">{qty} left</div>
      )}
      <div
        className={`text-[15px] text-black ${
          !fineArt && !showSold && qty != null ? "mt-1" : "mt-6"
        }`}
      >
        {showSold ? "Sold" : formatMoney(priceMoney)}
      </div>

      {/* Action */}
      <div className="mt-6">
        {fineArt ? (
          <a
            href={`mailto:${INQUIRY_EMAIL}?subject=${encodeURIComponent(`Inquiry: ${product.title}`)}`}
            className="inline-block bg-black px-6 py-3 text-[11px] uppercase tracking-wider text-bunny-white transition-opacity hover:opacity-80"
          >
            Inquire
          </a>
        ) : requireSelection ? (
          <button
            onClick={() => variant && addItem(variant.id)}
            disabled={isPending || !variant || !available}
            className="bg-black px-6 py-3 text-[11px] uppercase tracking-wider text-bunny-white transition-opacity hover:opacity-80 disabled:opacity-50"
          >
            {!allChosen
              ? `Select ${options.map((o) => o.name.toLowerCase()).join(" / ")}`
              : !available
                ? "Sold out"
                : isPending
                  ? "Adding"
                  : "Add to cart"}
          </button>
        ) : !available ? null : (
          <button
            onClick={() => variant && addItem(variant.id)}
            disabled={isPending || !variant}
            className="bg-black px-6 py-3 text-[11px] uppercase tracking-wider text-bunny-white transition-opacity hover:opacity-80 disabled:opacity-50"
          >
            {isPending ? "Adding" : "Add to cart"}
          </button>
        )}
      </div>
    </div>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3">
      <dt className="w-24 shrink-0 pt-0.5 text-[11px] uppercase tracking-wider">{label}</dt>
      <dd className="text-black">{value}</dd>
    </div>
  );
}
