"use client";

import { useEffect, useRef } from "react";

// The metal plate from the home entrance, reused here as the lounge's centrepiece
// and made interactive: it tilts toward the pointer, catching the light the same
// way the intro's twist does. Pointer is tracked on the window (not just the
// plate) so it reacts as you move anywhere in the room. Transform is written
// straight to the node inside rAF — no state, no re-render per frame. Under
// prefers-reduced-motion it stays flat.
const MAX_TILT = 16; // degrees at the far edge of the viewport

export default function MetalPlate() {
  const plateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const plate = plateRef.current;
    if (!plate) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let rotY = 0;
    let rotX = 0;

    const apply = () => {
      frame = 0;
      plate.style.transform = `perspective(900px) rotateY(${rotY.toFixed(2)}deg) rotateX(${rotX.toFixed(2)}deg)`;
    };

    const onMove = (e: PointerEvent) => {
      const r = plate.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      // Normalise by half-viewport so the tilt maxes out at the screen edges.
      const nx = Math.max(-1, Math.min(1, (e.clientX - cx) / (window.innerWidth / 2)));
      const ny = Math.max(-1, Math.min(1, (e.clientY - cy) / (window.innerHeight / 2)));
      rotY = nx * MAX_TILT;
      rotX = -ny * MAX_TILT;
      if (!frame) frame = requestAnimationFrame(apply);
    };

    const onLeave = () => {
      rotY = 0;
      rotX = 0;
      if (!frame) frame = requestAnimationFrame(apply);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={plateRef}
      aria-hidden
      className="w-[200px] transition-transform duration-300 ease-out will-change-transform sm:w-[240px] motion-reduce:transition-none"
    >
      <picture className="block">
        <source srcSet="/media/bunny-metal.webp 1x, /media/bunny-metal@2x.webp 2x" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/media/bunny-metal.webp"
          alt=""
          width={880}
          height={880}
          className="h-auto w-full"
        />
      </picture>
    </div>
  );
}
