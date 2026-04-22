"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/Product";
import {
    ArrowRight,
    ChevronRight,
    Hammer,
    Heart,
    Lock,
    MapPin,
    MoveRight,
    PackageCheck,
    Quote,
    Spool,
} from "lucide-react";
import Link from "next/link";
import PreviewProduct from "../Product/PreviewProduct";
import { useCallback, useEffect, useState } from "react";
import { useProductsContext } from "@/contexts/ProductsContext";
import {
    Carousel,
    CarouselApi,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { getArticles } from "@/lib/api/article";
import { Article } from "@/types/Article";
import { Separator } from "@/components/ui/separator";


function useReveal<T extends HTMLElement = HTMLDivElement>(threshold = 0.15) {
    const [visible, setVisible] = useState(false);
    const [node, setNode] = useState<T | null>(null);

    const ref = useCallback((el: T | null) => {
        setNode(el);
    }, []);

    useEffect(() => {
        if (!node || visible) return;
        const obs = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    obs.disconnect();
                }
            },
            { threshold }
        );
        obs.observe(node);
        return () => obs.disconnect();
    }, [node, threshold, visible]);

    return { ref, visible };
}

export default function HomeClient({
    initialProducts,
}: {
    initialProducts: Product[];
}) {
    const { products: liveProducts, fetchProducts } = useProductsContext();
    const [products, setProducts] = useState<Product[]>(initialProducts);

    const [carouselApi, setCarouselApi] = useState<CarouselApi>();
    const [expanded, setExpanded] = useState(false);
    const [blogPosts, setBlogPosts] = useState<Article[]>([]);

    const [heroH, setHeroH] = useState<string>("100svh");
    useEffect(() => {
        setHeroH(`${window.innerHeight}px`);
    }, []);

    const collectionsReveal = useReveal();
    const productsReveal = useReveal();
    const aboutReveal = useReveal();
    const blogReveal = useReveal();
    const trustReveal = useReveal();

    const trustItems = [
        {
            icon: <Lock className="w-6 h-6" />,
            title: "Paiements sécurisés",
            text: "Visa, Mastercard, Apple Pay, Google Pay et Link.",
        },
        {
            icon: <PackageCheck className="w-6 h-6" />,
            title: "Livraison en France",
            text: "En point relais ou Locker Mondial Relay.",
        },
        {
            icon: <Spool className="w-6 h-6" />,
            title: "Fabrication artisanale",
            text: "Matériaux français et européens.",
        },
        {
            icon: <Hammer className="w-6 h-6" />,
            title: "Savoir-faire local",
            text: "Soutenez l'artisanat français.",
        },
    ];

    const collections = [
        {
            title: "Le Liège",
            subtitle: "Naturel & Vegan",
            image: "/assets/liege.webp",
        },
        {
            title: "Le Jacquard",
            subtitle: "Élégance Tissée",
            image: "/assets/jacquard.webp",
        },
        {
            title: "La Suédine",
            subtitle: "Douceur & Caractère",
            image: "/assets/suedine.webp",
        },
    ];

    useEffect(() => {
        fetchProducts(4, true);
    }, [fetchProducts]);

    useEffect(() => {
        let isMounted = true;
        const loadArticles = async () => {
            const { data } = await getArticles(1, 4);
            if (isMounted) setBlogPosts(data);
        };
        loadArticles();
        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        if (liveProducts && liveProducts.length > 0) setProducts(liveProducts);
    }, [liveProducts]);

    const sortedProducts = [...products]
        .sort(
            (a, b) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, 4);

    return (
        <div className="min-h-screen flex flex-col">
            <section
                className="relative flex flex-col lg:flex-row items-center gap-8 lg:gap-16 lg:py-20 -mt-6 lg:mt-0 lg:!min-h-0"
                style={{ minHeight: `calc(${heroH} - var(--header-height))` }}
            >
                <div className="lg:hidden absolute inset-0 -mx-[var(--container-padding,1rem)] -mt-6 overflow-hidden">
                    <Image
                        src="/assets/hero_image.webp"
                        alt="Hero image"
                        fill
                        sizes="100vw"
                        className="object-cover object-center"
                        priority
                        aria-hidden="true"
                    />
                </div>

                <div
                    className="relative flex flex-col lg:space-y-8 w-full lg:w-1/2 order-1 z-10 lg:py-0 lg:!min-h-0 justify-between py-8 md:py-12"
                    style={{ minHeight: `calc(${heroH} - var(--header-height))` }}
                >
                    <div className="space-y-5 text-center lg:text-left">
                        <span className="hidden lg:flex items-center gap-4 text-sm sm:text-base font-medium text-primary uppercase tracking-widest">
                            <Separator className="w-8!" /> MADE IN FRANCE
                        </span>
                        <h1 className="text-4xl font-semibold sm:text-5xl lg:text-6xl leading-tight">
                            Bienvenue chez
                            <br />
                            Sacs à Bonheurs
                        </h1>
                        <p className="hidden lg:flex text-body-lg text-muted-foreground max-w-lg mx-auto lg:mx-0">
                            Des sacs artisanaux imaginés et confectionnés
                            avec passion, dans mon atelier en Loire-Atlantique.
                        </p>
                    </div>

                    <div className="flex-1 lg:hidden" />

                    <div className="space-y-6">
                        <div className="flex flex-row gap-3 md:gap-4 justify-center lg:justify-start">
                            <Link href="/boutique" className="w-full sm:w-auto">
                                <Button
                                    size="lg"
                                    className="w-full px-4 sm:px-6 py-3 text-sm sm:text-base font-semibold"
                                >
                                    Découvrir la boutique
                                </Button>
                            </Link>
                            <Link href="/a-propos" className="w-full sm:w-auto">
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="w-full px-4 sm:px-6 py-3 text-sm sm:text-base font-semibold"
                                >
                                    L'Atelier
                                </Button>
                            </Link>
                        </div>

                        <div className="flex flex-wrap gap-4 md:gap-6 justify-center lg:justify-start text-caption text-muted-foreground">
                            <span className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-primary" /> Saint-Nazaire
                            </span>
                            <span className="flex items-center gap-2">
                                <Heart className="w-4 h-4 text-primary" /> Fait main
                            </span>
                            <span className="flex items-center gap-2">
                                <Spool className="w-4 h-4 text-primary" /> Pièces uniques
                            </span>
                        </div>
                    </div>
                </div>

                <div className="relative hidden lg:block lg:w-1/2 order-2">
                    <div className="relative w-full lg:h-[calc(100vh-var(--header-height)-10rem)] rounded-[3rem] overflow-hidden shadow-2xl animate-fade-in-right">
                        <Image
                            src="/assets/hero_image.webp"
                            alt="Sacs à Bonheurs - Sacs artisanaux faits en France"
                            fill
                            sizes="50vw"
                            className="object-cover hover:scale-105 transition-transform duration-1000 ease-out"
                            priority
                        />

                        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
                    </div>

                    <div className="absolute -bottom-5 left-8 bg-background rounded-2xl p-5 shadow-xl border border-border/50 backdrop-blur-sm">
                        <p className="font-playfair-display font-bold text-2xl md:text-3xl text-primary">
                            100%
                        </p>
                        <p className="text-sm text-muted-foreground leading-tight mt-0.5">
                            Matériaux français
                            <br />& européens
                        </p>
                    </div>
                </div>
            </section>

            <section
                ref={collectionsReveal.ref}
                className={`section-padding transition-all duration-700 ${collectionsReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            >
                <div className="flex flex-col items-center space-y-2 mb-10 md:mb-14">
                    <span className="section-label">
                        Collections
                    </span>
                    <h2 className="text-center">
                        Mes Univers
                    </h2>
                    <p className="text-muted-foreground text-body max-w-md text-center">
                        Trois matières d'exception pour des créations uniques.
                    </p>
                </div>

                <div className="hidden md:grid grid-cols-3 gap-6 lg:gap-8">
                    {collections.map((collection, idx) => (
                        <Link
                            key={idx}
                            href="/boutique"
                            className="group relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer"
                        >
                            <Image
                                src={collection.image}
                                alt={collection.title}
                                width={832}
                                height={1248}
                                sizes="(max-width: 1024px) 50vw, 33vw"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 overlay-gradient transition-opacity duration-500" />

                            <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 transition-transform duration-500 group-hover:-translate-y-2">
                                <h3 className="text-white mb-1">
                                    {collection.title}
                                </h3>
                                <p className="text-body text-white/80 font-light italic">
                                    {collection.subtitle}
                                </p>
                                <span className="inline-flex items-center gap-1 mt-3 text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                    Découvrir <ChevronRight className="w-4 h-4" />
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="md:hidden">
                    <Carousel opts={{ align: "center", loop: true }}>
                        <CarouselContent className="m-0">
                            {collections.map((collection, idx) => (
                                <CarouselItem key={idx} className="basis-[85%] px-2">
                                    <Link
                                        href="/boutique"
                                        className="relative aspect-[3/4] block rounded-2xl overflow-hidden"
                                    >
                                        <Image
                                            src={collection.image}
                                            alt={collection.title}
                                            sizes="85vw"
                                            fill
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                        />
                                        <div className="absolute inset-0 overlay-gradient" />
                                        <div className="absolute inset-x-0 bottom-0 p-5">
                                            <h3 className="text-lg font-playfair-display font-bold text-white mb-0.5">
                                                {collection.title}
                                            </h3>
                                            <p className="text-sm text-white/80 font-light italic">
                                                {collection.subtitle}
                                            </p>
                                        </div>
                                    </Link>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                    </Carousel>
                </div>
            </section>

            <section
                ref={productsReveal.ref}
                className={`section-padding transition-all duration-700 ${productsReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            >
                {/* header */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 section-header-mb">
                    <div className="space-y-2">
                        <span className="section-label">
                            Nouveautés
                        </span>
                        <h2>
                            Fraîchement sorties de l'atelier
                        </h2>
                        <p className="text-body text-muted-foreground">
                            Chaque pièce est unique — une fois vendue, elle ne sera pas reproduite.
                        </p>
                    </div>
                    <Link
                        href="/boutique"
                        className="link-section"
                    >
                        Toute la collection
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {sortedProducts.map((product) => (
                        <PreviewProduct key={product.id} product={product} />
                    ))}
                </div>

                <div className="md:hidden">
                    <Carousel
                        opts={{ align: "center", loop: true, watchDrag: false }}
                        setApi={setCarouselApi}
                    >
                        <CarouselContent className="m-0">
                            {sortedProducts.map((product) => (
                                <CarouselItem
                                    key={product.id}
                                    className="basis-full px-6"
                                >
                                    <PreviewProduct product={product} />
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious
                            size="icon-lg"
                            variant="link"
                            className="absolute -left-2 top-1/2"
                        />
                        <CarouselNext
                            size="icon-lg"
                            variant="link"
                            className="absolute -right-2 top-1/2"
                        />
                    </Carousel>
                </div>
            </section>

            <section
                ref={aboutReveal.ref}
                className={`section-padding transition-all duration-700 ${aboutReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            >
                <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
                    <div className="w-full lg:w-1/2 space-y-6">
                        <span className="section-label">
                            L'artisane
                        </span>
                        <h2>
                            La Boutique
                        </h2>

                        <div className="relative pl-6">
                            <Quote className="absolute -left-1 -top-2 w-6 h-6 text-primary/30" />
                            <p className="text-body-lg italic text-muted-foreground leading-relaxed">
                                Chaque sac que je réalise est une pièce unique, née d'un
                                savoir-faire artisanal et d'une attention particulière
                                portée à chaque détail.
                            </p>
                        </div>

                        <p className="text-body leading-relaxed">
                            Chez Sacs à bonheurs, toutes les créations artisanales sont
                            imaginées et confectionnées avec passion dans mon atelier à
                            Saint-Nazaire, en Loire-Atlantique.
                        </p>

                        <div
                            className={`overflow-hidden transition-all duration-500 ease-in-out ${expanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"}`}
                        >
                            <div className="space-y-4 text-body leading-relaxed">
                                <p>
                                    Je sélectionne soigneusement mes matériaux auprès de
                                    petits fournisseurs français et européens, privilégiant
                                    la qualité, la durabilité et la beauté des textures.
                                </p>
                                <p>
                                    En dehors de la boutique, je vous propose de me
                                    retrouver sur des marchés artisanaux et des événements
                                    locaux où je présente mes créations.
                                </p>
                                <p>
                                    N'hésitez pas à suivre mon compte{" "}
                                    <Link
                                        href="https://www.instagram.com/sacs_a_bonheurs/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:text-pink-500 transition font-bold"
                                    >
                                        Instagram
                                    </Link>{" "}
                                    pour suivre mon actualité et découvrir les coulisses de
                                    la fabrication de mes sacs.
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={() => setExpanded(!expanded)}
                            className="text-sm font-semibold text-primary underline underline-offset-4 hover:text-accent transition-colors"
                        >
                            {expanded ? "Voir moins" : "En savoir plus"}
                        </button>

                        <div className="flex gap-3 pt-2">
                            <Link href="/a-propos">
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="btn-cta border-2 font-medium"
                                >
                                    Découvrir l'atelier
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <div className="w-full lg:w-1/2 hidden sm:flex flex-row justify-center items-center gap-8">
                        <Link
                            href="https://crealouest.fr/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Image
                                src="/assets/logo-crealouest.png"
                                alt="CréaLOuest - Réseau de créateurs en Pays de la Loire"
                                width={250}
                                height={100}
                                loading="lazy"
                                className="object-contain hover:opacity-80 transition-opacity"
                            />
                        </Link>
                        <Link
                            href="https://marche-des-createurs.fr/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Image
                                src="/assets/logo-marche-des-createurs.png"
                                alt="Le Marché des Créateurs"
                                width={250}
                                height={100}
                                loading="lazy"
                                className="object-contain hover:opacity-80 transition-opacity"
                            />
                        </Link>
                    </div>
                </div>
            </section>

            {blogPosts.length > 0 && (
                <section
                    ref={blogReveal.ref}
                    className={`section-padding transition-all duration-700 ${blogReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                >
                    {/* header */}
                    <div className="flex justify-between items-end gap-6 section-header-mb">
                        <div className="space-y-2">
                            <span className="section-label">
                                Journal
                            </span>
                            <h2>
                                Mon Blog
                            </h2>
                        </div>
                        <Link
                            href="/blog"
                            className="link-section"
                        >
                            Tous les articles
                            <MoveRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                        <Link
                            href={`/blog/${blogPosts[0].slug}`}
                            className="lg:col-span-2 group relative rounded-2xl overflow-hidden bg-background border border-border/60 hover:shadow-lg transition-shadow duration-300"
                        >
                            <div className="relative w-full aspect-[16/9] overflow-hidden">
                                {blogPosts[0].image ? (
                                    <Image
                                        src={blogPosts[0].image}
                                        alt={blogPosts[0].title}
                                        fill
                                        sizes="(max-width: 1024px) 100vw, 66vw"
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        loading="lazy"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-secondary" />
                                )}
                                <div className="absolute top-4 left-4">
                                    <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                                        À la une
                                    </span>
                                </div>
                            </div>

                            <div className="p-5 md:p-6 lg:p-8">
                                <h3 className="mb-2 group-hover:text-primary transition-colors">
                                    {blogPosts[0].title}
                                </h3>
                                <p className="text-muted-foreground text-body line-clamp-2">
                                    {blogPosts[0].excerpt}
                                </p>
                                <span className="inline-flex items-center gap-1 mt-4 text-primary text-sm font-semibold">
                                    Lire l'article
                                    <MoveRight className="w-4 h-4" />
                                </span>
                            </div>
                        </Link>

                        {blogPosts.length >= 2 && (
                            <div className="flex flex-col gap-4">
                                <h3 className="font-playfair-display font-semibold text-base md:text-lg">
                                    Plus d'articles
                                </h3>
                                {blogPosts.slice(1, 4).map((post) => (
                                    <Link
                                        key={post.slug}
                                        href={`/blog/${post.slug}`}
                                        className="group flex gap-4 items-center p-3 rounded-xl border border-border/60 bg-background hover:shadow-md transition-shadow duration-300"
                                    >
                                        <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden bg-secondary shrink-0">
                                            {post.image ? (
                                                <Image
                                                    src={post.image}
                                                    alt={post.title}
                                                    fill
                                                    sizes="96px"
                                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                    loading="lazy"
                                                />
                                            ) : (
                                                <div className="w-full h-full" />
                                            )}
                                        </div>
                                        <div className="flex flex-col min-w-0">
                                            <h4 className="font-semibold text-body leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                                                {post.title}
                                            </h4>
                                            <span className="text-xs text-muted-foreground mt-1.5">
                                                {new Date(
                                                    post.createdAt
                                                ).toLocaleDateString("fr-FR", {
                                                    day: "2-digit",
                                                    month: "long",
                                                    year: "numeric",
                                                })}
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            )}

            <section
                ref={trustReveal.ref}
                className={`hidden sm:flex py-8 md:py-10 transition-all duration-700 ${trustReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
            >
                <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {trustItems.map((item, i) => (
                        <div
                            key={i}
                            className="flex flex-col items-center text-center p-4 md:p-6 rounded-2xl bg-secondary/40 hover:bg-secondary/70 transition-colors duration-300"
                        >
                            <div className="trust-icon w-12 h-12 mb-3">
                                {item.icon}
                            </div>
                            <h4 className="font-semibold text-body mb-1">
                                {item.title}
                            </h4>
                            <p className="text-caption text-muted-foreground leading-snug">
                                {item.text}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="sm:hidden py-8 space-y-8">
                <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-none px-1">
                    {trustItems.map((item, i) => (
                        <div
                            key={i}
                            className="flex items-center gap-3 min-w-[260px] snap-center p-4 rounded-2xl bg-secondary/40 border border-border/40"
                        >
                            <div className="trust-icon w-10 h-10 shrink-0">
                                {item.icon}
                            </div>
                            <div>
                                <h4 className="font-semibold text-sm leading-tight">
                                    {item.title}
                                </h4>
                                <p className="text-xs text-muted-foreground leading-snug mt-0.5">
                                    {item.text}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="sm:hidden py-8 flex justify-center">
                <div className="flex flex-col items-center gap-6">
                    <h2>Partenaires</h2>
                    <Link
                        href="https://crealouest.fr/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Image
                            src="/assets/logo-crealouest.png"
                            alt="CréaLOuest - Réseau de créateurs en Pays de la Loire"
                            width={250}
                            height={100}
                            loading="lazy"
                            className="object-contain hover:opacity-80 transition-opacity"
                        />
                    </Link>
                    <Link
                        href="https://marche-des-createurs.fr/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Image
                            src="/assets/logo-marche-des-createurs.png"
                            alt="Le Marché des Créateurs"
                            width={250}
                            height={100}
                            loading="lazy"
                            className="object-contain hover:opacity-80 transition-opacity"
                        />
                    </Link>
                </div>
            </section>
        </div>
    );
}
