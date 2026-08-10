import type { Metadata } from "next";
import Link from "next/link";
import { getAllProducts } from "@/lib/shopify/queries";
import { isFineArt, TAG } from "@/lib/catalog";
import { toGridCards } from "@/lib/cards";
import MuseumGrid from "@/components/MuseumGrid";
import IntroGate from "@/components/intro/IntroGate";

// Arms the entrance intro before first paint on hard loads (full cut). The
// intro plays on EVERY arrival at home; client-side navigations get a ~1s
// quick cut armed by IntroGate itself on mount. No JS → the attribute is never
// set → no overlay.
const INTRO_ARM = `try{document.documentElement.setAttribute("data-intro","play")}catch(e){}`;

// Title and description come from the root layout's defaults; only the
// canonical is declared here (the root no longer sets one — see layout.tsx).
export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

// v3 home IS the store: full-bleed campaign banner, the buyable catalog as a
// museum grid, a Private Collection teaser, a story teaser, then the black
// newsletter footer. The entrance intro overlays this page on every arrival.
export default function Home() {
  return (
    <>
      {/* Outside <main>: its float-in animation carries a transform, which
          would re-anchor a position:fixed overlay to <main> instead of the
          viewport for the animation's duration. */}
      <script dangerouslySetInnerHTML={{ __html: INTRO_ARM }} />
      <IntroGate />
      <main className="flex-1">
        <CampaignBanner />
        <Shop />
        <CollectorsBand />
        <PrivateCollection />
        <StoryTeaser />
      </main>
    </>
  );
}

function CampaignBanner() {
  return (
    // Full-bleed at the image's native 2560×1467 ratio — no crop, no shift.
    <div className="relative">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/media/madclub-landing.webp"
        alt="Madclub gathering bathed in red light"
        width={2560}
        height={1467}
        className="w-full"
        loading="eager"
        fetchPriority="high"
      />
      {/* The wordmark IS the page title, so it carries the h1 — with the words
          as real text for crawlers and screen readers, and the artwork marked
          decorative (Gia, 2026-08 — SEO; home had no h1 at all). The SVG is
          1309×341, so width alone sets height. */}
      <h1 className="pointer-events-none absolute inset-x-0 bottom-0 w-full md:px-12">
        <span className="sr-only">
          Madbunny official store. Madbunny is a lifestyle brand symbolizing
          &ldquo;crazy people who change the world&rdquo;.
        </span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/media/madbunny-submark-white.svg"
          alt=""
          width={1309}
          height={341}
          className="w-full"
          loading="eager"
        />
      </h1>
    </div>
  );
}

// Section header row, reference-style: bold uppercase title on the left, an
// optional bold link pinned right ("SHOP ALL" in the reference).
function SectionHeader({ title, link }: { title: React.ReactNode; link?: { href: string; label: string } }) {
  return (
    <div className="flex items-baseline justify-between px-6 md:px-12">
      <h2 className="font-sans text-[10.4px] font-bold uppercase tracking-wide text-black md:text-[13px]">
        {title}
      </h2>
      {link && (
        <Link
          href={link.href}
          className="font-sans text-[10.4px] font-bold uppercase tracking-wide text-black underline-offset-4 hover:underline md:text-[13px]"
        >
          {link.label}
        </Link>
      )}
    </div>
  );
}

// Toys and apparel as separate category sections. The section ids are anchor
// targets for the nav's Shop dropdown; scroll-mt clears the sticky header.
// Home is the shop index, so "Shop all" resolves here.
async function Shop() {
  const products = await getAllProducts();
  const toys = toGridCards(
    products.filter((p) => p.tags.includes(TAG.toy)),
    { basePath: "/shop" },
  );
  const wear = toGridCards(
    products.filter((p) => p.tags.includes(TAG.apparel)),
    { basePath: "/shop" },
  );

  if (toys.length === 0 && wear.length === 0) {
    return (
      <p className="py-24 text-center font-mono text-[11px] text-gun-metal">
        No pieces available.
      </p>
    );
  }

  return (
    <>
      {toys.length > 0 && (
        <section id="hello-world" className="scroll-mt-20 pt-[29px] md:pt-[38px]">
          <SectionHeader
            title={<>&ldquo;Hello, World&rdquo; collection</>}
            link={{ href: "/helloworldcollection", label: "Shop all" }}
          />
          <div className="mt-12 md:mt-16">
            <MuseumGrid cards={toys} />
          </div>
        </section>
      )}
      {wear.length > 0 && (
        <section id="apparel" className="scroll-mt-20 pt-[34px] md:pt-12">
          <SectionHeader title="Apparel" link={{ href: "/apparel", label: "Shop all" }} />
          <div className="mt-12 md:mt-16">
            <MuseumGrid cards={wear} />
          </div>
        </section>
      )}
    </>
  );
}

// Full-bleed black-and-white diptych between apparel and the collection — the
// one photographic break in the white gallery. Converted from the source PNG to
// WebP (2.99MB → 192KB) at the same 2560 width as the campaign banner.
function CollectorsBand() {
  return (
    <section className="mt-[34px] md:mt-12">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/media/left-right.webp"
        alt="Two collectors on a couch with Madbunny figures, beside a signed figure in close-up"
        width={2560}
        height={1417}
        className="w-full"
        loading="lazy"
      />
    </section>
  );
}

async function PrivateCollection() {
  const works = (await getAllProducts()).filter(isFineArt);
  const cards = toGridCards(works, { basePath: "/private-collection" });
  if (cards.length === 0) return null;

  return (
    <section className="pt-[34px] md:pt-12">
      <SectionHeader
        title="Private Collection"
        link={{ href: "/private-collection", label: "Shop all" }}
      />
      <div className="mt-12 md:mt-16">
        <MuseumGrid cards={cards} />
      </div>
    </section>
  );
}

// Brand banner: the landing film on silent loop with the story statement over
// it. Whole banner links to /studio. Under prefers-reduced-motion the poster
// frame stands in for the video (house pattern).
function StoryTeaser() {
  return (
    <section className="mt-[34px] md:mt-12">
      <Link href="/studio" className="group relative block">
        {/* bg-black, not bg-card: the section abuts the black footer, and at
            fractional layout heights the video can leave a subpixel row of the
            well exposed — light gray there reads as a hairline seam. */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-black sm:aspect-[1920/1012]">
          <video
            className="absolute inset-0 h-full w-full object-cover motion-reduce:hidden"
            poster="/media/brand-landing-poster.webp"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          >
            <source src="/media/brand-landing.webm" type="video/webm" />
            <source src="/media/brand-landing.mp4" type="video/mp4" />
          </video>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/media/brand-landing-poster.webp"
            alt=""
            className="absolute inset-0 hidden h-full w-full object-cover motion-reduce:block"
          />

          {/* Scrim so the copy holds over any frame of the film. Label sits
              top-left, so the gradient runs from the top. */}
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/10 to-transparent"
          />

          <div className="absolute inset-x-0 top-0 px-6 pt-8 md:px-12 md:pt-10">
            {/* Hover lights the label rather than underlining it — a text-shadow
                glow reads as film chrome, and drops out under reduced motion. */}
            <span className="inline-block font-sans text-[11px] font-bold uppercase tracking-[0.125em] text-bunny-white transition-[text-shadow] duration-300 group-hover:[text-shadow:0_0_12px_rgba(255,255,255,0.9),0_0_28px_rgba(255,255,255,0.55)] motion-reduce:transition-none">
              In the studio
            </span>
          </div>
        </div>
      </Link>
    </section>
  );
}
