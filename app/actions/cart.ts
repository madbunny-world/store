"use server";

import { cookies } from "next/headers";
import { addLine, createCart, getCart, removeLine, updateLine } from "@/lib/shopify/cart";
import type { Cart } from "@/lib/shopify/types";

const CART_COOKIE = "madbunny_cart";
const COOKIE_OPTS = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 24 * 30, // 30 days
};

/** Add a variant to the cart, creating the cart on first add. */
export async function addToCart(variantId: string, quantity = 1): Promise<Cart> {
  const jar = await cookies();
  const existingId = jar.get(CART_COOKIE)?.value;

  let cart: Cart;
  if (existingId) {
    try {
      cart = await addLine(existingId, variantId, quantity);
    } catch {
      // Cart expired or invalid — start a fresh one.
      cart = await createCart(variantId, quantity);
    }
  } else {
    cart = await createCart(variantId, quantity);
  }

  jar.set(CART_COOKIE, cart.id, COOKIE_OPTS);
  return cart;
}

/** Change a line's quantity. Quantity ≤ 0 removes the line. */
export async function updateCartLine(lineId: string, quantity: number): Promise<Cart | null> {
  const jar = await cookies();
  const id = jar.get(CART_COOKIE)?.value;
  if (!id) return null;
  if (quantity <= 0) return removeLine(id, lineId);
  return updateLine(id, lineId, quantity);
}

/** Remove a line entirely. */
export async function removeCartLine(lineId: string): Promise<Cart | null> {
  const jar = await cookies();
  const id = jar.get(CART_COOKIE)?.value;
  if (!id) return null;
  return removeLine(id, lineId);
}

/** Read the current cart, or null if none / expired. */
export async function fetchCart(): Promise<Cart | null> {
  const jar = await cookies();
  const id = jar.get(CART_COOKIE)?.value;
  if (!id) return null;
  try {
    return await getCart(id);
  } catch {
    return null;
  }
}
