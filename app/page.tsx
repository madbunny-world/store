import Link from "next/link";
import HeroBunny from "@/components/HeroBunny";
import ZoneClock from "@/components/ZoneClock";
import { ZONE } from "@/lib/time";

// Home is a landing page, not a gate — the nav (root layout) is present on it.
export default function Home() {
  return (
    <main
      data-no-float
      className="relative flex flex-1 flex-col items-center justify-center px-4 py-16"
    >
      {/* City readouts flank the bunny (spec §7.1). On mobile they anchor to the
          bottom corners; on sm+ they pin to the vertical center, flanking the mark. */}
      <div className="absolute inset-x-6 bottom-8 flex justify-between font-bebas text-lg uppercase leading-tight tracking-wide sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2">
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

      <Link href="/collectibles" aria-label="Enter the shop" className="peer">
        <HeroBunny className="w-[69vw] max-w-[506px]" />
      </Link>

      {/* Gray at rest; blinks black while the plate is hovered (peer). Direct
          hover on the text itself just goes solid black. */}
      <Link
        href="/collectibles"
        className="mt-8 font-bebas text-xl uppercase tracking-normal text-gun-metal transition-colors hover:text-black peer-hover:animate-enter-blink peer-hover:text-black motion-reduce:animate-none"
      >
        [Click to enter]
      </Link>
    </main>
  );
}
