import Link from "next/link";
import EmailForm from "./club/EmailForm";
import BunnyMark from "./BunnyMark";
import FooterNav, { type FooterGroup } from "./FooterNav";

const CONTACT_EMAIL = "world.madbunny@gmail.com";
const INSTAGRAM_URL = "https://www.instagram.com/madbunny.world/";

// Sitemap-style link groups (reference: Two Jeys) — every route the site owns,
// grouped the way a shopper looks for them: what to buy, who we are, what they
// need after ordering, the legal pages, then social. "My order" and Instagram
// leave the site; Contact opens the reader's own mail client.
function groups(accountUrl: string): FooterGroup[] {
  return [
    {
      heading: "Shop",
      links: [
        { label: "Toy figures", href: "/toyfigures" },
        { label: "Clothing", href: "/clothing" },
        { label: "Private collection", href: "/private-collection" },
      ],
    },
    {
      heading: "Madbunny",
      links: [
        { label: "Studio", href: "/studio" },
        { label: "Collector’s lounge", href: "/collectorslounge" },
      ],
    },
    {
      heading: "Help",
      links: [
        { label: "My order", href: accountUrl, external: true },
        { label: "Shipping policy", href: "/shipping" },
        { label: "Return policy", href: "/returns" },
        { label: "Contact", href: `mailto:${CONTACT_EMAIL}`, external: true },
      ],
    },
    {
      heading: "Legal",
      links: [
        { label: "Terms & conditions", href: "/terms" },
        { label: "Privacy notice", href: "/privacy" },
      ],
    },
    {
      heading: "Follow us",
      links: [{ label: "Instagram", href: INSTAGRAM_URL, external: true }],
    },
  ];
}

// Pure-black footer: the Madclub signup first so it sits in the footer peek,
// then the sitemap as one horizontal band of columns (accordion below md),
// then the copyright. The giant white brand mark is anchored bottom-right,
// bleeding off the bottom edge; the columns pad away from it.
export default function Footer() {
  const accountUrl = `https://${process.env.SHOPIFY_STORE_DOMAIN}/account`;

  return (
    // overflow-clip, NOT overflow-hidden: the mark bleeds past the bottom edge,
    // which makes an overflow-hidden footer a scroll container. The #madclub
    // anchor scrolls every scrollable ancestor, so it was scrolling the footer
    // itself by the bleed amount and shifting the whole footer up. `clip` crops
    // without ever being scrollable.
    <footer className="overflow-clip bg-[#000000] text-bunny-white">
      <div className="relative px-3 pt-12 md:px-12 md:pt-14">
        {/* Signup leads, so it lands inside the footer peek — the sliver of
            footer visible as the page bottom comes into view (Gia, 2026-08).
            #madclub: the announcement bar's "Sign up for Madclub" jumps here,
            from any page. scroll-mt clears the sticky header. */}
        <div id="madclub" className="w-full max-w-md scroll-mt-24">
          <p className="font-sans text-[11px] text-white/45">
            Join Madclub&trade;
          </p>
          <p className="mt-[6px] font-sans text-[11px] font-medium uppercase tracking-wide">
            Subscribe to our newsletter and get new drops and event updates.
          </p>

          <EmailForm variant="dark" />

          <p className="mt-[8px] font-sans text-[10px] text-white/55">
            By subscribing I accept the{" "}
            <Link href="/terms" className="underline">
              Terms and Conditions
            </Link>
          </p>
        </div>

        {/* One horizontal band of columns on md+ (accordion below md). The
            right padding keeps the columns clear of the brand mark, which
            occupies the right ~30% plus its gutter. */}
        <FooterNav
          groups={groups(accountUrl)}
          className="mt-12 md:mt-14 md:pr-[36%]"
        />

        <p className="mt-10 pb-6 font-sans text-[9px] text-white/40 md:mt-12">
          © 2026 Madbunny. All rights reserved.
        </p>

        {/* The mark: in flow below everything on mobile (reference mobile),
            absolute bottom-right beside the newsletter on md+. translate-y
            bleeds it off the footer's bottom edge in both cases. */}
        <div
          aria-hidden
          className="pointer-events-none relative mx-auto w-[72%] max-w-[420px] translate-y-[14%] text-white md:absolute md:bottom-0 md:right-12 md:mx-0 md:w-[30%]"
        >
          <BunnyMark className="h-auto w-full" />
          <span className="absolute right-[-0.5em] top-0 font-sans text-[clamp(18px,2vw,30px)]">
            &reg;
          </span>
        </div>
      </div>
    </footer>
  );
}
