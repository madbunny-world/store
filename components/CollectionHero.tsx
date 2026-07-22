"use client";

import { useEffect, useState } from "react";

// The clip loops on the `loop` attribute alone — no trim, no crossfade, no JS
// loop hack. Under prefers-reduced-motion we show the static poster instead of
// autoplaying video. The container matches the clip's 1920×600 (16:5) aspect so
// the full frame shows with no crop. The marketing clip carries its own title
// text, so there is no HTML caption overlay.
export default function CollectionHero() {
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
      <div className="relative aspect-[16/5] max-h-[70vh] w-full overflow-hidden bg-card">
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
      </div>
    </section>
  );
}
