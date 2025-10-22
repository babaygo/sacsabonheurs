"use client";

import useEmblaCarousel from "embla-carousel-react";
import { CircleChevronLeft, CircleChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

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
            <Button
                className="bg-transparent hover:bg-transparent"
                onClick={(e) => {
                    e.stopPropagation();
                    emblaApi?.scrollPrev();
                }}
            >
                <CircleChevronLeft className="size-5" />
            </Button>
            <div className="w-full overflow-hidden " ref={emblaRef}>
                <div className="w-full flex">
                    {images.map((src, i) => (
                        <div key={i} className="w-full flex-[0_0_100%] flex justify-center">
                            <img
                                src={src}
                                alt={`Image ${i + 1}`}
                                className="max-h-[80vh] object-contain rounded-md"
                            />
                        </div>
                    ))}
                </div>
            </div>
            <Button
                className="bg-transparent hover:bg-transparent"
                onClick={(e) => {
                    e.stopPropagation();
                    emblaApi?.scrollNext();
                }}
            >
                <CircleChevronRight className="size-5" />
            </Button>
        </div>

    );
}
