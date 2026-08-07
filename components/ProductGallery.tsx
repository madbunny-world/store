"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Image as ProductImage } from "@/lib/shopify/types";

// Reference-style gallery: slides in a scroll-snap track (swipe on touch,
// trackpad/shift-scroll on desktop), bare chevrons at the image edges on sm+,
// and a thin progress line under the image instead of a thumbnail strip.
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

  // Keeps the progress line in sync with native swipes and smooth scrolls.
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

        {count > 1 && (
          <>
            <button
              onClick={() => goTo(index - 1)}
              aria-label="Previous image"
              className="absolute left-0 top-1/2 hidden -translate-y-1/2 p-2 text-gun-metal/60 transition-colors hover:text-black sm:block"
            >
              <ChevronLeft className="h-7 w-7" strokeWidth={1} />
            </button>
            <button
              onClick={() => goTo(index + 1)}
              aria-label="Next image"
              className="absolute right-0 top-1/2 hidden -translate-y-1/2 p-2 text-gun-metal/60 transition-colors hover:text-black sm:block"
            >
              <ChevronRight className="h-7 w-7" strokeWidth={1} />
            </button>
          </>
        )}
      </div>

      {/* Progress line — the filled segment slides to the active image. */}
      {count > 1 && (
        <div className="mt-4 h-px w-full bg-black/10">
          <div
            className="h-[2px] -translate-y-px bg-black transition-transform duration-300 ease-out"
            style={{
              width: `${100 / count}%`,
              transform: `translateX(${index * 100}%)`,
            }}
          />
        </div>
      )}
    </div>
  );
}
