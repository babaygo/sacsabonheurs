"use client";

import { useState } from "react";

export default function ZoomableImage({ src, alt }: { src: string; alt?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <img
        src={src}
        alt={alt}
        className="cursor-zoom-in rounded-md hover:opacity-90 transition"
        onClick={() => setOpen(true)}
      />

      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center"
          onClick={() => setOpen(false)}
        >
          <img
            src={src}
            alt={alt}
            className="max-h-[90vh] max-w-[90vw] cursor-zoom-out rounded-md shadow-xl"
          />
        </div>
      )}
    </>
  );
}
