"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  useTransition,
} from "react";
import { addToCart, fetchCart, removeCartLine, updateCartLine } from "@/app/actions/cart";
import type { Cart } from "@/lib/shopify/types";

type CartContextValue = {
  cart: Cart | null;
  isOpen: boolean;
  isPending: boolean;
  open: () => void;
  close: () => void;
  addItem: (variantId: string, quantity?: number) => Promise<void>;
  updateItem: (lineId: string, quantity: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Hydrate the cart from the httpOnly cookie on mount.
  useEffect(() => {
    fetchCart().then(setCart).catch(() => setCart(null));
  }, []);

  const addItem = useCallback(async (variantId: string, quantity = 1) => {
    const next = await addToCart(variantId, quantity);
    setCart(next);
    setIsOpen(true);
  }, []);

  // Wrap a cart mutation in a transition and surface its promise to callers.
  const run = useCallback(
    (fn: () => Promise<void>) =>
      new Promise<void>((resolve, reject) => {
        startTransition(async () => {
          try {
            await fn();
            resolve();
          } catch (err) {
            reject(err);
          }
        });
      }),
    [],
  );

  const value: CartContextValue = {
    cart,
    isOpen,
    isPending,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    addItem: (variantId, quantity) => run(() => addItem(variantId, quantity)),
    updateItem: (lineId, quantity) =>
      run(async () => setCart(await updateCartLine(lineId, quantity))),
    removeItem: (lineId) => run(async () => setCart(await removeCartLine(lineId))),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
