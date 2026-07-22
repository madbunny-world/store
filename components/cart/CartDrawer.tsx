"use client";

import Image from "next/image";
import { X, Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "./CartProvider";
import { formatMoney } from "@/lib/money";

export default function CartDrawer() {
  const { cart, isOpen, isPending, close, updateItem, removeItem } = useCart();

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
        aria-label="Cart"
        className={`fixed inset-y-0 right-0 z-[70] flex w-full max-w-sm flex-col bg-white transition-transform duration-200 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4 font-mono text-[11px] uppercase tracking-wider">
          <span>Cart</span>
          <button onClick={close} aria-label="Close cart" className="hover:opacity-60">
            <X className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5">
          {!cart || cart.lines.length === 0 ? (
            <p className="py-8 font-mono text-[11px] text-gun-metal">Your cart is empty.</p>
          ) : (
            <ul className="divide-y divide-black/10">
              {cart.lines.map((line) => (
                <li key={line.id} className="flex gap-3 py-4">
                  <div className="relative h-16 w-16 shrink-0 bg-white">
                    {line.merchandise.image && (
                      <Image
                        src={line.merchandise.image.url}
                        alt={line.merchandise.image.altText ?? line.merchandise.product.title}
                        fill
                        sizes="64px"
                        className="object-contain"
                      />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col font-mono text-[11px]">
                    <div>{line.merchandise.product.title}</div>
                    <div className="text-gun-metal">{line.merchandise.title}</div>

                    <div className="mt-auto flex items-center justify-between pt-2">
                      {/* Quantity stepper */}
                      <div className="flex items-center border border-black/15">
                        <button
                          onClick={() => updateItem(line.id, line.quantity - 1)}
                          disabled={isPending || line.quantity <= 1}
                          aria-label="Decrease quantity"
                          className="flex h-7 w-7 items-center justify-center hover:bg-black/5 disabled:opacity-30"
                        >
                          <Minus className="h-3 w-3" strokeWidth={1.5} />
                        </button>
                        <span className="w-7 text-center tabular-nums">{line.quantity}</span>
                        <button
                          onClick={() => updateItem(line.id, line.quantity + 1)}
                          disabled={isPending}
                          aria-label="Increase quantity"
                          className="flex h-7 w-7 items-center justify-center hover:bg-black/5 disabled:opacity-30"
                        >
                          <Plus className="h-3 w-3" strokeWidth={1.5} />
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-gun-metal">
                          {formatMoney(line.cost.totalAmount)}
                        </span>
                        <button
                          onClick={() => removeItem(line.id)}
                          disabled={isPending}
                          aria-label="Remove item"
                          className="text-gun-metal transition-colors hover:text-mad-red disabled:opacity-30"
                        >
                          <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {cart && cart.lines.length > 0 && (
          <div className="border-t border-black/10 px-5 py-4">
            <div className="mb-3 flex justify-between font-mono text-[11px] uppercase tracking-wider">
              <span>Subtotal</span>
              <span>{formatMoney(cart.cost.subtotalAmount)}</span>
            </div>
            <a
              href={cart.checkoutUrl}
              className="block bg-black py-3 text-center font-mono text-[11px] uppercase tracking-wider text-bunny-white transition-opacity hover:opacity-80"
            >
              Checkout
            </a>
          </div>
        )}
      </aside>
    </>
  );
}
