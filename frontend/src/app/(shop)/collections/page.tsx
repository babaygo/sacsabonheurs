import BreadCrumb from "@/components/shared/BreadCrumb";
import { getCollections } from "@/lib/api/collection";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const metadata: Metadata = {
    title: "Collections — Liège, Jacquard, Suédine | Sacs à Bonheurs",
    description:
        "Explorez les collections de Sacs à Bonheurs : des sacs artisanaux faits main en Loire-Atlantique. Liège naturel & vegan, Jacquard élégant, Suédine douce.",
    openGraph: {
        title: "Nos Collections — Sacs à Bonheurs",
        description:
            "Liège, Jacquard, Suédine : des univers de matières pour des sacs artisanaux uniques, fabriqués à la main en France.",
    },
};

export default async function CollectionsPage() {
    const collections = await getCollections();

    return (
        <div className="min-h-screen pt-4">
            <BreadCrumb
                items={[
                    { label: "Accueil", href: "/" },
                    { label: "Collections" },
                ]}
            />

            {/* Header */}
            <div className="flex flex-col items-center space-y-2 mb-10 md:mb-14 text-center">
                <span className="section-label">Nos univers</span>
                <h1>Les Collections</h1>
                <p className="text-muted-foreground text-body max-w-lg">
                    Trois matières d'exception, sélectionnées pour leur caractère unique et
                    leur qualité. Chaque collection donne naissance à des pièces artisanales
                    fabriquées à la main dans mon atelier à Saint-Nazaire.
                </p>
            </div>

            {collections.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center rounded-2xl bg-secondary/30 border border-dashed border-border">
                    <p className="text-muted-foreground text-body max-w-sm">
                        Aucune collection disponible pour le moment.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-16">
                    {collections.map((collection) => (
                        <Link
                            key={collection.slug}
                            href={`/collections/${collection.slug}`}
                            className="group flex flex-col rounded-2xl overflow-hidden border border-border/60 bg-background hover:shadow-lg transition-shadow duration-300"
                        >
                            {/* Image */}
                            <div className="relative aspect-[3/4] overflow-hidden bg-secondary">
                                {collection.heroImage && (
                                    <Image
                                        src={collection.heroImage}
                                        alt={collection.title}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 33vw"
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        loading="lazy"
                                    />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                                <div className="absolute inset-x-0 bottom-0 p-5">
                                    <h2 className="text-white text-xl mb-0.5">
                                        {collection.title}
                                    </h2>
                                    <p className="text-white/75 text-sm font-light italic">
                                        {collection.subtitle}
                                    </p>
                                </div>
                            </div>

                            {/* Text */}
                            <div className="flex flex-col flex-1 p-5 md:p-6 gap-4">
                                <p className="text-body text-muted-foreground leading-relaxed flex-1">
                                    {collection.excerpt}
                                </p>
                                <span className="inline-flex items-center gap-1 text-primary text-sm font-semibold group-hover:gap-2 transition-all duration-200">
                                    Découvrir la collection
                                    <ChevronRight className="w-4 h-4" />
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}

