import type { Metadata } from "next";
import Link from "next/link";
import SplatinkHeading from "@/components/SplatinkHeading";
import SerialForm from "@/components/club/SerialForm";
import EmailForm from "@/components/club/EmailForm";

export const metadata: Metadata = {
  title: "Join the club",
  description: "Join Madclub. Get first access to Madbunny drops.",
};

// Split layout (mock): left half is the red madclub event photo with the serial
// form over it; right half is white with the email form. Serial always rejects
// in v1 (D-04) with exactly "Not a valid serial."
export default function JoinTheClubPage() {
  return (
    <main className="flex-1">
      <div className="flex flex-col items-center gap-3 px-4 pb-10 pt-7 text-center">
        <SplatinkHeading name="joinTheClub" className="h-7 sm:h-8" />
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-black">
          Get exclusive news from our crew
        </p>
      </div>

      <div className="grid md:grid-cols-2">
        {/* Left — serial registration over the madclub photo. */}
        <section className="relative flex min-h-[520px] flex-col items-center justify-center overflow-hidden px-6 py-16 md:min-h-[640px]">
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

        {/* Right — email capture on white. */}
        <section className="flex min-h-[520px] flex-col items-center justify-center bg-white px-6 py-16 md:min-h-[640px]">
          <div className="relative flex w-full flex-col items-center text-center">
            <h2 className="font-bebas text-2xl leading-tight text-black sm:text-3xl">
              Not a collector yet?
              <br />
              Sign up for Madbunny&reg; club.
            </h2>
            <EmailForm />
            <p className="mt-4 max-w-sm font-sans text-[11.55px] leading-relaxed text-[#8E8E8E]">
              By signing up, you agree we&rsquo;ll email you the next drops and
              updates.
            </p>
            {/* On md+ the privacy link is pulled out of the centered block's
                height so the heading + form align with the left column; it hangs
                one line below. In the stacked (mobile) layout it sits in flow. */}
            <Link
              href="/privacy"
              className="mt-1 inline-block font-sans text-[11.55px] text-[#8E8E8E] underline md:absolute md:left-1/2 md:top-full md:mt-2 md:-translate-x-1/2 md:whitespace-nowrap"
            >
              Privacy notice.
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
