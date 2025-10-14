"use client";

import { useState } from "react";
import ZoomableCarousel from "../ZoomableCarousel.tsx";

type Props = {
  images: string[];
  index: number;
  alt?: string;
};

export default function ZoomableImage({ images, index, alt }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <img
        src={images[index]}
        alt={alt}
        className="cursor-zoom-in w-2/3 hover:opacity-90 transition"
        onClick={() => setOpen(true)}
      />

      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
          <div
            className="absolute inset-0 z-0"
            onClick={() => setOpen(false)}
          />
          <div className="relative z-10">
            <ZoomableCarousel images={images} initialIndex={index} />
          </div>
        </div>
      )}
    </>
  );
}

