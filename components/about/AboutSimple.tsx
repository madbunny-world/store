import Link from "next/link";
import SplatinkHeading from "@/components/SplatinkHeading";
import { CHAPTERS } from "./chapters";

// Mobile /about (mock): a simple light one-pager — title, one circle photo,
// the founding story as stacked paragraphs, and a Join Madclub button. The
// scroll-driven dark carousel (AboutStory) remains the sm+ experience.
export default function AboutSimple({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex flex-col items-center px-6 pb-14 pt-4 text-center ${className}`}
    >
      <SplatinkHeading name="about" className="h-10" />

      <div className="mt-9 aspect-square w-[48vw] max-w-[220px] overflow-hidden rounded-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={CHAPTERS[0].src}
          alt={CHAPTERS[0].alt}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="mt-10 flex max-w-md flex-col gap-10 font-sans text-[15px] leading-relaxed text-black [&_strong]:font-semibold">
        {CHAPTERS.map((c, i) => (
          <p key={i}>{c.copy}</p>
        ))}
      </div>

      <Link
        href="/jointheclub"
        className="mt-11 block w-full max-w-sm bg-black py-3.5 font-sans text-[15px] text-white transition-opacity hover:opacity-80"
      >
        Join Madclub
      </Link>
    </div>
  );
}
