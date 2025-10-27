"use client";

import PreviewProduct from "@/components/Product/PreviewProduct";
import TextType from "@/components/TextType";
import TiltedCard from "@/components/TiltedCard";
import { Button } from "@/components/ui/button";
import { getBaseUrl } from "@/lib/getBaseUrl";
import { Product } from "@/types/Product";
import { MoveRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";

export default function HomeClient() {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        fetch(`${getBaseUrl()}/api/products`)
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => {
                if (!data) {
                    notFound();
                } else {
                    const sorted = data.filter((product: Product) => !product.hidden)
                        .sort((a: Product, b: Product) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                        .slice(0, 4);
                    setProducts(sorted);
                }
            });
    }, []);

    return (
        <>
            <div className="flex flex-col items-center justify-center">
                <section className="w-full py-20 text-center">
                    <div className="space-y-2">
                        <TextType
                            text={["Bienvenue chez Sacs à Bonheurs"]}
                            typingSpeed={75}
                            pauseDuration={1500}
                            showCursor={false}
                            cursorCharacter="|"
                            textColors={["var(--primary)"]}
                            className="text-4xl font-bold font-serif"
                        />
                        <p className="text-lg">
                            Découvrez mes sacs faits main en France et avec passion !
                        </p>
                        <div className="flex flex-col py-8">
                            <h2 className="text-2xl text-left font-bold p-4">
                                Les dernières créations
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                                {products
                                    .sort(
                                        (a, b) =>
                                            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                                    )
                                    .slice(0, 4)
                                    .map((product) => (
                                        <PreviewProduct key={product.id} product={product} />
                                    ))}
                            </div>

                            <Link href="/boutique">
                                <Button className="rounded-full">
                                    <span>Explorer la boutique</span>
                                    <MoveRight className="scale-125 transition-transform duration-200 group-hover:translate-x-1 group-hover:scale-150" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>

                <section className="px-4 py-10 md:p-20 w-full bg-secondary rounded-3xl md:rounded-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 px-2 md:px-6 items-center">
                        <div className="flex justify-center w-[250px] h-[250px] md:w-[450px] md:h-[450px] pt-6 md:pt-0 mx-auto">
                            <TiltedCard
                                imageSrc="/sac-presentation.png"
                                altText="Sac de présentation"
                                captionText="Sac tubulaire"
                                containerHeight="100%"
                                containerWidth="100%"
                                imageHeight="100%"
                                imageWidth="100%"
                                rotateAmplitude={10}
                                scaleOnHover={1.05}
                                showMobileWarning={false}
                                showTooltip={false}
                                displayOverlayContent={true}
                                overlayContent={
                                    <p className="text-white text-sm bg-black/40 rounded-xl m-5 px-4 py-2 shadow-lg">
                                        Image d'exemple
                                    </p>
                                }
                            />
                        </div>

                        <div className="flex flex-col justify-center justify-items-center md:items-start text-center md:text-left space-y-6">
                            <h2 className="text-4xl font-bold">La boutique</h2>
                            <p className="text-base md:text-lg leading-relaxed text-left md:text-justify pr-0 md:pr-6">
                                Sacs à Bonheurs est une boutique artisanale où tout est confectionné
                                dans mon atelier, en Loire-Atlantique. Chaque sac fabriqué est unique, vous ne trouverez pas deux sacs identiques.
                                En choisissant un sac Sacs à Bonheurs, vous soutenez le savoir-faire local et l'artisanat français.<br />
                                <br />En dehors de la boutique, je vous propose de me retrouver sur des marchés artisanaux et des événements locaux où je présente mes créations.
                                N'hésitez pas à suivre mon compte
                                <a
                                    href="https://www.instagram.com/sacs_a_bonheurs/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-pink-500 transition"
                                >&nbsp;Instagram&nbsp;</a>
                                pour suivre mon actualité et découvrir les coulisses de la fabrication de mes sacs.
                            </p>
                            <Link href="/a-propos">
                                <Button className="rounded-full">
                                    Pour en savoir plus
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}
