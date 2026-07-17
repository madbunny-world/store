"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Image as ProductImage } from "@/lib/shopify/types";

// Browses all product images with < / > controls and a thumbnail strip.
export default function ProductGallery({
  images,
  title,
}: {
  images: ProductImage[];
  title: string;
}) {
  const [index, setIndex] = useState(0);
  if (images.length === 0) return <div className="aspect-square bg-white" />;

  const count = images.length;
  const current = images[index];
  const go = (delta: number) => setIndex((i) => (i + delta + count) % count);

  return (
    <div>
      <div className="relative aspect-square bg-white">
        <Image
          src={current.url}
          alt={current.altText ?? title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-contain"
          priority
        />

        {count > 1 && (
          <>
            <button
              onClick={() => go(-1)}
              aria-label="Previous image"
              className="absolute left-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-black transition hover:bg-white"
            >
              <ChevronLeft className="h-5 w-5" strokeWidth={1.5} />
            </button>
            <button
              onClick={() => go(1)}
              aria-label="Next image"
              className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-black transition hover:bg-white"
            >
              <ChevronRight className="h-5 w-5" strokeWidth={1.5} />
            </button>
          </>
        )}
      </div>

      {count > 1 && (
        <div className="mt-3 flex flex-wrap gap-3">
          {images.map((img, i) => (
            <button
              key={img.url}
              onClick={() => setIndex(i)}
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
