"use client";

import { useRef } from "react";

// The static bunny-metal image with a "live metal ticket" hover treatment
// (MatchaCartel reference): the plate tilts a few degrees toward the cursor and
// a light sheen sweeps across it, masked to the bunny silhouette so the glint
// stays on the metal. Real 3D stays deferred (D-15) — the <img> and this whole
// effect live only here, so the R3F swap still touches one file.

const MAX_TILT_DEG = 10;
const REST_SCALE = 0.9; // resting size; grows to 1 on hover
const IMG = "/media/bunny-metal.webp";
const REST_TRANSFORM = `perspective(800px) rotateX(0deg) rotateY(0deg) scale(${REST_SCALE})`;

export default function HeroBunny({ className }: { className?: string }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const sheenRef = useRef<HTMLDivElement>(null);
  const hoveringRef = useRef(false);

  function onPointerMove(e: React.PointerEvent) {
    // Mouse only — on touch, a tap would just snap the tilt around.
    if (e.pointerType !== "mouse") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const frame = frameRef.current;
    const sheen = sheenRef.current;
    if (!frame || !sheen) return;

    const r = frame.getBoundingClientRect();
    const nx = ((e.clientX - r.left) / r.width) * 2 - 1; // -1 .. 1
    const ny = ((e.clientY - r.top) / r.height) * 2 - 1;

    // Ease the scale-up on entry; track the cursor tightly afterwards.
    frame.style.transition = hoveringRef.current
      ? "transform 80ms linear"
      : "transform 280ms cubic-bezier(0.22, 1, 0.36, 1)";
    hoveringRef.current = true;
    frame.style.transform = `perspective(800px) rotateX(${(ny * MAX_TILT_DEG).toFixed(2)}deg) rotateY(${(-nx * MAX_TILT_DEG).toFixed(2)}deg) scale(1)`;

    const px = (((nx + 1) / 2) * 100).toFixed(1);
    const py = (((ny + 1) / 2) * 100).toFixed(1);
    sheen.style.opacity = "1";
    sheen.style.background =
      `radial-gradient(circle at ${px}% ${py}%, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.08) 35%, rgba(0,0,0,0) 62%),` +
      `radial-gradient(circle at ${(100 - Number(px)).toFixed(1)}% ${(100 - Number(py)).toFixed(1)}%, rgba(21,19,18,0.18) 0%, rgba(0,0,0,0) 55%)`;
  }

  function onPointerLeave() {
    const frame = frameRef.current;
    const sheen = sheenRef.current;
    if (!frame || !sheen) return;
    hoveringRef.current = false;
    frame.style.transition = "transform 550ms cubic-bezier(0.22, 1, 0.36, 1)";
    frame.style.transform = REST_TRANSFORM;
    sheen.style.opacity = "0";
  }

  return (
    <div
      ref={frameRef}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className={`relative will-change-transform ${className ?? ""}`}
      style={{ transform: REST_TRANSFORM }}
    >
      <picture>
        <source
          type="image/avif"
          srcSet="/media/bunny-metal.avif 1x, /media/bunny-metal@2x.avif 2x"
        />
        <source
          type="image/webp"
          srcSet={`${IMG} 1x, /media/bunny-metal@2x.webp 2x`}
        />
        <img
          src={IMG}
          alt="Madbunny, chrome"
          width={500}
          height={500}
          className="h-auto w-full"
        />
      </picture>

      {/* Cursor-following glint, clipped to the plate by the image's own alpha. */}
      <div
        ref={sheenRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300"
        style={{
          maskImage: `url(${IMG})`,
          maskSize: "100% 100%",
          WebkitMaskImage: `url(${IMG})`,
          WebkitMaskSize: "100% 100%",
        }}
      />
    </div>
  );
}
