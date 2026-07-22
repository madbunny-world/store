import type { Metadata } from "next";
import Link from "next/link";
import SplatinkHeading from "@/components/SplatinkHeading";
import SerialForm from "@/components/club/SerialForm";
import EmailForm from "@/components/club/EmailForm";

export const metadata: Metadata = {
  title: "Join Madclub",
  description: "Join Madclub. Get first access to Madbunny drops.",
};

// Mobile (mock): title → email signup on white → serial registration on the red
// photo, all fitting one screen. Desktop keeps the split layout: serial left on
// the photo, email right on white. Serial always rejects in v1 (D-04) with
// exactly "Not a valid serial."
export default function JoinTheClubPage() {
  return (
    <main className="flex flex-1 flex-col">
      <div className="flex flex-col items-center gap-3 px-4 pb-5 pt-4 text-center md:pb-10 md:pt-7">
        <SplatinkHeading name="joinTheClub" className="h-10 sm:h-11" />
        <p className="hidden font-mono text-[11px] uppercase tracking-[0.3em] text-black md:block">
          Get exclusive news from our crew
        </p>
      </div>

      <div className="grid flex-1 md:grid-cols-2">
        {/* Serial registration over the madclub photo — second on mobile, left
            on desktop. */}
        <section className="relative order-2 flex flex-col items-center justify-center overflow-hidden px-6 py-14 md:order-1 md:min-h-[640px] md:py-16">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/media/madclub-photo.webp"
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="relative z-10 flex w-full flex-col items-center text-center">
            <h2 className="font-bebas text-2xl leading-tight text-bunny-white sm:text-3xl">
              Have you collected a Madbunny&reg;?
              <br />
              Register your piece here
            </h2>
            <SerialForm />
            <p className="mt-4 font-sans text-[11.55px] text-[#FF5643]">
              Become a VIP and get invited to our events.
            </p>
          </div>
        </section>

        {/* Email capture on white — first on mobile, right on desktop. */}
        <section className="order-1 flex flex-col items-center justify-center bg-white px-6 py-10 md:order-2 md:min-h-[640px] md:py-16">
          <div className="relative flex w-full flex-col items-center text-center">
            <h2 className="font-bebas text-2xl leading-tight text-black sm:text-3xl">
              Subscribe to <br className="hidden md:inline" />
              Madclub newsletter.
            </h2>
            <EmailForm />
            <p className="mt-4 max-w-sm font-sans text-[11.55px] leading-relaxed text-[#8E8E8E]">
              You agree we&rsquo;ll email you our new collections and drop
              schedules!{" "}
              {/* Inline on mobile (mock); on md+ it hangs one line below the
                  centered block so the two columns stay height-balanced. */}
              <Link href="/privacy" className="underline md:hidden">
                Privacy notice.
              </Link>
            </p>
            <Link
              href="/privacy"
              className="hidden font-sans text-[11.55px] text-[#8E8E8E] underline md:absolute md:left-1/2 md:top-full md:mt-2 md:inline-block md:-translate-x-1/2 md:whitespace-nowrap"
            >
              Privacy notice.
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
