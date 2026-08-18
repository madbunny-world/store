"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Trash2 } from "lucide-react";
import { useCart } from "./CartProvider";
import { formatMoney } from "@/lib/money";
import type { UpsellItem } from "./CartUpsells";

// Shopping bag, styled after the reference Gia supplied (2026-08): bold
// Helvetica throughout, no rules or boxes, a portrait product shot beside
// stacked title / variant / price / stepper, and a full-bleed black CHECKOUT
// bar welded to the bottom edge carrying the total.
const LABEL = "font-sans text-[11px] font-bold tracking-wide";
// 13.2px = 20% up from 11px. The bag's primary reading matter: the header, each
// line item, and the checkout bar (Gia, 2026-08). Secondary chrome — the upsell
// rail, the tax notice, the empty state — stays at LABEL.
const LABEL_LG = "font-sans text-[13.2px] font-bold tracking-wide";

/** Order value that earns free US shipping. Mirrors the announcement bar. */
const FREE_SHIPPING_THRESHOLD = 100;
const UPSELL_ROTATE_MS = 3000;

export default function CartDrawer({ upsells = [] }: { upsells?: UpsellItem[] }) {
  const { cart, isOpen, isPending, close, addItem, updateItem, removeItem } =
    useCart();
  const empty = !cart || cart.lines.length === 0;

  const subtotal = cart ? parseFloat(cart.cost.subtotalAmount.amount) : 0;
  const currency = cart?.cost.subtotalAmount.currencyCode ?? "USD";
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progressPct = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  // Never suggest something already in the bag. A cart line reports the raw
  // product handle, so that is the key on both sides.
  const inBag = useMemo(
    () => new Set(cart?.lines.map((l) => l.merchandise.product.handle) ?? []),
    [cart],
  );
  const suggestions = useMemo(
    () => upsells.filter((u) => !inBag.has(u.handle)).slice(0, 3),
    [upsells, inBag],
  );

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
        <div className={`flex items-center justify-between px-5 py-4 ${LABEL_LG}`}>
          <span>Shopping bag</span>
          <button
            onClick={close}
            aria-label="Close shopping bag"
            className="-m-2 p-2 hover:opacity-60"
          >
            <X className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>

        {/* Outside the scroller: the shipping meter stays put while the items
            scroll under it (Gia, 2026-08). */}
        <div className="shrink-0 px-5">
          <FreeShippingBar
            subtotal={subtotal}
            remaining={remaining}
            progressPct={progressPct}
            currency={currency}
          />
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
                    <div className="relative aspect-[4/5] w-[33.6%] shrink-0 overflow-hidden bg-white">
                      {line.merchandise.image && (
                        <Image
                          src={line.merchandise.image.url}
                          alt={
                            line.merchandise.image.altText ??
                            line.merchandise.product.title
                          }
                          fill
                          sizes="128px"
                          className="object-cover"
                        />
                      )}
                    </div>

                    <div className={`flex flex-1 flex-col gap-2 ${LABEL_LG}`}>
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
            <Upsells
              items={suggestions}
              onAdd={addItem}
              onNavigate={close}
              busy={isPending}
            />
            <div className={`px-5 pb-4 pt-5 ${LABEL}`}>
              <p className="font-[350] leading-relaxed">
                Taxes and shipping calculated at checkout.
              </p>
            </div>
            {/* Full-bleed, welded to the bottom edge like the reference. The
                total rides in the button, so there is no separate subtotal row.
                py-[15.56px] makes the bar 50.9px tall (Gia, 2026-08). */}
            <a
              href={cart.checkoutUrl}
              className={`flex items-center justify-center gap-3 bg-black py-[15.56px] text-center text-bunny-white transition-opacity hover:opacity-80 ${LABEL_LG}`}
            >
              <span>Checkout</span>
              <span>{formatMoney(cart.cost.subtotalAmount)}</span>
            </a>
          </>
        )}
      </aside>
    </>
  );
}

// Progress toward free US shipping. Empty bag gets a flat gray track with the
// offer; any progress turns the fill green; at or over the threshold the bar is
// full and green (Gia, 2026-08).
function FreeShippingBar({
  subtotal,
  remaining,
  progressPct,
  currency,
}: {
  subtotal: number;
  remaining: number;
  progressPct: number;
  currency: string;
}) {
  const achieved = subtotal >= FREE_SHIPPING_THRESHOLD;
  const started = subtotal > 0;

  const message = achieved
    ? "Free shipping to United States achieved!"
    : started
      ? `Add ${formatMoney({ amount: String(remaining), currencyCode: currency })} to unlock free shipping`
      : "Unlock free shipping to United States for orders $100+";

  return (
    <div className="pb-6 pt-2">
      <div
        className="h-1.5 w-full overflow-hidden rounded-full bg-card"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progressPct)}
        aria-label="Progress toward free shipping"
      >
        {started && (
          <div
            className="h-full rounded-full bg-[#1F9D55] transition-[width] duration-300"
            style={{ width: `${progressPct}%` }}
          />
        )}
      </div>
      <p className={`mt-2 ${LABEL} ${achieved ? "text-[#1F9D55]" : "text-black"}`}>
        {message}
      </p>
    </div>
  );
}

// Upsell rail: one item at a time, swipeable, and auto-advancing every 3s.
// Auto-advance pauses on hover/touch so it can't move the row out from under a
// finger mid-tap, and stops entirely under prefers-reduced-motion.
function Upsells({
  items,
  onAdd,
  onNavigate,
  busy,
}: {
  items: UpsellItem[];
  onAdd: (variantId: string) => Promise<void>;
  onNavigate: () => void;
  busy: boolean;
}) {
  const railRef = useRef<HTMLUListElement>(null);
  const settleRef = useRef<number | undefined>(undefined);
  // True while the timer's own scrollTo is in flight, so its scroll events do
  // not feed back into setIndex.
  const programmaticRef = useRef(false);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  // Adding a suggestion removes it from the list, so a stored index can fall
  // off the end. Derive the live one instead of writing state from an effect.
  const activeIndex = items.length > 0 ? index % items.length : 0;

  useEffect(() => {
    if (paused || items.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setInterval(() => {
      const rail = railRef.current;
      if (!rail) return;
      const next = (activeIndex + 1) % items.length;
      programmaticRef.current = true;
      setIndex(next);
      rail.scrollTo({ left: next * rail.clientWidth, behavior: "smooth" });
    }, UPSELL_ROTATE_MS);
    return () => window.clearInterval(t);
  }, [activeIndex, paused, items.length]);

  useEffect(() => () => window.clearTimeout(settleRef.current), []);

  if (items.length === 0) return null;

  return (
    <section
      className="border-t border-black/10 px-5 pb-4 pt-4"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      // Without this, touch latched paused=true with nothing to clear it: one
      // tap on a phone (adding an item, say) stopped rotation permanently.
      onTouchEnd={() => setPaused(false)}
      onTouchCancel={() => setPaused(false)}
    >
      <h2 className={LABEL}>You might like</h2>

      <ul
        ref={railRef}
        onScroll={(e) => {
          // Sync only once scrolling settles, and only for user-driven scrolls.
          // A smooth scroll fires many events whose early values still round to
          // the OLD index; syncing on those snapped the timer bar back and
          // restarted it just before the slide landed (Gia, 2026-08).
          const rail = e.currentTarget;
          window.clearTimeout(settleRef.current);
          settleRef.current = window.setTimeout(() => {
            // The timer already knows where it sent the rail; echoing its own
            // scroll back would re-key the bar and restart the fill.
            if (programmaticRef.current) {
              programmaticRef.current = false;
              return;
            }
            setIndex(Math.round(rail.scrollLeft / rail.clientWidth));
          }, 120);
        }}
        className="mt-3 flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item) => (
          <li key={item.handle} className="flex w-full shrink-0 snap-start items-center gap-3">
            <Link
              href={item.href}
              onClick={onNavigate}
              className="relative aspect-square w-14 shrink-0 overflow-hidden bg-white"
            >
              {item.image && (
                <Image
                  src={item.image.url}
                  alt={item.image.alt}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              )}
            </Link>
            <div className={`min-w-0 flex-1 ${LABEL}`}>
              <Link href={item.href} onClick={onNavigate} className="block truncate">
                {item.title}
              </Link>
              <div className="mt-1 font-[350]">
                {formatMoney({ amount: item.price, currencyCode: "USD" })}
              </div>
            </div>
            {item.variantId ? (
              <button
                onClick={() => onAdd(item.variantId!)}
                disabled={busy}
                className={`shrink-0 border border-black px-3 py-2 transition-opacity hover:opacity-60 disabled:opacity-30 ${LABEL}`}
              >
                Add
              </button>
            ) : (
              // Multi-variant: a size has to be chosen, so send them to the PDP
              // rather than adding something arbitrary.
              <Link
                href={item.href}
                onClick={onNavigate}
                className={`shrink-0 border border-black px-3 py-2 transition-opacity hover:opacity-60 ${LABEL}`}
              >
                Choose
              </Link>
            )}
          </li>
        ))}
      </ul>

      {/* One thin bar per suggestion. The active bar fills across a rotation,
          so the bars ARE the timer as well as the position (Gia, 2026-08 —
          replaced prev/next arrows). key={index} remounts the fill so the
          animation restarts on every advance. Decorative: the rail itself is
          swipeable and its links are tabbable, so this adds no control a
          keyboard user needs. */}
      {items.length > 1 && (
        <div aria-hidden className="mt-3 flex gap-1.5">
          {items.map((item, i) => (
            <div key={item.handle} className="h-[2px] flex-1 overflow-hidden bg-black/10">
              {i === activeIndex && (
                <div
                  key={activeIndex}
                  className="upsell-progress h-full bg-black"
                  style={{
                    ["--upsell-duration" as string]: `${UPSELL_ROTATE_MS}ms`,
                    animationPlayState: paused ? "paused" : "running",
                  }}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
