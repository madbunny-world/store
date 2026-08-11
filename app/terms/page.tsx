import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms and conditions",
  description:
    "The terms that cover buying from Madbunny and using madbunny.world.",
  alternates: { canonical: "/terms" },
};

const EMAIL = "world.madbunny@gmail.com";

// ⚠️ Drafted in-house, not reviewed by a lawyer. The 14-day returns window is
// confirmed (Gia, 2026-08) and is the governing figure — /returns states the
// same, and the two must stay in step. Still unconfirmed: the governing-law
// state (Michigan). The legal entity is Madbunny LLC, per the return policy.
export default function TermsPage() {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-3 pb-24 pt-16 md:px-12">
      <h1 className="text-[22px] font-semibold">Madbunny Terms and Conditions</h1>
      <p className="mt-2 font-mono text-[9px] uppercase tracking-wider text-gun-metal">
        Effective: August 7, 2026
      </p>

      <div className="mt-10 space-y-6 text-[13px] leading-relaxed text-gun-metal [&_strong]:text-black">
        <p>
          These terms cover madbunny.world and anything you buy from us. Using
          the site or placing an order means you accept them.
        </p>
        <p>
          <strong>Who we are.</strong> Madbunny is a character-IP brand based in
          Detroit, USA. You can reach us at{" "}
          <a href={`mailto:${EMAIL}`} className="text-black underline">
            {EMAIL}
          </a>
          .
        </p>
        <p>
          <strong>Orders.</strong> Prices are in US dollars. An order is an offer
          to buy, and the sale is made when we confirm it. We can refuse or
          cancel an order if a piece is out of stock, a price is wrong, or the
          order looks fraudulent. If we cancel, we refund in full. Checkout runs
          on Shopify. Your payment details go to them, never to us.
        </p>
        <p>
          <strong>Limited runs.</strong> Pieces are made in limited numbers. When
          a run sells out, it is gone. We keep those pages up so the release
          stays on record.
        </p>
        <p>
          <strong>Made by hand.</strong> Figures and fine art are finished by
          hand. Small differences in paint, finish, and dimensions are part of
          the work, not faults.
        </p>
        <p>
          <strong>Shipping.</strong> Shipping is free on orders over $100.
          Private collection pieces are excluded and quoted individually.
          Delivery dates are estimates. Risk passes to you once the piece is
          delivered. On international orders, any import duties and taxes are
          yours to pay.
        </p>
        <p>
          <strong>Returns.</strong> Unopened pieces can be returned within 14
          days of delivery for a refund. Return shipping is a flat $5: we send a
          prepaid label and deduct the $5 from your refund. Opened or used pieces
          and all private collection works are final sale. Email us before
          sending anything back. Damaged or incorrect items are on us — tell us
          within 14 days and we will replace or refund, and return shipping is
          free.
        </p>
        <p>
          <strong>Private collection inquiries.</strong> Fine art is not sold
          through the cart. An inquiry is a request, not a purchase. We reply
          with availability, a delivery quote, and payment details. Nothing is
          reserved until we confirm it in writing.
        </p>
        <p>
          <strong>Madclub.</strong> Signing up gets you email about drops and
          events. It costs nothing, requires no purchase, and guarantees no
          access to any release. We can change it or end it.
        </p>
        <p>
          {/* {" "} required: the JSX transform drops the space after </strong>
              when the paragraph contains an HTML entity (&reg; below). */}
          <strong>Intellectual property.</strong>{" "}
          Madbunny&reg;, Madclub&trade;,
          the bunny mark, the figures, the artwork, the photography, and the site
          itself belong to Madbunny. Buying a piece gives you the object, not the
          rights to it. Do not copy, cast, or make products from our designs.
        </p>
        <p>
          <strong>Using the site.</strong> Do not scrape it, overload it, or
          break it. Do not resell our pieces as official Madbunny stock or hold
          yourself out as us.
        </p>
        <p>
          <strong>Your data.</strong> What we collect and why is in the{" "}
          <Link href="/privacy" className="text-black underline">
            privacy notice
          </Link>
          .
        </p>
        <p>
          <strong>Liability.</strong> The site is provided as it is. As far as
          the law allows, we are not liable for indirect or consequential loss.
          Nothing here removes rights you have that cannot be removed.
        </p>
        <p>
          <strong>Governing law.</strong> These terms are governed by the laws of
          the State of Michigan, USA.
        </p>
        <p>
          <strong>Changes.</strong> If these terms change, the updated version
          goes here.
        </p>
        <p>
          <strong>Questions.</strong>{" "}
          <a href={`mailto:${EMAIL}`} className="text-black underline">
            {EMAIL}
          </a>
        </p>
      </div>
    </main>
  );
}
