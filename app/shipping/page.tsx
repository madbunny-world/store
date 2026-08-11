import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping policy",
  description: "How and when Madbunny ships orders.",
  alternates: { canonical: "/shipping" },
};

// Copy supplied by Gia (madbunny-vault/Policies/Shipping Policy.md, 2026-08-08).
export default function ShippingPage() {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-3 pb-24 pt-16 md:px-12">
      <h1 className="text-[22px] font-semibold">Shipping policy</h1>
      <p className="mt-2 font-mono text-[9px] uppercase tracking-wider text-gun-metal">
        Effective: August 8, 2026
      </p>

      <div className="mt-10 space-y-6 text-[13px] leading-relaxed text-gun-metal [&_strong]:text-black">
        <p>
          After checkout, once the order is confirmed we will send you a
          notification as soon as the item is shipped with tracking.
        </p>
        <p>Please allow 5&ndash;7 business days for shipping and handling.</p>
        <p>Please allow 3&ndash;5 days for delivery once item is shipped out.</p>
        <p>
          Due to high demand of items, orders will be fulfilled in the order they
          are received, and therefore may sell out before a certain item is
          processed.
        </p>
        <p>
          We use USPS for domestic orders (USA) and DHL for international
          (worldwide).
        </p>
      </div>
    </main>
  );
}
