"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import BreadCrumb from "@/components/shared/BreadCrumb";
import PreviewProduct from "@/components/features/Product/PreviewProduct";
import { Collection } from "@/types/Collection";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

interface CollectionClientProps {
    collection: Collection;
}

export default function CollectionClient({
    collection,
}: CollectionClientProps) {
    const collectionProducts = collection.products ?? [];

    return (
        <div className="min-h-screen pt-4">
            <BreadCrumb
                items={[
                    { label: "Accueil", href: "/" },
                    { label: "Collections", href: "/collections" },
                    { label: collection.title },
                ]}
            />

            <section className="relative overflow-hidden rounded-2xl md:rounded-3xl mb-12 md:mb-16 aspect-[4/3] sm:aspect-[16/9] md:aspect-[16/7]">
                {collection.heroImage && (
                    <Image
                        src={collection.heroImage}
                        alt={collection.title}
                        fill
                        priority
                        sizes="100vw"
                        className="object-cover"
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/35 to-transparent" />

                <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16 lg:px-24">
                    <span className="section-label text-white/70 mb-3">Collection</span>
                    <h1 className="text-white text-4xl sm:text-5xl lg:text-6xl leading-tight mb-3">
                        {collection.title}
                    </h1>
                    <p className="text-white/80 text-body-lg max-w-md">
                        {collection.subtitle}
                    </p>
                </div>
            </section>

            <section className="mb-12 md:mb-16 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
                <div className="space-y-5">
                    {collection.description.map((paragraph, i) => (
                        <p key={i} className="text-body text-justify leading-relaxed text-foreground/80">
                            {paragraph}
                        </p>
                    ))}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {collection.characteristics.map((char, i) => (
                        <div
                            key={i}
                            className="flex flex-col p-4 md:p-5 rounded-2xl bg-secondary/40 border border-border/40"
                        >
                            <span className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
                                {char.label}
                            </span>
                            <span className="font-semibold text-body">{char.value}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* Products */}
            <section className="mb-16">
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 section-header-mb">
                    <div className="space-y-2">
                        <span className="section-label">La collection</span>
                        <h2>Pièces disponibles</h2>
                        <p className="text-muted-foreground text-body">
                            {collectionProducts.length > 0
                                ? `${collectionProducts.length} création${collectionProducts.length > 1 ? "s" : ""} unique${collectionProducts.length > 1 ? "s" : ""} disponible${collectionProducts.length > 1 ? "s" : ""}.`
                                : "De nouvelles pièces arrivent bientôt — revenez nous rendre visite."}
                        </p>
                    </div>
                    <Link href="/boutique" className="link-section shrink-0">
                        Toute la boutique
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                {collectionProducts.length > 0 ? (
                    <>
                        <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                            {collectionProducts.map((product) => (
                                <PreviewProduct key={product.id} product={product} />
                            ))}
                        </div>

                        <div className="md:hidden">
                            <Carousel opts={{ align: "center", loop: true, watchDrag: false }}>
                                <CarouselContent className="m-0">
                                    {collectionProducts.map((product) => (
                                        <CarouselItem key={product.id} className="basis-full px-6">
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
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center rounded-2xl bg-secondary/30 border border-border">
                        <p className="text-muted-foreground text-body max-w-sm">
                            Aucune pièce disponible pour le moment dans cette collection.
                            De nouvelles créations arrivent très prochainement.
                        </p>
                    </div>
                )}
            </section>

            {/* CTA bottom */}
            <section className="section-padding bg-secondary/30 rounded-3xl mb-16 text-center space-y-4">
                <span className="section-label">À ne pas manquer</span>
                <h2>Découvrez toute la boutique</h2>
                <p className="text-body text-muted-foreground max-w-lg mx-auto">
                    Chaque pièce est unique et fabriquée en quantité limitée. Retrouvez
                    l'ensemble des créations disponibles dans la boutique, ou apprenez-en
                    plus sur l'atelier et le savoir-faire derrière chaque sac.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                    <Link
                        href="/boutique"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
                    >
                        Explorer la boutique
                    </Link>
                    <Link
                        href="/a-propos"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white border border-border font-semibold text-sm hover:bg-secondary/60 transition-colors"
                    >
                        Découvrir l'atelier
                    </Link>
                </div>
            </section>
        </div>
    );
}
