"use client";

import { useEffect, useState } from "react";

// toy-360 loops on the `loop` attribute alone — no trim, no crossfade, no JS loop
// hack. Under prefers-reduced-motion we show the static poster instead of
// autoplaying video. The container matches the clip's 1920×800 (12/5) aspect so
// the full spin shows with no crop. Captions overlay at mid-height (mock design).
export default function CollectionHero({
  left,
  right,
}: {
  left: string;
  right: string;
}) {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return (
    <section className="relative">
      <div className="relative aspect-[12/5] max-h-[70vh] w-full overflow-hidden bg-card">
        {reducedMotion ? (
          <img
            src="/media/toy-360-poster.webp"
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <video
            className="h-full w-full object-cover"
            poster="/media/toy-360-poster.webp"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          >
            <source src="/media/toy-360.webm" type="video/webm" />
            <source src="/media/toy-360.mp4" type="video/mp4" />
          </video>
        )}

        <div className="pointer-events-none absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-between px-6 text-[13px] text-black sm:px-12 sm:text-[15px]">
          <span className="font-medium">{left}</span>
          <span>{right}</span>
        </div>
      </div>
    </section>
  );
}
