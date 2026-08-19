import type { Metadata } from "next";
import { ArrowDown } from "lucide-react";
import SplatinkHeading from "@/components/SplatinkHeading";
import { openGraph } from "@/lib/seo";

export const metadata: Metadata = {
  title: "About",
  description: "The founding story of Madbunny — a character-IP drop brand born in a Detroit art studio.",
  alternates: { canonical: "/about" },
  openGraph: openGraph({
    description: "Madbunny’s story and Detroit studio",
    images: [
      {
        url: "/media/brand-landing-poster.webp",
        width: 1920,
        height: 1012,
        alt: "The Madbunny studio",
      },
    ],
  }),
};

// One-pager: the brand film fills the whole page, with the title and the
// founding story laid over it in white (Gia, 2026-08 — the film used to be a
// band between a black title and black body copy). The image carousel, the
// origin-story kicker and the Join Madclub button are gone.
export default function AboutPage() {
  return (
    // min-h, not h: the story runs long on a narrow phone, and the page should
    // grow rather than clip it — the film covers whatever height results.
    // bg-black backs the film so a fractional layout height can't leave a pale
    // hairline where this section meets the black footer.
    <main className="relative flex min-h-[calc(100dvh-111px)] flex-col justify-center overflow-hidden bg-black sm:min-h-[calc(100dvh-132px)]">
      {/* Under prefers-reduced-motion the poster frame stands in for the video
          (house pattern). */}
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
        alt="The Madbunny studio"
        className="absolute inset-0 hidden h-full w-full object-cover motion-reduce:block"
      />

      {/* Scrim: the film runs bright in places, and white copy has to hold over
          every frame of a loop, not just the poster. */}
      <div aria-hidden className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 flex flex-col items-center px-3 py-16 text-center md:px-12">
        {/* Height-capped by viewport width below sm, not the house h-10: this
            title is far longer than the other Splatink headings ("About
            Madbunny© Studio" vs "Clothing"), and at h-10 it measured 376px on a
            375px screen — clipped at both edges. 9vw keeps it inside the gutter
            down to a 320px phone. */}
        <SplatinkHeading name="about" className="h-[9vw] text-bunny-white sm:h-11" />

        {/* 52.8rem = max-w-3xl (48rem) + 10%, widening the measure evenly on
            both sides (Gia, 2026-08). */}
        <div className="mt-12 max-w-[52.8rem] space-y-6 font-sans text-[12px] font-[450] leading-relaxed text-bunny-white">
          {/* What Madbunny is now leads; the origin story follows (Gia,
              2026-08). */}
          <p>
            Madbunny&copy; Studio is a Detroit-based lifestyle brand creating
            collectibles, clothing, and digital goods, all on a mission to
            spread the wild.
          </p>
          <p>
            Since 2022, Korean American designer{" "}
            <strong className="font-bold">gia.</strong>{" "}
            has been learning to
            fully embrace her wild creativity in pursuit of her true self. Along
            the way, she&rsquo;s met entrepreneurs, artists, athletes, and others
            unapologetically obsessed with their craft, people who show up
            boldly. Over time, one thing has become clear: the people who change
            the world are the ones who fully embrace their wildness and bet on
            themselves.
          </p>
          <p>If this sounds like you, join Madclub&copy;.</p>
        </div>

        {/* Scroll cue under the story, pointing at the newsletter block in the
            footer — which is where "join Madclub" actually happens. A bare
            glyph, not the Join Madclub button Gia removed. */}
        <a
          href="#madclub"
          aria-label="Go to the Madclub sign-up"
          className="mt-10 text-bunny-white opacity-70 transition-opacity hover:opacity-100"
        >
          <ArrowDown className="h-5 w-5" strokeWidth={1.75} />
        </a>
      </div>
    </main>
  );
}
