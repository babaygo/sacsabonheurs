import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import BreadCrumb from "@/components/shared/BreadCrumb";
import { Article } from "@/types/Article";
import { getArticles } from "@/lib/api/article";
import { MoveRight } from "lucide-react";
import BlogListClient from "../../../components/features/Blog/BlogListClient";

export const revalidate = 60;

export const metadata: Metadata = {
    title: "Blog - Sacs à Bonheurs",
    description: "Plongez dans l'univers de la maroquinerie durable. Tendances, coulisses de l'atelier et conseils pour adopter une consommation responsable.",
    keywords: "blog sacs, conseils mode, sacs artisanaux, tendances mode, matériaux durables, entretien sacs, histoire de la maroquinerie, interviews artisans, nouveautés sacs à bonheurs",
};

export default async function BlogPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string }>;
}) {
    const params = await searchParams;
    const currentPage = Math.max(1, parseInt(params.page || "1"));

    const { data: featuredPageArticles } = await getArticles(1, 1);
    const featuredArticle = featuredPageArticles[0];
    return (
        <div className="min-h-screen">
            <div className="container pt-6 pb-20">

                <BreadCrumb
                    items={[
                        { label: "Accueil", href: "/" },
                        { label: "Blog" },
                    ]}
                />

                <h1 className="mb-8">
                    Le Blog
                </h1>

                {featuredArticle && (
                    <Link key={featuredArticle.id} href={`/blog/${featuredArticle.slug}`} className="group block mb-16">
                        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:items-center">
                            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[var(--radius)] border border-border">
                                {featuredArticle.image && (
                                    <Image
                                        src={featuredArticle.image}
                                        alt={featuredArticle.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        fetchPriority="high"
                                        loading="lazy"
                                        sizes="(max-width: 1024px) 100vw, 50vw"
                                    />
                                )}
                            </div>

                            <div className="flex flex-col justify-center lg:pl-10">
                                <h2 className="text-2xl sm:text-3xl font-playfair-display font-bold mb-6 leading-tight group-hover:text-accent transition-colors">
                                    {featuredArticle.title}
                                </h2>

                                <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
                                    <span className="bg-secondary text-primary px-3 py-1 rounded-full font-medium">
                                        {featuredArticle.category}
                                    </span>
                                    <span className="text-accent">•</span>
                                    <span>{new Date(featuredArticle.createdAt).toLocaleDateString("fr-FR", {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                    })}</span>
                                </div>

                                <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                                    {featuredArticle.excerpt}
                                </p>

                                <span className="inline-flex items-center text-primary font-semibold hover:underline underline-offset-4 decoration-accent">
                                    Lire l'article à la une
                                    <MoveRight className="w-5 h-5 ml-1 transition-transform group-hover:translate-x-1" />
                                </span>
                            </div>
                        </div>
                    </Link>
                )}

                <div className="border-t border-border mb-16"></div>

                <BlogListClient
                    initialPage={currentPage}
                    featuredSlug={featuredArticle?.slug}
                />

                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "Blog",
                            name: "Blog - Sacs à Bonheurs",
                            url: `${process.env.NEXT_PUBLIC_URL_FRONT}/blog`,
                            description: "Blog officiel de Sacs à Bonheurs...",
                            blogPost: featuredPageArticles.map((article: Article) => ({
                                "@type": "BlogPosting",
                                headline: article.title,
                                description: article.excerpt,
                                image: article.image,
                                datePublished: article.createdAt,
                                author: { "@type": "Organization", name: "Sacs à Bonheurs" },
                            })),
                        }),
                    }}
                />
            </div>
        </div>
    );
}