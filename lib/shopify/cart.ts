import { shopifyFetch } from "./client";
import type { Cart, CartLine } from "./types";

// Shopify returns lines as a connection ({ nodes }); we expose a flat array.
type RawCart = Omit<Cart, "lines"> & { lines: { nodes: CartLine[] } };
function normalizeCart(c: RawCart): Cart {
  return { ...c, lines: c.lines.nodes };
}

// Cart reads + mutations. Checkout itself is hosted by Shopify — we only hand off
// to cart.checkoutUrl (D-03). Never cache cart responses.

const CART_FRAGMENT = `
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount { amount currencyCode }
      totalAmount { amount currencyCode }
    }
    lines(first: 50) {
      nodes {
        id
        quantity
        cost { totalAmount { amount currencyCode } }
        merchandise {
          ... on ProductVariant {
            id
            title
            image { url altText width height }
            price { amount currencyCode }
            product { title handle }
          }
        }
      }
    }
  }
`;

export async function createCart(variantId: string, quantity = 1): Promise<Cart> {
  const data = await shopifyFetch<{ cartCreate: { cart: RawCart } }>(
    `
      ${CART_FRAGMENT}
      mutation CartCreate($lines: [CartLineInput!]!) {
        cartCreate(input: { lines: $lines }) { cart { ...CartFields } }
      }
    `,
    {
      variables: { lines: [{ merchandiseId: variantId, quantity }] },
      revalidate: 0,
    },
  );
  return normalizeCart(data.cartCreate.cart);
}

export async function addLine(
  cartId: string,
  variantId: string,
  quantity = 1,
): Promise<Cart> {
  const data = await shopifyFetch<{ cartLinesAdd: { cart: RawCart } }>(
    `
      ${CART_FRAGMENT}
      mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
        cartLinesAdd(cartId: $cartId, lines: $lines) { cart { ...CartFields } }
      }
    `,
    {
      variables: { cartId, lines: [{ merchandiseId: variantId, quantity }] },
      revalidate: 0,
    },
  );
  return normalizeCart(data.cartLinesAdd.cart);
}

export async function updateLine(
  cartId: string,
  lineId: string,
  quantity: number,
): Promise<Cart> {
  const data = await shopifyFetch<{ cartLinesUpdate: { cart: RawCart } }>(
    `
      ${CART_FRAGMENT}
      mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
        cartLinesUpdate(cartId: $cartId, lines: $lines) { cart { ...CartFields } }
      }
    `,
    {
      variables: { cartId, lines: [{ id: lineId, quantity }] },
      revalidate: 0,
    },
  );
  return normalizeCart(data.cartLinesUpdate.cart);
}

export async function removeLine(cartId: string, lineId: string): Promise<Cart> {
  const data = await shopifyFetch<{ cartLinesRemove: { cart: RawCart } }>(
    `
      ${CART_FRAGMENT}
      mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
        cartLinesRemove(cartId: $cartId, lineIds: $lineIds) { cart { ...CartFields } }
      }
    `,
    { variables: { cartId, lineIds: [lineId] }, revalidate: 0 },
  );
  return normalizeCart(data.cartLinesRemove.cart);
}

export async function getCart(cartId: string): Promise<Cart | null> {
  const data = await shopifyFetch<{ cart: RawCart | null }>(
    `
      ${CART_FRAGMENT}
      query Cart($cartId: ID!) {
        cart(id: $cartId) { ...CartFields }
      }
    `,
    { variables: { cartId }, revalidate: 0 },
  );
  return data.cart ? normalizeCart(data.cart) : null;
}
