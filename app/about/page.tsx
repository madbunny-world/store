import type { Metadata } from "next";
import SplatinkHeading from "@/components/SplatinkHeading";

export const metadata: Metadata = { title: "About" };

// Static. Copy matches Gia's /about mock verbatim. No commerce.
export default function AboutPage() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-24 pt-12 sm:px-6">
      <div className="flex flex-col items-center gap-3">
        <SplatinkHeading name="about" className="h-8 sm:h-9" />
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-black">
          The Founding Story
        </p>
      </div>

      <div className="mt-14 grid gap-10 md:grid-cols-2 md:gap-14">
        {/* Left column — copy + second photo below */}
        <div className="flex flex-col gap-10">
          <div className="space-y-4 text-[15px] leading-relaxed">
            <p>
              As a 5&rsquo;3&quot;-tall Asian girl, the founder has always been
              perceived with simple image: cute, kind, and a soft bunny, more or
              less. But she noticed something. Whenever she spoke up a thought, an
              opinion, a sharp observation, something with a little heat in it,
              people seemed surprised. As if softness and conviction weren&rsquo;t
              supposed to come from the same person.
            </p>
            <p>
              She found that curious. Because to her it had never felt like a
              contradiction. She&rsquo;d always known she held more than one self at
              once, and the more she paid attention, the more she saw that everyone
              did. Most people just don&rsquo;t get looked at long enough for the
              other sides to show.
            </p>
            <p>
              That idea stayed with her. Eventually it became a character: embracing
              a mix of different person at the same time.
            </p>
            <p>That became Madbunny&reg;.</p>
          </div>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/media/about-event.webp"
            alt="Madbunny toy on display at a gallery event"
            width={768}
            height={406}
            className="w-full"
          />
        </div>

        {/* Right column — tall photo */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/media/about-couch.webp"
          alt="Two collectors seated with Madbunny toys"
          width={568}
          height={697}
          className="h-full w-full object-cover"
        />
      </div>
    </main>
  );
}
