import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import BreadCrumb from "@/components/shared/BreadCrumb";
import { Article } from "@/types/Article";
import { getArticles } from "@/lib/api/article";

export const metadata: Metadata = {
    title: "Blog - Sacs à Bonheurs - Conseils Mode et Accessoires",
    description: "Découvrez nos articles de blog sur la mode, les sacs artisanaux, la durabilité et les tendances 2026. Conseils d'experts pour bien choisir votre sac.",
    keywords: "blog sacs, conseils mode, sacs artisanaux, tendances mode, matériaux durables",
};

export default async function BlogPage() {
    const articles = await getArticles();

    return (
        <div className="min-h-screen pt-4">
            <BreadCrumb
                items={[
                    { label: "Accueil", href: "/" },
                    { label: "Blog" },
                ]}
            />

            {/* Header */}
            <div className="mb-12">
                <h1 className="text-3xl sm:text-4xl font-bold">Notre Blog</h1>
                <p className="text-lg text-gray-600 max-w-3xl">
                    Explorez nos articles de blog pour découvrir des conseils en mode, des tendances,
                    et tout ce que vous devez savoir sur les sacs artisanaux durables.
                </p>
            </div>

            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {articles.map((article: Article) => (
                    <Link key={article.id} href={`/blog/${article.slug}`}>
                        <article className="group cursor-pointer">
                            {/* Image */}
                            {article.image && (
                                <div className="relative w-full aspect-video overflow-hidden rounded-lg mb-4 bg-gray-200">
                                    <Image
                                        src={article.image}
                                        alt={article.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                </div>
                            )}

                            {/* Category Badge */}
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-xs font-semibold bg-primary/10 text-primary px-3 py-1 rounded-full">
                                    {article.category}
                                </span>
                                <span className="text-xs text-gray-500">
                                    {article.readingTime} min de lecture
                                </span>
                            </div>

                            {/* Title */}
                            <h2 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                                {article.title}
                            </h2>

                            {/* Excerpt */}
                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                {article.excerpt}
                            </p>

                            {/* Meta */}
                            <div className="flex items-center justify-between text-xs text-gray-500">
                                <span>{article.author}</span>
                                <span>
                                    {new Date(article.createdAt).toLocaleDateString("fr-FR", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </span>
                            </div>
                        </article>
                    </Link>
                ))}
            </div>

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Blog",
                        name: "Sacs à Bonheurs - Blog",
                        url: "https://sacsabonheurs.com/blog",
                        description:
                            "Blog officiel de Sacs à Bonheurs avec des articles sur la mode, les sacs artisanaux et la durabilité",
                        blogPost: articles.map((article: Article) => ({
                            "@type": "BlogPosting",
                            headline: article.title,
                            description: article.excerpt,
                            image: article.image,
                            datePublished: article.createdAt,
                            author: {
                                "@type": "Organization",
                                name: article.author,
                            },
                        })),
                    }),
                }}
            />
        </div>
    );
}
