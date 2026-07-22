"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import type { Image as ProductImage } from "@/lib/shopify/types";

// Browses all product images by scrolling: the slides live in a scroll-snap
// track — swipe on touch, trackpad/shift-scroll on desktop — plus a thumbnail
// strip that scrolls the same track smoothly.
export default function ProductGallery({
  images,
  title,
}: {
  images: ProductImage[];
  title: string;
}) {
  const [index, setIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  if (images.length === 0) return <div className="aspect-square bg-white" />;

  const count = images.length;

  const goTo = (i: number) => {
    const track = trackRef.current;
    if (!track) return;
    const target = ((i % count) + count) % count; // wrap both directions
    track.scrollTo({ left: target * track.clientWidth, behavior: "smooth" });
  };

  // Keeps the thumbnail ring in sync with native swipes and smooth scrolls.
  const onScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    const i = Math.round(track.scrollLeft / track.clientWidth);
    setIndex((prev) => (i === prev ? prev : i));
  };

  return (
    <div>
      <div className="relative aspect-square bg-white">
        <div
          ref={trackRef}
          onScroll={onScroll}
          className="flex h-full w-full snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {images.map((img, i) => (
            <div key={img.url} className="relative h-full w-full shrink-0 snap-center">
              <Image
                src={img.url}
                alt={img.altText ?? title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain"
                priority={i === 0}
              />
            </div>
          ))}
        </div>

      </div>

      {count > 1 && (
        <div className="mt-3 flex flex-wrap gap-3">
          {images.map((img, i) => (
            <button
              key={img.url}
              onClick={() => goTo(i)}
              aria-label={`View image ${i + 1}`}
              aria-current={i === index}
              className={`relative h-16 w-16 shrink-0 bg-white ${
                i === index ? "ring-1 ring-black" : "opacity-60 hover:opacity-100"
              }`}
            >
              <Image
                src={img.url}
                alt=""
                fill
                sizes="64px"
                className="object-contain p-1"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
