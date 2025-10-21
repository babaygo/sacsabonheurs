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

        <div className="relative w-full flex items-center max-w-3xl mx-auto">
            {/* Chevron gauche */}
            <button
                className="px-4 text-white text-3xl"
                onClick={(e) => {
                    e.stopPropagation();
                    emblaApi?.scrollPrev();
                }}
            >
                <CircleChevronLeft />
            </button>
            {/* Zone scrollable */}
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
            {/* Chevron droite */}
            <button
                className="px-4 text-white text-3xl"
                onClick={(e) => {
                    e.stopPropagation();
                    emblaApi?.scrollNext();
                }}
            >
                <CircleChevronRight />
            </button>
        </div>

    );
}
