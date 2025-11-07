"use client";

import TextType from "@/components/shared/TextType";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/Product";
import { MoveRight } from "lucide-react";
import Link from "next/link";
import PreviewProduct from "../Product/PreviewProduct";
import { useEffect, useState } from "react";
import { useProductsContext } from "@/contexts/ProductsContext";

export default function HomeClient({ initialProducts }: { initialProducts: Product[] }) {
    const { products: liveProducts } = useProductsContext();
    const [products, setProducts] = useState<Product[]>(initialProducts);
    const productsFilters = products.filter((product: Product) => !product.hidden);

    useEffect(() => {
        if (liveProducts) setProducts(liveProducts);
    }, [liveProducts]);

    return (
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
                            {productsFilters
                                .sort((a: Product, b: Product) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
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

            <section className="w-full p-10 md:p-20 bg-secondary rounded-4xl xl:rounded-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
                    <div className="hidden md:flex flex justify-center">
                        <div className="relative w-full aspect-square max-w-[450px] rounded-[15px] overflow-hidden">
                            <Image
                                src="/sac-presentation.png"
                                alt="Image de présentation"
                                fill
                                className="object-cover w-full h-auto block"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                priority
                            />

                            <div className="absolute inset-0 flex items-start justify-start">
                                <p className="text-white text-sm bg-black/40 rounded-xl m-5 px-4 py-2 shadow-lg">
                                    Sac à main pour femme
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col justify-center justify-items-center md:items-start text-center md:text-left space-y-6">
                        <h2 className="text-4xl capitalize font-bold">La boutique</h2>
                        <p className="text-base text-justify md:text-lg leading-relaxed md:text-justify pr-0 md:pr-6">
                            Chez Sacs à bonheurs, toutes les créations artisanales, sont imaginées et confectionnées avec passion dans mon atelier à Saint-Nazaire, en Loire-Atlantique.<br />
                            Chaque sac que je réalise est une pièce unique, née d'un savoir-faire artisanal et d'une attention particulière portée à chaque détail.<br />
                            Je sélectionne soigneusement mes matériaux auprès de petits fournisseurs français et européens, privilégiant la qualité, la durabilité et la beauté des textures.<br />
                            <br />
                            En dehors de la boutique, je vous propose de me retrouver sur des marchés artisanaux et des événements locaux où je présente mes créations.<br />
                            N'hésitez pas à suivre mon compte
                            <Link
                                href="https://www.instagram.com/sacs_a_bonheurs/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-pink-500 transition font-bold"
                            >&nbsp;Instagram&nbsp;</Link>
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
    );
}
