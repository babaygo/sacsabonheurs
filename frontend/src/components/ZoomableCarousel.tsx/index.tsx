"use client";

import useEmblaCarousel from "embla-carousel-react";
import { CircleChevronLeft, CircleChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

export default function ZoomableCarousel({
    images,
    initialIndex = 0,
}: {
    images: string[];
    initialIndex?: number;
}) {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
    const [selectedIndex, setSelectedIndex] = useState(initialIndex);

    useEffect(() => {
        if (emblaApi) {
            emblaApi.scrollTo(initialIndex);
            emblaApi.on("select", () => {
                setSelectedIndex(emblaApi.selectedScrollSnap());
            });
        }
    }, [emblaApi, initialIndex]);

    return (
        <div className="relative w-full max-w-3xl mx-auto">
            <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex">
                    {images.map((src, i) => (
                        <div key={i} className="flex-[0_0_100%] flex justify-center">
                            <img
                                src={src}
                                alt={`Image ${i + 1}`}
                                className="max-h-[80vh] max-w-[90vw] object-contain rounded-md"
                            />
                        </div>
                    ))}
                </div>
            </div>

            <button
                className="absolute left-4 top-1/2 text-white text-2xl"
                onClick={() => emblaApi?.scrollPrev()}
            >
                <CircleChevronLeft />
            </button>
            <button
                className="absolute right-4 top-1/2 text-white text-2xl"
                onClick={() => emblaApi?.scrollNext()}
            >
                <CircleChevronRight />
            </button>
        </div>
    );
}
