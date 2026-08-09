import Link from "next/link";
import { getAllProducts } from "@/lib/shopify/queries";
import { buyables, isFineArt } from "@/lib/catalog";
import { slugify } from "@/lib/slug";
import BunnyMark from "./BunnyMark";
import MobileMenu from "./MobileMenu";
import HeaderSearch from "./HeaderSearch";
import CartButton from "./cart/CartButton";

const linkClass = "transition-opacity hover:opacity-60";

// v3 chrome (reference: Two Jeys): categories left, mark dead-center, utilities
// right — Helvetica all-caps. Cart lives here in the bar; Instagram is the
// floating lower-right bubble (Gia, 2026-08 — the two swapped places).
// Search is a real overlay filtering the (cached) catalog, fed from here so the
// client component ships only titles and hrefs.
export default async function Nav() {
  // Hosted customer account (email code / Shop app) — same target the /orders
  // page uses; the header goes there directly.
  const accountUrl = `https://${process.env.SHOPIFY_STORE_DOMAIN}/account`;
  const products = await getAllProducts();
  const searchItems = [
    ...buyables(products).map((p) => ({
      title: p.title,
      href: `/shop/${slugify(p.handle)}`,
    })),
    ...products.filter(isFineArt).map((p) => ({
      title: p.title,
      href: `/private-collection/${slugify(p.handle)}`,
    })),
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-sm">
      {/* md and up */}
      <nav className="relative hidden items-center justify-between px-6 py-5 font-sans text-[11.7px] font-medium uppercase tracking-wide md:flex">
        <div className="flex items-center gap-6">
          {/* Shop opens a hover panel with the category sections (also on
              focus-within for keyboard). CSS-only: the panel is a child of the
              group wrapper, so moving the pointer into it keeps :hover alive.
              The categories live here, not at the top level (Gia, 2026-08). */}
          <div className="group relative">
            <Link href="/" className={linkClass}>
              Shop
            </Link>
            {/* No left padding: the panel's edge AND its links land on the same
                24px page gutter as SHOP above them (Gia, 2026-08). */}
            <div className="absolute left-0 top-full hidden min-w-max flex-col gap-3 bg-white pb-5 pr-8 pt-4 shadow-[0_12px_32px_rgba(0,0,0,0.1)] group-focus-within:flex group-hover:flex">
              <Link href="/helloworldcollection" className={linkClass}>
                &ldquo;Hello, World&rdquo; collection
              </Link>
              <Link href="/private-collection" className={linkClass}>
                Private Collection
              </Link>
              <Link href="/apparel" className={linkClass}>
                Apparel
              </Link>
            </div>
          </div>
          <Link href="/studio" className={linkClass}>
            Studio
          </Link>
          <Link href="/collectorslounge" className={linkClass}>
            Collector&rsquo;s lounge
          </Link>
        </div>

        <Link
          href="/"
          aria-label="Madbunny shop"
          className={`${linkClass} absolute left-1/2 -translate-x-1/2`}
        >
          <BunnyMark className="h-6 w-6" />
        </Link>

        <div className="flex items-center gap-6">
          <HeaderSearch items={searchItems} />
          {/* Straight to Shopify's hosted sign-in (email code / Shop app) —
              no interstitial page (Gia, 2026-08). */}
          <a href={accountUrl} className={linkClass}>
            My order
          </a>
          <CartButton />
        </div>
      </nav>

      {/* below md: menu toggle (left) · mark (center) · cart (right).
          grid-cols-3 keeps the mark centered no matter the side icons' widths.
          The -m-3/p-3 pair gives each control a ~44px tap area while leaving the
          icon visually where it sits. */}
      <nav className="grid grid-cols-3 items-center px-4 py-3 md:hidden">
        <div className="flex items-center justify-self-start">
          <MobileMenu accountUrl={accountUrl} />
        </div>
        <Link
          href="/"
          aria-label="Madbunny shop"
          className={`${linkClass} -m-3 justify-self-center p-3`}
        >
          <BunnyMark className="h-[1.44rem] w-[1.44rem]" />
        </Link>
        <CartButton className="-m-3 justify-self-end p-3" />
      </nav>
    </header>
  );
}
