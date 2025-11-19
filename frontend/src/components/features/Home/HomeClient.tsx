"use client";

import TextType from "@/components/shared/TextType";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/Product";
import { Hammer, Lock, Minus, MoveRight, PackageCheck, Spool } from "lucide-react";
import Link from "next/link";
import PreviewProduct from "../Product/PreviewProduct";
import { useEffect, useState } from "react";
import { useProductsContext } from "@/contexts/ProductsContext";
import { Separator } from "@/components/ui/separator";
import { Carousel, CarouselApi, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

export default function HomeClient({ initialProducts }: { initialProducts: Product[] }) {
    const { products: liveProducts, fetchProducts } = useProductsContext();
    const [products, setProducts] = useState<Product[]>(initialProducts);

    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);
    const [expanded, setExpanded] = useState(false);

    const intro = (
        <>
            Chez Sacs à bonheurs, toutes les créations artisanales, sont imaginées et confectionnées avec passion dans mon atelier à Saint-Nazaire, en Loire-Atlantique.<br />
        </>
    );

    const extended = (
        <>
            <br />
            Chaque sac que je réalise est une pièce unique, née d'un savoir-faire artisanal et d'une attention particulière portée à chaque détail.<br />
            Je sélectionne soigneusement mes matériaux auprès de petits fournisseurs français et européens, privilégiant la qualité, la durabilité et la beauté des textures.<br />
            <br />
            En dehors de la boutique, je vous propose de me retrouver sur des marchés artisanaux et des événements locaux où je présente mes créations.<br />
            <br />
            N'hésitez pas à suivre mon compte &nbsp;
            <Link
                href="https://www.instagram.com/sacs_a_bonheurs/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-pink-500 transition font-bold"
            >Instagram&nbsp;</Link>
            pour suivre mon actualité et découvrir les coulisses de la fabrication de mes sacs.
        </>
    );

    const items = [
        {
            icon: <Lock />,
            title: "Paiements sécurisés",
            text: "Payez par Visa, Mastercard, Apple Pay, Google Pay ou encore Link.",
        },
        {
            icon: <PackageCheck />,
            title: "Livraison",
            text: "Livraison disponible partout en France métropolitaine. En point relais ou en Locker avec Mondial Relay.",
        },
        {
            icon: <Spool />,
            title: "Fabrication artisanale",
            text: "Tous les produits sont fabriqués en Loire-Atlantique. Les matériaux proviennent de France ou d'Europe.",
        },
        {
            icon: <Hammer />,
            title: "Savoir-faire",
            text: "En achetant Sacs à Bonheurs, vous soutenez le savoir-faire local et français.",
        },
    ];

    useEffect(() => {
        fetchProducts(4, true);
    }, [fetchProducts]);

    useEffect(() => {
        if (liveProducts && liveProducts.length > 0) {
            setProducts(liveProducts);
        }
    }, [liveProducts]);

    useEffect(() => {
        if (!api) return;

        setCurrent(api.selectedScrollSnap());
        api.on("select", () => {
            setCurrent(api.selectedScrollSnap());
        });
    }, [api]);

    return (
        <div className="min-h-screen flex flex-col space-y-8">
            <section className="w-screen relative left-1/2 right-1/2 -mx-[50vw] -mt-[var(--header-height)]">
                <div className="sm:hidden">
                    <Image
                        src="/assets/hero_banniere_mobile.webp"
                        alt="Sacs à Bonheurs - Sacs artisanaux faits en France"
                        width={425}
                        height={560}
                        sizes="100vw"
                        className="object-contain object-top w-full h-auto"
                        fetchPriority="high"
                        loading="lazy"
                    />
                </div>

                <div className="hidden sm:block">
                    <Image
                        src="/assets/hero_banniere.webp"
                        alt="Sacs à Bonheurs - Sacs artisanaux faits en France"
                        width={1920}
                        height={1080}
                        sizes="100vw"
                        className="object-cover object-center w-full h-auto"
                        fetchPriority="high"
                        loading="lazy"
                    />

                    <div className="hidden md:flex absolute top-1/4 right-1/4 flex flex-col items-center space-y-4 text-foreground font-semibold">
                        <p className="text-4xl">Le Tweed</p>
                        <p className="text-xl ">Un incontournable de l'hiver</p>
                        <Link href="/boutique" className="px-4 py-2 bg-transparent rounded-none border-2 border-foreground text-xl text-foreground hover:text-foreground hover:bg-accent">
                            Découvrir
                        </Link>
                    </div>
                </div>
            </section>

            <section className="flex flex-col">
                <div className="text-center space-y-2">
                    <TextType
                        text={["Bienvenue chez Sacs à Bonheurs"]}
                        typingSpeed={75}
                        pauseDuration={1500}
                        showCursor={false}
                        cursorCharacter="|"
                        textColors={["var(--primary)"]}
                        className="text-3xl sm:text-4xl font-bold font-serif"
                    />
                    <p className="text-base sm:text-lg text-center">
                        Découvrez ma collection de sacs artisanaux, faits en France !
                    </p>
                </div>
                <div className="flex flex-col items-center py-8">
                    <h2 className="text-xl text-center font-semibold capitalize py-1">
                        Les nouvelles créations
                    </h2>
                    <Minus />

                    <div className="w-full">
                        <div className="hidden md:grid grid-cols-4 gap-6">
                            {products
                                .sort((a: Product, b: Product) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                                .slice(0, 4)
                                .map((product) => (
                                    <PreviewProduct key={product.id} product={product} />
                                ))}
                        </div>

                        <div className="md:hidden">
                            <Carousel opts={{ align: "center", loop: true, watchDrag: false }} setApi={setApi}>
                                <CarouselContent className="m-0">
                                    {products
                                        .sort((a: Product, b: Product) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                                        .slice(0, 4)
                                        .map((product) => (
                                            <CarouselItem key={product.id} className="basis-full px-6">
                                                <PreviewProduct product={product} />
                                            </CarouselItem>
                                        ))}
                                </CarouselContent>

                                <CarouselPrevious size={"icon-lg"} variant={"link"} className="absolute -left-2 top-1/2" />
                                <CarouselNext size={"icon-lg"} variant={"link"} className="absolute -right-2 top-1/2" />
                            </Carousel>
                        </div>
                    </div>

                    <Link href="/boutique">
                        <Button className="rounded-full">
                            Explorer la boutique
                            <MoveRight className="scale-125" />
                        </Button>
                    </Link>
                </div>
            </section>

            <section className="p-4 flex flex-col items-center bg-secondary rounded-lg">
                <h2 className="font-semibold capitalize text-xl mb-4">la boutique</h2>

                <p className="text-base text-center leading-relaxed pr-0 md:pr-6">
                    {intro}
                </p>

                <div className={`overflow-hidden transition-all duration-500 ease-in-out ${expanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"}`} >
                    <p className="text-base text-center leading-relaxed pr-0 md:pr-6">
                        {extended}
                    </p>
                </div>

                <Button variant="link" onClick={() => setExpanded(!expanded)} className="mt-4 underline">
                    {expanded ? "Voir moins" : "Voir plus"}
                </Button>
            </section>

            <section className="w-full">
                <Separator />

                <div className="block sm:hidden py-6">
                    <Carousel opts={{ align: "center", loop: true }} setApi={setApi}>
                        <CarouselContent className="m-0">
                            {items.map((item, i) => (
                                <CarouselItem key={i} className="basis-full flex flex-col items-center text-center space-y-2 px-6">
                                    {item.icon}
                                    <h4 className="font-semibold">{item.title}</h4>
                                    <p className="text-sm text-muted-foreground">{item.text}</p>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                    </Carousel>
                    <div className="flex justify-center mt-2">
                        <div className="flex gap-2 px-3 py-2 bg-gray-200/60 backdrop-blur-md rounded-full">
                            {items?.map((_, i) => (
                                <span
                                    key={i}
                                    className={`w-2 h-2 rounded-full transition ${i === current ? "bg-primary" : "bg-gray-300"}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="hidden sm:flex space-x-8">
                    {items.map((item, i) => (
                        <div key={i} className="flex flex-col items-center text-center py-4 space-y-2 flex-1">
                            {item.icon}
                            <h4 className="font-semibold">{item.title}</h4>
                            <p className="text-sm text-muted-foreground">{item.text}</p>
                            {i < items.length - 1 && (
                                <Separator orientation="vertical" className="hidden sm:block data-[orientation=vertical]:h-auto" />
                            )}
                        </div>
                    ))}
                </div>

                <Separator />
            </section>
        </div>
    );
}
