import BreadCrumb from "@/components/shared/BreadCrumb";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
    title: "À propos - Sacs à Bonheurs",
    description: "Découvrez Sophie et son atelier de création de sacs artisanaux à Saint-Nazaire. Fabrication française depuis 2021, matériaux de qualité, pièces uniques.",
    keywords: "sacs artisanaux Saint-Nazaire, maroquinerie française, création artisanale Loire-Atlantique"
}

export default function AProposPage() {
    const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": "Sacs à Bonheurs",
        "image": `${process.env.NEXT_PUBLIC_URL_FRONT}/assets/sacs-a-bonheurs-logo.png`,
        "description": "Créatrice de sacs artisanaux et accessoires en cuir et tissus de qualité. Fabrication française à Saint-Nazaire depuis 2021.",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "",
            "addressLocality": "Saint-Nazaire",
            "postalCode": "44600",
            "addressRegion": "Loire-Atlantique",
            "addressCountry": "FR"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": "47.2733",
            "longitude": "-2.2137"
        },
        "url": process.env.NEXT_PUBLIC_URL_FRONT!,
        "telephone": "",
        "email": "sacsabonheurs@gmail.com",
        "priceRange": "€€",
        "openingHoursSpecification": {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            "opens": "09:00",
            "closes": "18:00"
        },
        "sameAs": [
            "https://www.instagram.com/sacs_a_bonheurs/",
            "https://www.facebook.com/p/Sacs-%C3%A0-bonheurs-61555061294316/"
        ],
        "founder": {
            "@type": "Person",
            "name": "Sophie",
            "jobTitle": "Créatrice artisanale"
        }
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
            />

            <div className="min-h-screen">
                <div className="mb-4">
                    <BreadCrumb
                        items={[
                            { label: "Accueil", href: "/" },
                            { label: "À propos" }
                        ]}
                    />
                </div>

                <header className="mb-8 sm:mb-12">
                    <h1>
                        Sacs à Bonheurs : L'artisanat au service de l'élégance
                    </h1>
                    <p className="text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed">
                        Des créations uniques imaginées et confectionnées avec passion à Saint-Nazaire
                    </p>
                </header>

                <div className="flex flex-col gap-6 mb-10 sm:mb-12 lg:flex-row lg:items-center">
                    <div className="order-1 lg:order-1 lg:flex-1">
                        <h2 className="mb-4">Qui suis-je ?</h2>
                        <div className="space-y-4 text-sm text-justify sm:text-base leading-relaxed">
                            <p>
                                Bienvenue dans mon univers ! Je m'appelle <strong>Sophie</strong> et ma passion pour
                                la création artisanale m'anime depuis toujours. C'est en 2013 que j'ai franchi le pas
                                en me lançant dans la couture professionnelle, pour rapidement me spécialiser dans la
                                confection de sacs et d'accessoires.
                            </p>
                            <p>
                                Dans mon atelier à <strong>Saint-Nazaire</strong>, en Loire-Atlantique, chaque pièce
                                prend vie grâce à un travail minutieux et un savoir-faire artisanal, que j'ai appris en autodidacte.
                                Je créée personnellement tous mes patrons, ce qui garantit l'unicité de
                                chaque création.
                            </p>
                            <p>
                                Pour suivre les coulisses de mon atelier et découvrir mes nouvelles créations,
                                retrouvez-moi sur{' '}
                                <a
                                    href="https://www.instagram.com/sacs_a_bonheurs/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-baseline gap-1 text-primary underline font-semibold"
                                >
                                    Instagram
                                </a>
                                {' '}et{' '}
                                <a
                                    href="https://www.facebook.com/p/Sacs-%C3%A0-bonheurs-61555061294316/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-baseline gap-1 text-primary underline  font-semibold"
                                >
                                    Facebook
                                </a>.
                            </p>
                        </div>
                    </div>
                    <div className="order-2 lg:order-2 flex justify-center lg:justify-end lg:flex-shrink-0">
                        <div className="relative w-full max-w-xs sm:max-w-sm lg:w-72 xl:w-80">
                            <Image
                                src={`${process.env.NEXT_PUBLIC_URL_MEDIA}/about/sophie.jpg`}
                                alt="Sophie, créatrice de Sacs à Bonheurs"
                                width={320}
                                height={480}
                                priority
                                sizes="(max-width: 640px) 80vw, (max-width: 1024px) 384px, 320px"
                                className="object-contain rounded-lg w-full h-auto"
                            />
                        </div>
                    </div>
                </div >

                <section className="mb-10 sm:mb-12 bg-gray-50 rounded-lg">
                    <h2 className="mb-4 sm:mb-6">Mes valeurs et mon engagement</h2>
                    <div className="flex flex-col gap-4 sm:gap-6 lg:grid lg:grid-cols-3">
                        <div className="p-4 bg-white rounded-lg shadow-sm">
                            <h3 className="mb-2">Fabrication Française</h3>
                            <p className="text-sm sm:text-base leading-relaxed">
                                Toutes mes créations sont conçues et fabriquées dans mon atelier à Saint-Nazaire,
                                garantissant un savoir-faire 100% français.
                            </p>
                        </div>
                        <div className="p-4 bg-white rounded-lg shadow-sm">
                            <h3 className="mb-2">Matériaux de Qualité</h3>
                            <p className="text-sm sm:text-base leading-relaxed">
                                Je sélectionne rigoureusement mes matériaux auprès de fournisseurs français
                                et européens : liège naturel, jacquard tissé, suédine, cuir ...
                            </p>
                        </div>
                        <div className="p-4 bg-white rounded-lg shadow-sm">
                            <h3 className="mb-2">Pièces Uniques</h3>
                            <p className="text-sm sm:text-base leading-relaxed">
                                Chaque sac est une création unique. Je crée mes propres patrons et porte une attention
                                particulière à chaque détail pour vous offrir un accessoire qui vous ressemble.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="mb-10 sm:mb-12">
                    <h2 className="mb-4 sm:mb-6">Mon processus de création</h2>
                    <div className="space-y-4 text-sm text-justify sm:text-base leading-relaxed">
                        <p>
                            Chaque sac Sacs à Bonheurs naît d'une inspiration, souvent puisée dans les textures naturelles
                            et les couleurs qui m'entourent. Le processus commence par l'esquisse du patron, que je dessine
                            entièrement à la main avant de le peaufiner.
                        </p>
                        <p>
                            Je privilégie des matériaux nobles comme le liège naturel et vegan, le jacquard tissé pour son
                            élégance intemporelle, et la suédine pour sa douceur au toucher. Chaque matière est choisie pour
                            ses qualités esthétiques et sa durabilité.
                        </p>
                        <p>
                            La confection se fait entièrement dans mon atelier, où je prends le temps nécessaire pour
                            assembler, coudre et finaliser chaque détail. C'est ce temps accordé à chaque pièce qui fait
                            toute la différence et garantit la qualité de mes créations.
                        </p>
                    </div>
                </section>

                <section className="mb-10 sm:mb-12">
                    <h2 className="mb-4 sm:mb-6">L'atelier en images</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-2 sm:gap-4">
                        {[
                            { src: `${process.env.NEXT_PUBLIC_URL_MEDIA}/about/4C1A3518.JPG`, alt: 'Matériaux : liège, jacquard et suédine' },
                            { src: `${process.env.NEXT_PUBLIC_URL_MEDIA}/about/4C1A3521.JPG`, alt: 'Processus de création artisanale' },
                            { src: `${process.env.NEXT_PUBLIC_URL_MEDIA}/about/4C1A3502.JPG`, alt: 'Création de patrons uniques' },
                            { src: `${process.env.NEXT_PUBLIC_URL_MEDIA}/about/4C1A3509.JPG`, alt: 'Presse & Outils de maroquinerie' },
                            { src: `${process.env.NEXT_PUBLIC_URL_MEDIA}/about/4C1A3505.JPG`, alt: 'Machine à coudre' },
                            { src: `${process.env.NEXT_PUBLIC_URL_MEDIA}/about/4C1A3492.jpg`, alt: 'Sacs artisanaux terminés' }
                        ].map((image, index) => (
                            <div
                                key={index}
                                className="relative aspect-square rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow"
                            >
                                <Image
                                    src={image.src}
                                    alt={image.alt}
                                    fill
                                    loading="lazy"
                                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 33vw"
                                    className="object-cover hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                        ))}
                    </div>
                </section>

                <section className="mb-10 sm:mb-12 text-center">
                    <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Prête à trouver votre Sac ?</h2>
                    <p className="text-base sm:text-lg lg:text-xl mb-6 sm:mb-8">
                        Découvrez mes créations artisanales et trouvez le sac qui vous accompagnera au quotidien.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                        <Link href="/boutique">
                            <Button size="lg" className="w-full px-4 sm:px-6 py-3 text-sm sm:text-base font-medium">Découvrir la boutique</Button>
                        </Link>
                        <Link href="/contact">
                            <Button size="lg" variant="outline" className="w-full px-4 sm:px-6 py-3 text-sm sm:text-base font-medium">Me contacter</Button>
                        </Link>
                    </div>
                </section>
            </div >
        </>
    );
}
