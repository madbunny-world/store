import type { Metadata } from "next";
import SplatinkHeading from "@/components/SplatinkHeading";
import SerialForm from "@/components/club/SerialForm";
import MetalPlate from "@/components/club/MetalPlate";
import { openGraph } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Collectors lounge",
  description: "Register your Madbunny piece. Members get first access.",
  alternates: { canonical: "/collectorslounge" },
  openGraph: openGraph({
    description: "Register your piece. Members get first access to drops.",
    images: [
      {
        url: "/media/left-right.webp",
        width: 2560,
        height: 1417,
        alt: "Two collectors with Madbunny figures",
      },
    ],
  }),
};

// White gallery page like the rest of the site (Gia, 2026-08 — the madclub
// photo backdrop is gone, so the room is no longer dark and the type is black).
// Title sits at the same top padding as the category pages, then the
// interactive plate, then the ticket-stub serial input. Serial always rejects
// in v1 (D-04) with exactly "Not a valid serial."
export default function CollectorsLoungePage() {
  return (
    <main className="flex-1 pb-24">
      <div className="flex flex-col items-center px-3 pt-6 text-center md:px-12 md:pt-[34px]">
        <SplatinkHeading name="collectorsLounge" className="h-10 sm:h-11" />
        <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.35em] text-mad-red">
          Members only
        </p>

        <div className="mt-10">
          <MetalPlate />
        </div>

        {/* Definite width, not max-w: as a flex item this column sizes to
            fit-content, so a max-width never binds. 354px = 20% wider than the
            295px it used to resolve to; the calc cap keeps it inside the gutter
            on mobile. */}
        <div className="mt-10 flex w-[354px] max-w-[calc(100vw-1.5rem)] shrink-0 flex-col items-center text-center">
          <SerialForm />
          <p className="mt-5 font-sans text-[12px] leading-relaxed text-gun-metal">
            Registered collectors get first access to drops and invitations to
            Madclub members&rsquo; events.
          </p>
        </div>
      </div>
    </main>
  );
}
