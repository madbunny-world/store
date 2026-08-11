"use client";

import Image from "next/image";
import { X, Trash2 } from "lucide-react";
import { useCart } from "./CartProvider";
import { formatMoney } from "@/lib/money";

// Shopping bag, styled after the reference Gia supplied (2026-08): bold
// uppercase Helvetica throughout, no rules or boxes, a portrait product shot
// beside stacked title / variant / price / stepper, and a full-bleed black
// CHECKOUT bar welded to the bottom edge. Deviations Gia asked for: the X icon
// stays instead of a "CLOSE" word, and the subtotal sits at the bottom above
// the button rather than directly under the items.
const LABEL = "font-sans text-[11px] font-bold tracking-wide";

export default function CartDrawer() {
  const { cart, isOpen, isPending, close, updateItem, removeItem } = useCart();
  const empty = !cart || cart.lines.length === 0;

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden={!isOpen}
        onClick={close}
        className={`fixed inset-0 z-[70] bg-black/40 transition-opacity duration-200 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      {/* Panel */}
      <aside
        aria-label="Shopping bag"
        className={`fixed inset-y-0 right-0 z-[70] flex w-full max-w-sm flex-col bg-white transition-transform duration-200 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className={`flex items-center justify-between px-5 py-4 ${LABEL}`}>
          <span>Shopping bag</span>
          <button
            onClick={close}
            aria-label="Close shopping bag"
            className="-m-2 p-2 hover:opacity-60"
          >
            <X className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5">
          {empty ? (
            <p className={`py-8 text-gun-metal ${LABEL}`}>Your bag is empty.</p>
          ) : (
            <ul className="space-y-8 py-2">
              {cart.lines.map((line) => {
                // Shopify names a single-variant product's only variant
                // "Default Title" — meaningless to a shopper, so it is dropped.
                const variant =
                  line.merchandise.title === "Default Title"
                    ? null
                    : line.merchandise.title;
                return (
                  <li key={line.id} className="flex gap-4">
                    <div className="relative aspect-[4/5] w-[42%] shrink-0 overflow-hidden bg-white">
                      {line.merchandise.image && (
                        <Image
                          src={line.merchandise.image.url}
                          alt={
                            line.merchandise.image.altText ??
                            line.merchandise.product.title
                          }
                          fill
                          sizes="160px"
                          className="object-cover"
                        />
                      )}
                    </div>

                    <div className={`flex flex-1 flex-col gap-2 ${LABEL}`}>
                      <div className="leading-snug">
                        {line.merchandise.product.title}
                      </div>
                      {variant && <div>{variant}</div>}
                      <div>{formatMoney(line.cost.totalAmount)}</div>

                      {/* Stepper as bare glyphs, per the reference — no box. */}
                      <div className="mt-1 flex items-center gap-3">
                        <button
                          onClick={() => updateItem(line.id, line.quantity - 1)}
                          disabled={isPending || line.quantity <= 1}
                          aria-label="Decrease quantity"
                          className="-m-1 p-1 hover:opacity-60 disabled:opacity-30"
                        >
                          &minus;
                        </button>
                        <span className="tabular-nums">{line.quantity}</span>
                        <button
                          onClick={() => updateItem(line.id, line.quantity + 1)}
                          disabled={isPending}
                          aria-label="Increase quantity"
                          className="-m-1 p-1 hover:opacity-60 disabled:opacity-30"
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeItem(line.id)}
                          disabled={isPending}
                          aria-label="Remove item"
                          className="-m-1 ml-2 p-1 text-gun-metal transition-colors hover:text-mad-red disabled:opacity-30"
                        >
                          <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {!empty && (
          <>
            <div className={`px-5 pb-4 pt-6 ${LABEL}`}>
              {/* Half the weight of the rest of the bag (700 → 350): it is a
                  standing notice, not a line item (Gia, 2026-08). */}
              <p className="font-[350] leading-relaxed">
                Taxes and shipping calculated at checkout.
                <br />
                Free shipping in US for orders over $100. Private collections
                excluded.
              </p>
              <div className="mt-5 flex justify-between">
                <span>Subtotal</span>
                <span>{formatMoney(cart.cost.subtotalAmount)}</span>
              </div>
            </div>
            {/* Full-bleed, welded to the bottom edge like the reference. */}
            <a
              href={cart.checkoutUrl}
              className={`block bg-black py-4 text-center text-bunny-white transition-opacity hover:opacity-80 ${LABEL}`}
            >
              Checkout
            </a>
          </>
        )}
      </aside>
    </>
  );
}
