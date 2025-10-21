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
                    const sorted = data
                        .sort((a: Product, b: Product) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                        .slice(0, 4);
                    setProducts(sorted);
                }
            });
    }, []);

    return (
        <>
            <div className="flex flex-col items-center justify-center">
                <section className="w-full py-20 text-center px-6">
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
                                <Button className="mt-4 py-5 px-6 text-base group flex items-center gap-2 mx-auto">
                                    <span>Explorer la boutique</span>
                                    <MoveRight className="scale-125 transition-transform duration-200 group-hover:translate-x-1 group-hover:scale-150" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>

                <section className="py-20 w-full bg-secondary rounded-full">
                    <div className=" grid grid-cols-1 md:grid-cols-2 gap-12 px-6 items-center">
                        <div className="flex justify-center">
                            <TiltedCard
                                imageSrc="/sac-presentation.png"
                                altText="Sac de présentation"
                                captionText="Sac tubulaire"
                                containerHeight="450px"
                                containerWidth="450px"
                                imageHeight="450px"
                                imageWidth="450px"
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

                        <div className="flex flex-col justify-center text-center md:text-left space-y-6">
                            <h2 className="text-4xl font-bold">Le projet</h2>
                            <p className="text-lg text-justify leading-relaxed pr-6">
                                Bienvenue dans mon univers ! <br /> Je m'appelle Sophie et je suis passionnée de créations artisanales depuis toujours.
                                J'ai commencé la couture en 2013 et je me suis vite spécialisée dans la couture de sacs et accessoires.
                                J'apporte beaucoup d'attention et de soins à mes créations, et j'utilise des matériaux de qualité.
                                Toutes mes créations sont des pièces uniques, dont je créé les patrons. Je vous souhaite une bonne visite !
                            </p>
                            <Link href="/a-propos">
                                <Button className="w-fit px-6 py-3 rounded-full">
                                    À propos de moi
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}
