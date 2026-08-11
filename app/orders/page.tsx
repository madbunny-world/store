import type { Metadata } from "next";
import { getAllProducts } from "@/lib/shopify/queries";
import { buyables } from "@/lib/catalog";
import { toGridCards } from "@/lib/cards";
import { CTA_BAR_CLASS } from "@/components/BuyPanel";
import MuseumGrid from "@/components/MuseumGrid";

export const metadata: Metadata = {
  title: "Orders",
  description: "Track your Madbunny order.",
  alternates: { canonical: "/orders" },
};

// Stateless by design: checkout is Shopify-hosted and cross-domain, so the app
// never holds order state. "Track your order" opens Shopify's hosted customer
// account (email code or Shop app). Requires customer accounts to be enabled in
// Shopify Admin → Settings → Customer accounts.
export default async function OrdersPage() {
  const accountUrl = `https://${process.env.SHOPIFY_STORE_DOMAIN}/account`;

  const products = buyables(await getAllProducts()).filter(
    (p) => p.availableForSale,
  );
  const picks = products.slice(0, 3);
  const cards = toGridCards(picks, { basePath: "/shop" });

  return (
    <main className="flex-1 pb-24">
      <div className="px-3 pt-14 md:px-12 md:pt-20">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-black">
          Orders
        </p>
        <h1 className="mt-4 font-sans text-[clamp(24px,4vw,44px)] font-bold leading-[0.95] tracking-tight text-black">
          Track your order.
        </h1>
        <p className="mt-4 max-w-md font-sans text-[14px] leading-relaxed text-gun-metal">
          Sign in with the email you used at checkout. We send a code. No
          password.
        </p>
        <a
          href={accountUrl}
          className={`${CTA_BAR_CLASS} mt-8 max-w-md justify-center bg-black hover:opacity-80`}
        >
          Track your order
        </a>
      </div>

      {cards.length > 0 && (
        <section className="pt-24 md:pt-32">
          <p className="px-3 font-mono text-[11px] uppercase tracking-[0.3em] text-black md:px-12">
            While you are here
          </p>
          <div className="mt-10">
            <MuseumGrid cards={cards} />
          </div>
        </section>
      )}
    </main>
  );
}
