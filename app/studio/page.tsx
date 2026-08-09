import type { Metadata } from "next";
import SplatinkHeading from "@/components/SplatinkHeading";

export const metadata: Metadata = {
  title: "Studio",
  description: "The founding story of Madbunny — a character-IP drop brand born in a Detroit art studio.",
};

// One-pager: Splatink title at the same pt-10/md:pt-14 as every other page
// title, the brand film on silent loop, then the founding story. The image
// carousel, the origin-story kicker and the Join Madclub button are gone
// (Gia, 2026-08).
export default function StudioPage() {
  return (
    // Height-locked to the viewport so the page never scrolls: nav (47px mobile
    // / 68px desktop) and footer (64px) are fixed, and the film takes whatever
    // height is left over.
    <main className="flex h-[calc(100dvh-111px)] flex-col pb-11 sm:h-[calc(100dvh-132px)]">
      <div className="flex shrink-0 flex-col items-center px-6 pt-10 text-center md:pt-14">
        <SplatinkHeading name="studio" className="h-10 sm:h-11" />
      </div>

      {/* Fills the space the carousel used to. Under prefers-reduced-motion the
          poster frame stands in for the video (house pattern). */}
      <div className="mt-8 min-h-0 max-h-[634px] flex-1">
        <video
          className="h-full w-full object-cover motion-reduce:hidden"
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
          className="hidden h-full w-full object-cover motion-reduce:block"
        />
      </div>

      <div className="mx-auto mt-12 max-w-3xl shrink-0 space-y-6 px-6 text-center font-sans text-[12px] font-[450] leading-relaxed text-black">
        <p>
          Madbunny began in 2022 as a sketch in Korean American designer Gia
          Kim&rsquo;s notebook. The name came from friends, who called her
          &ldquo;a madbunny!&rdquo; for her wild side. She kept the name and
          built the character around it.
        </p>
        <p>
          In a Detroit studio she made the first figures by hand, one at a time,
          and sold them to people who came looking. The brand debuted at
          Artclvb&rsquo;s Art Fair with a limited run that sold out.
        </p>
        <p>
          Today Madbunny runs as a lifestyle and art brand, carrying the same
          bold character energy into every form it can hold. Our community
          Madclub is the next. A collective of creatives and collectors who are
          obsessive about their work and unapologetic about every side of
          themselves. You already know if you are one, join us.
        </p>
      </div>
    </main>
  );
}
