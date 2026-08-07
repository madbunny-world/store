"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import type { Product, ProductVariant } from "@/lib/shopify/types";
import { formatMoney } from "@/lib/money";
import { isFineArt } from "@/lib/catalog";
import { useCart } from "./cart/CartProvider";
import InquiryDialog from "./InquiryDialog";

// Shared by the CTA bar here and the inquiry dialog's submit button, so the two
// can't drift.
export const CTA_BAR_CLASS =
  "flex w-full items-center justify-between px-4 py-2 font-sans text-[12px] uppercase tracking-wider text-bunny-white transition-opacity";

// Option-value name → brand swatch (colors). Falls back to gun-metal.
const SWATCH: Record<string, string> = {
  "bunny black": "#151312",
  black: "#151312",
  "mad red": "#ff402b",
  red: "#ff402b",
  "gun metal": "#4d5257",
  "gun metal gray": "#4d5257",
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
  const [inquiryOpen, setInquiryOpen] = useState(false);

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

  /** Variant image representing an option value (color thumbs). */
  function valueImage(optName: string, value: string) {
    return product.variants.find(
      (v) =>
        v.selectedOptions.find((so) => so.name === optName)?.value === value &&
        v.image,
    )?.image;
  }


  const priceMoney = variant?.price ?? product.minPrice;
  const soldOut = !fineArt && (requireSelection ? Boolean(variant) && !available : !available);

  const barClass = CTA_BAR_CLASS;

  return (
    <div className="font-mono text-[13px] leading-relaxed">
      {/* Meta (variant-driven where relevant) */}
      <dl className="mt-4 space-y-1 text-gun-metal">
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

      {/* Option selectors. Color renders as variant-photo thumbs when the
          variants carry images (reference), swatch chips otherwise; other
          options (Size) as a plain text row, sold-out values struck through. */}
      {options.map((o) => {
        const isColor = o.name.toLowerCase() === "color";
        const thumbs = isColor && o.values.every((v) => valueImage(o.name, v));
        return (
          <div key={o.id} className="mt-7">
            {thumbs ? (
              <div className="flex flex-wrap gap-3">
                {o.values.map((value) => {
                  const sel = selected[o.name] === value;
                  const img = valueImage(o.name, value)!;
                  return (
                    <button
                      key={value}
                      onClick={() => setSelected((prev) => ({ ...prev, [o.name]: value }))}
                      aria-pressed={sel}
                      aria-label={value}
                      title={value}
                      className="group/thumb"
                    >
                      <span className="relative block h-16 w-14 bg-white">
                        <Image
                          src={img.url}
                          alt=""
                          fill
                          sizes="56px"
                          className="object-contain"
                        />
                      </span>
                      <span
                        className={`mx-auto mt-1 block h-[2px] w-8 ${
                          sel ? "bg-black" : "bg-transparent group-hover/thumb:bg-black/30"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            ) : (
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
                      className={`min-w-8 px-2 py-1 text-center text-[11px] uppercase tracking-wider transition-colors ${
                        sel
                          ? "bg-black text-bunny-white"
                          : avail
                            ? "text-black hover:opacity-60"
                            : "text-gun-metal/70 line-through"
                      }`}
                    >
                      {isColor && (
                        <span
                          className="mr-1.5 inline-block h-3 w-3 rounded-full border border-black/10 align-middle"
                          style={{ backgroundColor: SWATCH[value.toLowerCase()] ?? "#4d5257" }}
                        />
                      )}
                      {value}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      {/* Amount left (Mad Red) above the bar. Fine art is inquiry-only — no
          stock line, Inquire + price, never Sold. */}
      {!fineArt && !soldOut && qty != null && (
        <div className="mt-7 font-sans text-[12px] text-mad-red">{qty} in stock</div>
      )}

      {/* CTA bar — label left, price right (reference). */}
      <div className={!fineArt && !soldOut && qty != null ? "mt-2" : "mt-7"}>
        {fineArt ? (
          <button
            type="button"
            onClick={() => setInquiryOpen(true)}
            className={`${barClass} bg-black hover:opacity-80`}
          >
            <span>Inquire</span>
            <span>{formatMoney(priceMoney)}</span>
          </button>
        ) : (
          <button
            onClick={() => variant && available && addItem(variant.id)}
            disabled={isPending || !variant || !available}
            className={`${barClass} ${
              soldOut ? "bg-[#B3B3B3]" : "bg-black"
            } ${variant && available ? "hover:opacity-80" : "cursor-default"}`}
          >
            <span>
              {requireSelection && !allChosen
                ? `Select ${options.map((o) => o.name.toLowerCase()).join(" / ")}`
                : soldOut
                  ? "Sold out"
                  : isPending
                    ? "Adding"
                    : "Add to cart"}
            </span>
            <span>{formatMoney(priceMoney)}</span>
          </button>
        )}
      </div>

      {!fineArt && (
        <p className="mt-2.5 font-sans text-[12px] font-medium text-[#909090]">
          Free shipping on orders over $100. Fine art collections excluded.
        </p>
      )}

      {fineArt && inquiryOpen && (
        <InquiryDialog
          onClose={() => setInquiryOpen(false)}
          productTitle={product.title}
          price={formatMoney(priceMoney)}
        />
      )}
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
