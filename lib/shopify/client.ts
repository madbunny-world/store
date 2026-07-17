// Shopify Storefront API (GraphQL) client. Reads + cart only.
// Credentials stay server-side — never expose the token to the browser.

const DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const TOKEN = process.env.SHOPIFY_STOREFRONT_API_TOKEN;
const API_VERSION = process.env.SHOPIFY_API_VERSION ?? "2025-07";

export class ShopifyError extends Error {}

/** True when Storefront credentials are configured. */
export function hasShopifyEnv(): boolean {
  return Boolean(DOMAIN && TOKEN);
}

type GraphQLResponse<T> = {
  data?: T;
  errors?: { message: string }[];
};

type FetchOptions = {
  variables?: Record<string, unknown>;
  /** Next.js cache: seconds to revalidate. Omit for default. Set 0 for no-store. */
  revalidate?: number | false;
  tags?: string[];
};

export async function shopifyFetch<T>(
  query: string,
  { variables, revalidate, tags }: FetchOptions = {},
): Promise<T> {
  if (!DOMAIN || !TOKEN) {
    throw new ShopifyError(
      "Missing SHOPIFY_STORE_DOMAIN or SHOPIFY_STOREFRONT_API_TOKEN. Set them in .env.local.",
    );
  }

  const endpoint = `https://${DOMAIN}/api/${API_VERSION}/graphql.json`;

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": TOKEN,
    },
    body: JSON.stringify({ query, variables }),
    ...(revalidate === 0
      ? { cache: "no-store" as const }
      : { next: { revalidate: revalidate === false ? undefined : (revalidate ?? 60), tags } }),
  });

  if (!res.ok) {
    throw new ShopifyError(`Storefront API ${res.status}: ${await res.text()}`);
  }

  const json = (await res.json()) as GraphQLResponse<T>;
  if (json.errors?.length) {
    throw new ShopifyError(json.errors.map((e) => e.message).join("; "));
  }
  if (!json.data) {
    throw new ShopifyError("Storefront API returned no data.");
  }
  return json.data;
}
