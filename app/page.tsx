import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getAllProducts } from "@/lib/shopify/queries";
import { isFineArt, TAG } from "@/lib/catalog";
import { toGridCards } from "@/lib/cards";
import MuseumGrid from "@/components/MuseumGrid";
import { openGraph } from "@/lib/seo";
import IntroGate from "@/components/intro/IntroGate";

// Arms the entrance intro before first paint on hard loads (full cut). The
// intro plays on EVERY arrival at home; client-side navigations get a ~1s
// quick cut armed by IntroGate itself on mount. No JS → the attribute is never
// set → no overlay.
const INTRO_ARM = `try{document.documentElement.setAttribute("data-intro","play")}catch(e){}`;

// Description comes from the root layout's defaults; the canonical is declared
// here (the root no longer sets one — see layout.tsx).
export const metadata: Metadata = {
  alternates: { canonical: "/" },
  // og title is separate from the SEO <title> ("Madbunny — Limited drops"):
  // iMessage and similar rich-link cards render only image + title + domain —
  // no description — and they drop a leading site-name segment, which reduced
  // that title to a bare "Limited drops". No brand prefix, no separator, so it
  // survives intact (Gia, 2026-08).
  openGraph: openGraph({
    title: "Madbunny Official Store",
    description:
      "MADBUNNY OFFICIAL STORE. Madbunny is an iconic lifestyle brand symbolizing “crazy people who change the world”",
  }),
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
        <Wordmark />
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
    // Full-bleed. From md up it is trimmed 40px off the top and bottom edges;
    // below md the whole 1584×960 frame shows uncropped (Gia, 2026-08). The
    // crop is flat px, so it costs a phone far more of the picture than a
    // desktop — 80px is ~10% of an 827px-tall banner but ~35% of a 227px one,
    // which is why it is gated rather than shared.
    //
    // The negative margins pull the image past the wrapper on both edges and
    // the wrapper clips it, so the frame loses height while the photo keeps its
    // native scale — a shorter crop, not a squashed image.
    // overflow-clip rather than overflow-hidden: hidden would make this a
    // scroll container, which is what silently shifted the footer once before.
    // flow-root is load-bearing — clip does NOT establish a block formatting
    // context, so without it the image's negative margins collapse through the
    // wrapper and move the whole banner up instead of trimming it.
    <div className="relative flow-root overflow-clip">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/media/toy-landing.webp"
        alt="Three Madbunny figures in black and mad red on a pale background"
        width={1584}
        height={960}
        className="w-full md:-my-10"
        loading="eager"
        fetchPriority="high"
      />
    </div>
  );
}

// The sticker straddles the seam between the campaign photo and the shop —
// half on the image, half on white — so it reads as slapped across the join
// rather than captioning the banner (Gia, 2026-08).
//
// The negative margin is exactly half the mark's own height, and BOTH are
// percentages of the container width (full-bleed at a 2872×912 ratio, so
// 31.76% of the width tall — halved, 15.88%). Percentage margins resolve
// against width, so the 50/50 split holds at every viewport with no
// breakpoints; if the mark's width ever changes, that number is
// width_fraction × 912 / 2872 / 2. The extra flat offset sits the mark deeper
// into the photo than a true half-and-half (Gia, 2026-08). It has to be
// smaller below md: the offset is flat px while the mark's height scales with
// the viewport, so on a 375px screen the mark is only ~119px tall and a large
// pull lifts it clear off the seam AND drags the section header up behind the
// banner photo. Below md it is therefore a clean 50/50 with no flat term at
// all. The lower
// half stays in normal flow, which is what pushes the section below down —
// there is no hand-tuned padding on the next section to drift out of sync.
//
// It still carries the h1: the words ship as real text for crawlers and screen
// readers, with the artwork marked decorative (SEO — home had no h1 at all).
//
// A raster, not the SVG, and deliberately so: the mark's drop shadow is a blur,
// and Safari renders ANY blur — an SVG <filter> or a CSS drop-shadow — into an
// offscreen texture below device resolution, which read as jagged one way and
// blurry the other. Baking the shadow into pixels leaves nothing to rasterise.
// Exported at 2872px (2x the artwork) from the original filtered SVG, so the
// shadow is the one Figma drew; next/image then serves a ~640px variant to a
// phone rather than the whole file.
function Wordmark() {
  return (
    <h1 className="pointer-events-none relative z-10 -mt-[15.88%] md:mt-[calc(-15.88%_-_70px)] flex justify-center">
      <span className="sr-only">
        Madbunny official store. Madbunny is a lifestyle brand symbolizing
        &ldquo;crazy people who change the world&rdquo;.
      </span>
      <Image
        src="/media/madbunny-logo-sticker.webp"
        alt=""
        width={2872}
        height={912}
        sizes="100vw"
        className="w-full"
        priority
      />
    </h1>
  );
}

// Section header row, reference-style: bold uppercase title on the left, an
// optional bold link pinned right ("SHOP ALL" in the reference).
function SectionHeader({ title, link }: { title: React.ReactNode; link?: { href: string; label: string } }) {
  return (
    <div className="flex items-baseline justify-between px-3 md:px-12">
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

// Toy figures and clothing as separate category sections. The section ids are anchor
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
      {/* Clothing leads, toy figures follow (Gia, 2026-08 — swapped). The
          leading section keeps the tighter top padding: it sits right under the
          sticker, where the following one sits under the full-bleed band. Both
          carry +20px top and bottom over those base values (Gia, 2026-08), so
          the pt numbers here are base + 20 rather than round figures. */}
      {wear.length > 0 && (
        <section id="clothing" className="scroll-mt-20 pb-5 pt-[49px] md:pt-[58px]">
          <SectionHeader title="Clothing" link={{ href: "/clothing", label: "Shop all" }} />
          <div className="mt-12 md:mt-16">
            <MuseumGrid cards={wear} />
          </div>
        </section>
      )}
      {/* The old red landing shot, now a divider between the two shop
          sections (Gia, 2026-08). */}
      <MadclubBand />
      {toys.length > 0 && (
        <section id="toy-figures" className="scroll-mt-20 pb-5 pt-[54px] md:pt-[68px]">
          <SectionHeader
            title="Toy figures"
            link={{ href: "/toyfigures", label: "Shop all" }}
          />
          <div className="mt-12 md:mt-16">
            <MuseumGrid cards={toys} />
          </div>
        </section>
      )}
    </>
  );
}

// The red madclub shot that used to open the page, now sitting between the
// toys and apparel. Full-bleed at its native 2560×1467 ratio.
function MadclubBand() {
  return (
    <section className="mt-[34px] md:mt-12">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/media/madclub-landing.webp"
        alt="Madclub gathering bathed in red light"
        width={2560}
        height={1467}
        className="w-full"
        loading="lazy"
      />
    </section>
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
    <section className="pb-5 pt-[54px] md:pt-[68px]">
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
// it. Whole banner links to /about. Under prefers-reduced-motion the poster
// frame stands in for the video (house pattern).
function StoryTeaser() {
  return (
    <section className="mt-[34px] md:mt-12">
      <Link href="/about" className="group relative block">
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

          {/* Same gutter as the item grids (12px mobile / 48px md+), and the
              top offset equals the side padding so the label sits square in
              the corner (Gia, 2026-08). */}
          {/* flex, not block: as an inline-block on the parent's baseline the
              label picked up ~6px of strut above it, breaking the square
              corner. A flex item starts at the padding edge exactly. */}
          <div className="absolute inset-x-0 top-0 flex px-3 pt-3 md:px-12 md:pt-12">
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
