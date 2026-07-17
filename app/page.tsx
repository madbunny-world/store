import Link from "next/link";
import HeroBunny from "@/components/HeroBunny";
import ZoneClock from "@/components/ZoneClock";
import { ZONE } from "@/lib/time";

// Home is a landing page, not a gate — the nav (root layout) is present on it.
export default function Home() {
  return (
    <main className="relative flex flex-1 flex-col items-center justify-center px-4 py-16">
      {/* City readouts flank the bunny (spec §7.1). Static on mobile, pinned on sm+. */}
      <div className="order-2 mt-10 flex w-full justify-between font-bebas text-lg uppercase leading-tight tracking-wide sm:absolute sm:inset-x-6 sm:top-1/2 sm:order-none sm:mt-0 sm:w-auto sm:-translate-y-1/2">
        <div className="space-y-0.5">
          <div>New York, USA</div>
          <div>Detroit, USA</div>
          <div className="text-gun-metal">
            <ZoneClock timeZone={ZONE.eastern} />
          </div>
        </div>
        <div className="space-y-0.5 text-right">
          <div>Seoul, KR</div>
          <div className="text-gun-metal">
            <ZoneClock timeZone={ZONE.seoul} />
          </div>
        </div>
      </div>

      <Link href="/collectibles" aria-label="Enter the shop">
        <HeroBunny className="w-[60vw] max-w-[440px]" />
      </Link>

      <Link
        href="/collectibles"
        className="order-3 mt-8 font-bebas text-xl uppercase tracking-normal transition-opacity hover:opacity-60 sm:order-none"
      >
        [Click to enter]
      </Link>
    </main>
  );
}
