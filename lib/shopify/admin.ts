// Shopify Admin API — used only server-side for the marketing list (customerCreate
// with consent). Separate from the Storefront client. Never expose this token.

const DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_API_TOKEN;
const API_VERSION = process.env.SHOPIFY_API_VERSION ?? "2025-07";

export function hasAdminEnv(): boolean {
  return Boolean(DOMAIN && ADMIN_TOKEN);
}

type CustomerCreateResult = {
  customerCreate: {
    customer: { id: string } | null;
    userErrors: { field: string[] | null; message: string }[];
  };
};

/**
 * Create (or, on duplicate, no-op) a customer subscribed to email marketing.
 * Returns true on success. Throws only on transport/auth failure.
 */
export async function createSubscriber(email: string): Promise<boolean> {
  if (!hasAdminEnv()) throw new Error("Shopify Admin API not configured");

  const res = await fetch(`https://${DOMAIN}/admin/api/${API_VERSION}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": ADMIN_TOKEN!,
    },
    cache: "no-store",
    body: JSON.stringify({
      query: `
        mutation SubscribeCustomer($input: CustomerInput!) {
          customerCreate(input: $input) {
            customer { id }
            userErrors { field message }
          }
        }
      `,
      variables: {
        input: {
          email,
          emailMarketingConsent: {
            marketingState: "SUBSCRIBED",
            marketingOptInLevel: "SINGLE_OPT_IN",
          },
        },
      },
    }),
  });

  if (!res.ok) throw new Error(`Admin API ${res.status}: ${await res.text()}`);
  const json = (await res.json()) as {
    data?: CustomerCreateResult;
    errors?: { message: string }[];
  };

  // Top-level GraphQL errors (e.g. a token missing the write_customers scope)
  // leave customerCreate null — surface them instead of dereferencing null.
  if (json.errors?.length) {
    throw new Error(json.errors.map((e) => e.message).join("; "));
  }

  const errs = json.data?.customerCreate?.userErrors ?? [];
  // "Email has already been taken" means they're already on the list — treat as ok.
  const onlyDuplicate = errs.length > 0 && errs.every((e) => /already been taken/i.test(e.message));
  if (errs.length > 0 && !onlyDuplicate) {
    throw new Error(errs.map((e) => e.message).join("; "));
  }
  return true;
}
