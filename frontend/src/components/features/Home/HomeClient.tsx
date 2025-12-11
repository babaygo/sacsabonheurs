"use client";

import TextType from "@/components/shared/TextType";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/Product";
import { ArrowRight, Hammer, Heart, Lock, MapPin, PackageCheck, Spool } from "lucide-react";
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
            Chaque sac que je réalise est une pièce unique, née d'un savoir-faire artisanal et d'une attention particulière portée à chaque détail.<br />
            Je sélectionne soigneusement mes matériaux auprès de petits fournisseurs français et européens, privilégiant la qualité, la durabilité et la beauté des textures.<br />
            <br />
            En dehors de la boutique, je vous propose de me retrouver sur des marchés artisanaux et des événements locaux où je présente mes créations.<br />
            <br />
            N'hésitez pas à suivre mon compte&nbsp;
            <Link
                href="https://www.instagram.com/sacs_a_bonheurs/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-pink-500 transition font-bold"
            >Instagram&nbsp;</Link>
            pour suivre mon actualité et découvrir les coulisses de la fabrication de mes sacs.<br />
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

    const collections = [
        {
            title: "Le Liège",
            subtitle: "Naturel & Vegan",
            image: "/assets/liege.webp"
        },
        {
            title: "Le Jacquard",
            subtitle: "Élégance Tissée",
            image: "/assets/jacquard.webp"
        },
        {
            title: "La Suédine",
            subtitle: "Douceur & Caractère",
            image: "/assets/suedine.webp"
        }
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
        <div className="min-h-screen flex flex-col">
            <section className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center py-10 sm:py-14 lg:py-18">
                <div className="flex flex-col space-y-6 lg:space-y-8 w-full lg:w-1/2 order-1">
                    <span className="hidden lg:flex items-center gap-4 text-sm sm:text-base font-medium text-primary">
                        <Separator className="w-8!" /> MADE IN FRANCE
                    </span>

                    <div className="space-y-4 text-center lg:text-left ">
                        <TextType
                            text={["Bienvenue chez\nSacs à Bonheurs"]}
                            typingSpeed={75}
                            pauseDuration={3000}
                            showCursor={false}
                            cursorCharacter="|"
                            textColors={["var(--primary)"]}
                            className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif"
                        />
                        <p className="text-base sm:text-lg lg:text-xl text-muted-foreground">
                            Découvrez ma collection de sacs artisanaux, <br />imaginés et confectionnés, avec passion dans mon atelier.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                        <Link href="/boutique">
                            <Button size="lg" className="w-full sm:w-auto">Découvrir la boutique</Button>
                        </Link>
                        <Link href="/a-propos">
                            <Button size="lg" variant="outline" className="w-full sm:w-auto">L'Atelier</Button>
                        </Link>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 justify-center lg:justify-start text-sm">
                        <span className="flex items-center gap-2 justify-center lg:justify-start">
                            <MapPin className="w-4 h-4 text-primary" /> Saint-Nazaire
                        </span>
                        <span className="flex items-center gap-2 justify-center lg:justify-start">
                            <Heart className="w-4 h-4 text-primary" /> Fait main
                        </span>
                    </div>
                </div>

                <div className="relative aspect-[4/5] sm:aspect-[3/4] lg:aspect-[4/5] w-full sm:max-w-md lg:max-w-none lg:w-1/2 lg:h-[70vh] animate-fade-in-right order-2">
                    <div className="absolute inset-0 rounded-t-[10rem] rounded-b-2xl overflow-hidden shadow-2xl">
                        <Image
                            src="/assets/hero_image.webp"
                            alt="Sacs à Bonheurs - Sacs artisanaux faits en France"
                            width={1797}
                            height={2061}
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 50vw"
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000 ease-out"
                            fetchPriority="high"
                            loading="lazy"
                        />
                    </div>

                    <div className="absolute bottom-4 left-4 sm:bottom-8 sm:-left-8 bg-background p-4 sm:p-6 shadow-xl max-w-[180px] sm:max-w-[200px] border-l-4 border-primary">
                        <p className="font-playfair-display font-bold text-lg sm:text-xl text-primary mb-1">100%</p>
                        <p className="text-xs sm:text-sm text-muted-foreground leading-tight"> Des matériaux français et européens</p>
                    </div>
                </div>
            </section>

            <section className="py-10 sm:py-14 lg:py-18">
                <div className="flex flex-col items-center space-y-2 mb-10 sm:mb-14">
                    <span className="text-primary font-medium tracking-widest text-xs uppercase">
                        COLLECTIONS
                    </span>
                    <h2 className="font-playfair-display font-semibold text-2xl sm:text-3xl lg:text-4xl text-center">
                        Mes Univers
                    </h2>
                </div>

                <div className="hidden md:grid grid-cols-3 gap-6 md:gap-8">
                    {collections.map((collection, idx) => (
                        <div
                            key={idx}
                            className="group"
                        >
                            <div className="relative aspect-[3/4] overflow-hidden mb-4 sm:mb-6 rounded-lg">
                                <Image
                                    src={collection.image}
                                    alt={collection.title}
                                    width={832}
                                    height={1248}
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    fetchPriority="auto"
                                    loading="lazy"
                                />
                            </div>

                            <div className="text-center transition-transform duration-500 group-hover:-translate-y-3">
                                <h3 className="text-xl sm:text-2xl font-playfair-display font-bold mb-1 text-black group-hover:text-primary transition-colors duration-500">
                                    {collection.title}
                                </h3>
                                <p className="text-sm sm:text-base text-muted-foreground font-light italic">
                                    {collection.subtitle}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="md:hidden">
                    <Carousel opts={{
                        align: "center",
                        loop: true
                    }}
                    >
                        <CarouselContent className="m-0">
                            {collections.map((collection, idx) => (
                                <CarouselItem key={idx} className="basis-8/9 px-2">
                                    <div className="relative aspect-[3/4] overflow-hidden mb-4 rounded-lg">
                                        <Image
                                            src={collection.image}
                                            alt={collection.title}
                                            width={832}
                                            height={1248}
                                            sizes="100vw"
                                            className="w-full h-full object-cover"
                                            fetchPriority="auto"
                                            loading="lazy"
                                        />
                                    </div>

                                    <div className="text-center">
                                        <h3 className="text-xl font-playfair-display font-bold mb-1 text-primary">
                                            {collection.title}
                                        </h3>
                                        <p className="text-sm text-muted-foreground font-light italic">
                                            {collection.subtitle}
                                        </p>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                    </Carousel>
                </div>
            </section>

            <section className="flex flex-col items-center py-10 sm:py-14 lg:py-18">
                <div className="w-full flex flex-col items-start sm:flex-row sm:justify-between sm:items-end mb-8 sm:mb-10">
                    <div className="flex flex-col items-start space-y-2">
                        <h2 className="font-playfair-display font-semibold text-2xl sm:text-3xl lg:text-4xl">
                            Nouveautés
                        </h2>
                        <span className="text-sm sm:text-base font-light text-mute-foreground">
                            Pièces uniques fraîchements sorties de l'atelier.
                        </span>
                    </div>
                    <div className="pt-4 sm:pt-0">
                        <Link href="/boutique" className="flex items-center">
                            Voir toute la collection
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>


                <div className="w-full">
                    <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
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
            </section>

            <section className="flex text-center sm:text-start sm:justify-between py-10 sm:py-14 lg:py-18">
                <div className="w-full hidden sm:block">
                    <Link href="https://crealouest.fr/" target="_blank" rel="noopener noreferrer" className="hidden sm:flex justify-center">
                        <iframe
                            id="border"
                            title="rejoindre crealOuest"
                            width="315"
                            height="315"
                            src="https://crealouest.fr/widgets/rejoignez_crealouest_ft_clair.html"
                            className="pointer-events-none"
                        />
                    </Link>
                </div>
                <div className="w-full space-y-6">
                    <h2 className="font-playfair-display font-semibold text-2xl sm:text-3xl lg:text-4xl">La Boutique</h2>

                    <p className="text-base text-justify leading-relaxed pr-0 md:pr-6">
                        {intro}
                    </p>

                    <div className={`overflow-hidden transition-all duration-500 ease-in-out m-0 ${expanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"}`} >
                        <p className="text-base text-justify leading-relaxed pr-0 md:pr-6">
                            {extended}
                        </p>
                    </div>

                    <Button variant="link" onClick={() => setExpanded(!expanded)} className="mt-1 p-0 underline">
                        {expanded ? "Voir moins" : "Voir plus"}
                    </Button>
                </div>
            </section>

            <section className="w-full">
                <Separator />

                <div className="block sm:hidden py-6">
                    <Carousel opts={{ align: "center", loop: true }} setApi={setApi}>
                        <CarouselContent className="m-0">
                            {items.map((item, i) => (
                                <CarouselItem key={i} className="basis-full flex flex-col justify-center items-center text-center space-y-2 px-6">
                                    {item.icon}
                                    <h4 className="font-semibold">{item.title}</h4>
                                    <p className="text-sm text-muted-foreground">{item.text}</p>
                                </CarouselItem>
                            ))}
                            <CarouselItem className="basis-full flex justify-center items-center">
                                <Link href="https://crealouest.fr/" target="_blank" rel="noopener noreferrer">
                                    <iframe
                                        id="border"
                                        title="rejoindre crealOuest"
                                        width="315"
                                        height="315"
                                        src="https://crealouest.fr/widgets/rejoignez_crealouest_ft_clair.html"
                                        className="pointer-events-none"
                                    />
                                </Link>
                            </CarouselItem>
                        </CarouselContent>
                    </Carousel>
                    <div className="flex justify-center mt-2">
                        <div className="flex gap-2 px-3 py-2 bg-gray-200/60 backdrop-blur-md rounded-full">
                            {Array.from({ length: items.length + 1 }).map((_, i) => (
                                <span
                                    key={i}
                                    className={`w-2 h-2 rounded-full transition ${i === current ? "bg-primary" : "bg-gray-300"
                                        }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="hidden sm:flex space-x-8 items-center">
                    {items.map((item, i) => (
                        <div key={i} className="flex flex-col items-center text-center py-4 space-y-2 flex-1">
                            {item.icon}
                            <h4 className="font-semibold">{item.title}</h4>
                            <p className="text-sm text-muted-foreground">{item.text}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
