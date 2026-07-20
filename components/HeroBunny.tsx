"use client";

import { useEffect, useRef } from "react";

// The static bunny-metal image with a "live metal ticket" treatment:
// - Desktop (mouse): plate tilts toward the cursor with a light sheen, scales
//   0.9 → 1 while hovered.
// - Mobile (no cursor): the gyroscope drives the same tilt + sheen as the phone
//   moves. Touch never triggers the hover path (pointerType guard).
// Real 3D stays deferred (D-15) — the <img> and this whole effect live only
// here, so the R3F swap still touches one file.

const MAX_TILT_DEG = 10;
const REST_SCALE = 0.9; // resting size; grows to 1 on mouse hover
const GYRO_RANGE_DEG = 18; // device tilt that maps to full plate tilt
const IMG = "/media/bunny-metal.webp";
const REST_TRANSFORM = `perspective(800px) rotateX(0deg) rotateY(0deg) scale(${REST_SCALE})`;

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

export default function HeroBunny({ className }: { className?: string }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const sheenRef = useRef<HTMLDivElement>(null);
  const hoveringRef = useRef(false);

  // Shared renderer for both input sources. nx/ny in [-1, 1].
  function paint(nx: number, ny: number, scale: number, sheenOpacity: number) {
    const frame = frameRef.current;
    const sheen = sheenRef.current;
    if (!frame || !sheen) return;
    frame.style.transform = `perspective(800px) rotateX(${(ny * MAX_TILT_DEG).toFixed(2)}deg) rotateY(${(-nx * MAX_TILT_DEG).toFixed(2)}deg) scale(${scale})`;
    const px = ((nx + 1) / 2) * 100;
    const py = ((ny + 1) / 2) * 100;
    sheen.style.opacity = sheenOpacity.toFixed(2);
    sheen.style.background =
      `radial-gradient(circle at ${px.toFixed(1)}% ${py.toFixed(1)}%, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.08) 35%, rgba(0,0,0,0) 62%),` +
      `radial-gradient(circle at ${(100 - px).toFixed(1)}% ${(100 - py).toFixed(1)}%, rgba(21,19,18,0.18) 0%, rgba(0,0,0,0) 55%)`;
  }

  function onPointerMove(e: React.PointerEvent) {
    // Mouse only — on touch, a tap would just snap the tilt around.
    if (e.pointerType !== "mouse") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const frame = frameRef.current;
    if (!frame) return;

    const r = frame.getBoundingClientRect();
    const nx = ((e.clientX - r.left) / r.width) * 2 - 1; // -1 .. 1
    const ny = ((e.clientY - r.top) / r.height) * 2 - 1;

    // Ease the scale-up on entry; track the cursor tightly afterwards.
    frame.style.transition = hoveringRef.current
      ? "transform 80ms linear"
      : "transform 280ms cubic-bezier(0.22, 1, 0.36, 1)";
    hoveringRef.current = true;
    paint(nx, ny, 1, 1);
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

  // Gyroscope drive (mobile). Attached everywhere — desktops simply never fire
  // deviceorientation — but it defers to an active mouse hover.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let baseBeta: number | null = null;
    let baseGamma: number | null = null;
    let latest: { beta: number; gamma: number } | null = null;
    let raf = 0;

    const apply = () => {
      raf = 0;
      if (!latest || hoveringRef.current) return;
      if (baseBeta === null || baseGamma === null) {
        // First reading = neutral: nobody holds a phone perfectly flat.
        baseBeta = latest.beta;
        baseGamma = latest.gamma;
        return;
      }
      // Slowly re-center so the plate settles wherever the phone comes to rest.
      baseBeta += (latest.beta - baseBeta) * 0.005;
      baseGamma += (latest.gamma - baseGamma) * 0.005;

      const ny = clamp((latest.beta - baseBeta) / GYRO_RANGE_DEG, -1, 1);
      const nx = clamp((latest.gamma - baseGamma) / GYRO_RANGE_DEG, -1, 1);
      const frame = frameRef.current;
      if (frame) frame.style.transition = "transform 80ms linear";
      // Sheen strength follows tilt so the glint fades out at neutral.
      paint(nx, ny, REST_SCALE, Math.min(1, Math.max(Math.abs(nx), Math.abs(ny))));
    };

    const onOrient = (e: DeviceOrientationEvent) => {
      if (e.beta == null || e.gamma == null) return;
      latest = { beta: e.beta, gamma: e.gamma };
      if (!raf) raf = requestAnimationFrame(apply);
    };

    window.addEventListener("deviceorientation", onOrient);

    // iOS 13+ gates motion sensors behind a permission that must be requested
    // from a user gesture — ask on the first tap, touch devices only.
    let removeTap: (() => void) | undefined;
    const doe = DeviceOrientationEvent as unknown as {
      requestPermission?: () => Promise<string>;
    };
    if (
      typeof doe.requestPermission === "function" &&
      window.matchMedia("(hover: none) and (pointer: coarse)").matches
    ) {
      const onFirstTouch = () => {
        doe.requestPermission!().catch(() => {});
      };
      window.addEventListener("pointerdown", onFirstTouch, { once: true });
      removeTap = () => window.removeEventListener("pointerdown", onFirstTouch);
    }

    return () => {
      window.removeEventListener("deviceorientation", onOrient);
      removeTap?.();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={frameRef}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className={`relative will-change-transform ${className ?? ""}`}
      style={{ transform: REST_TRANSFORM }}
    >
      {/* Near-lossless webp only — the 1000px master is the resolution ceiling,
          so we spend bytes on quality instead of an extra (softer) AVIF encode. */}
      <picture>
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

      {/* Input-following glint, clipped to the plate by the image's own alpha. */}
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
