import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Return policy",
  description: "How to return or exchange a Madbunny order.",
  alternates: { canonical: "/returns" },
};

const EMAIL = "world.madbunny@gmail.com";
const ADDRESS = "Madbunny LLC, 8233 John R st, Detroit MI 48202, United States";

// Copy supplied by Gia (madbunny-vault/Policies/Return Policy.md, 2026-08-08),
// with the return window changed from 30 to 14 days (Gia, 2026-08) so it agrees
// with the Terms page. 14 days is now the single governing window — if it ever
// changes, it has to change on /terms too.
function Mail() {
  return (
    <a href={`mailto:${EMAIL}`} className="text-black underline">
      {EMAIL}
    </a>
  );
}

export default function ReturnsPage() {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 pb-24 pt-16 sm:px-6">
      <h1 className="text-[22px] font-semibold">Return policy</h1>
      <p className="mt-2 font-mono text-[9px] uppercase tracking-wider text-gun-metal">
        Effective: August 8, 2026
      </p>

      <div className="mt-10 space-y-6 text-[13px] leading-relaxed text-gun-metal [&_strong]:text-black">
        <p>
          We have a 14-day return policy, which means you have 14 days after
          receiving your item to request a return.
        </p>
        <p>
          To be eligible for a return, your item must be in the same condition
          that you received it, unworn or unused, with tags, and in its original
          packaging. You&rsquo;ll also need the receipt or proof of purchase.
        </p>
        <p>To start a return, contact us at <Mail />.</p>
        <p>
          If your return is accepted, we&rsquo;ll send you a return shipping
          label with instructions on how and where to send your package. Items
          sent back to us without first requesting a return will not be
          accepted.
        </p>
        <p>
          You can always contact us for any return question at <Mail />.
        </p>

        <p>
          <strong>Damages and issues.</strong> Please inspect your order upon
          reception and contact us immediately if the item is defective, damaged
          or if you receive the wrong item, so that we can evaluate the issue and
          make it right.
        </p>
        <p>
          <strong>Exceptions / non-returnable items.</strong> Certain types of
          items cannot be returned, like perishable goods (such as food, flowers,
          or plants), custom products (such as special orders or personalized
          items), and personal care goods (such as beauty products). We also do
          not accept returns for hazardous materials, flammable liquids, or
          gases. Please get in touch if you have questions or concerns about your
          specific item.
        </p>
        <p>
          Unfortunately, we cannot accept returns on sale items or gift cards.
        </p>
        <p>
          {/* {" "} is required, not decorative: this toolchain's JSX transform
              drops the space after </strong> when the paragraph contains an
              HTML entity (&rsquo; below). Same for the three paragraphs after. */}
          <strong>Returns.</strong>{" "}
          Our policy lasts 14 days. If 14 days have
          gone by since delivery, unfortunately we can&rsquo;t offer you a
          refund or exchange.
        </p>
        <p>
          <strong>Refunds.</strong>{" "}
          We will notify you once we&rsquo;ve received
          and inspected your return, and let you know if the refund was approved
          or not. If approved, you&rsquo;ll be automatically refunded on your
          original payment method within 10 business days. Please remember it can
          take some time for your bank or credit card company to process and post
          the refund too. If more than 15 business days have passed since
          we&rsquo;ve approved your return, please contact us at <Mail />.
        </p>
        <p>
          <strong>Exchanges.</strong> We only replace items if they are defective
          or damaged. If you need to exchange it for the same item, send us an
          email at <Mail /> and send your item to: {ADDRESS}.
        </p>
        <p>
          Depending on where you live, the time it may take for your exchanged
          product to reach you may vary.
        </p>
        <p>
          <strong>Return shipping.</strong> Return shipping is a flat $5. Once
          your return is accepted we send you a prepaid, tracked label with
          instructions, and the $5 is deducted from your final refund. There is
          nothing to arrange and nothing to pay up front. Damaged or incorrect
          items ship back free.
        </p>
        <p>Returns are addressed to: {ADDRESS}.</p>
        <p>
          <strong>Gifts.</strong>{" "}
          If the item was marked as a gift when purchased
          and shipped directly to you, you&rsquo;ll receive a gift credit for the
          value of your return. Once the returned item is received, a gift
          certificate will be mailed to you.
        </p>
        <p>
          If the item wasn&rsquo;t marked as a gift when purchased, or the gift
          giver had the order shipped to themselves to give to you later, we will
          send a refund to the gift giver and they will find out about your
          return.
        </p>
        <p>
          <strong>Late or missing refunds.</strong>{" "}
          If you haven&rsquo;t received
          a refund yet, first check your bank account again. Then contact your
          credit card company, it may take some time before your refund is
          officially posted. Next contact your bank. There is often some
          processing time before a refund is posted. If you&rsquo;ve done all of
          this and you still have not received your refund yet, please contact us
          at <Mail />.
        </p>
        <p>
          <strong>Additional non-returnable items.</strong> Gift cards,
          downloadable software products, and some health and personal care
          items.
        </p>
      </div>
    </main>
  );
}
