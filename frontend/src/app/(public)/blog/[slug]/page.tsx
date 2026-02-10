import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import BreadCrumb from "@/components/shared/BreadCrumb";
import { Button } from "@/components/ui/button";
import { Article } from "@/types/Article";
import { getArticleBySlug, getArticles } from "@/lib/api/article";
import { MoveLeft } from "lucide-react";

export const revalidate = 60;

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const article = await getArticleBySlug(slug);

    if (!article) {
        return {
            title: "Article non trouvé",
        };
    }

    return {
        title: `${article.title} - Sacs à Bonheurs`,
        description: article.metaDescription,
        keywords: article.keywords,
        authors: [{ name: article.author }],
        openGraph: {
            type: "article",
            title: article.title,
            description: article.excerpt,
            ...(article.image && { images: [article.image] }),
            publishedTime: new Date(article.createdAt).toLocaleDateString("fr-FR", {
                year: "numeric",
                month: "long",
                day: "numeric",
            }),
            authors: [article.author],
        },
    };
}

export async function generateStaticParams() {
    const articles = await getArticles();
    return articles.map((article: Article) => ({
        slug: article.slug,
    }));
}

function buildArticleSchema(article: any) {
    return {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: article.title,
        description: article.excerpt,
        image: article.image,
        datePublished: article.publishedAt,
        dateModified: article.publishedAt,
        author: {
            "@type": "Organization",
            name: article.author,
            url: "https://sacsabonheurs.com",
        },
        publisher: {
            "@type": "Organization",
            name: "Sacs à Bonheurs",
            logo: {
                "@type": "ImageObject",
                url: "https://sacsabonheurs.com/logo.png",
                width: 200,
                height: 60,
            },
        },
        mainEntity: {
            "@type": "Article",
            headline: article.title,
            image: article.image,
            datePublished: article.publishedAt,
            dateModified: article.publishedAt,
            author: {
                "@type": "Organization",
                name: article.author,
            },
        },
    };
}

export default async function ArticlePage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const article = await getArticleBySlug(slug);

    if (!article) return notFound();

    const schemaObj = buildArticleSchema(article);

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaObj) }}
            />

            <div className="min-h-screen">
                <BreadCrumb
                    items={[
                        { label: "Accueil", href: "/" },
                        { label: "Blog", href: "/blog" }
                    ]}
                />

                <header className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="text-sm font-semibold bg-primary/10 text-primary px-3 py-1 rounded-full">
                            {article.category}
                        </span>
                        <span className="text-sm text-gray-500">
                            {article.readingTime} min de lecture
                        </span>
                    </div>

                    <h1 className="text-3xl sm:text-4xl font-bold">{article.title}</h1>

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between text-sm text-gray-600 border-t border-b border-gray-200 py-4">
                        <div className="flex items-center gap-4">
                            <span>Par <strong>{article.author}</strong></span>
                            <span>
                                {new Date(article.createdAt).toLocaleDateString("fr-FR", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </span>
                        </div>
                    </div>
                </header>

                <article className="prose prose-lg max-w-none mb-8">
                    <div
                        dangerouslySetInnerHTML={{ __html: article.content }}
                        className="prose prose-lg max-w-none
                                prose-h2:text-3xl prose-h2:font-bold prose-h2:mt-8 prose-h2:mb-4
                                prose-h3:text-xl prose-h3:font-bold prose-h3:mt-6 prose-h3:mb-3
                                prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
                                prose-ul:my-4 prose-li:my-2
                                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                                prose-strong:font-bold
                            "
                    />

                    <div className="mt-6">
                        <p className="font-semibold mb-3">Partager cet article</p>
                        <div className="flex gap-3">
                            <a
                                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(`https://sacsabonheurs.com/blog/${article.slug}`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 hover:bg-primary hover:text-white transition-colors"
                                title="Partager sur Twitter"
                            >
                                𝕏
                            </a>
                            <a
                                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://sacsabonheurs.com/blog/${article.slug}`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 hover:bg-primary hover:text-white transition-colors"
                                title="Partager sur Facebook"
                            >
                                f
                            </a>
                            <a
                                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://sacsabonheurs.com/blog/${article.slug}`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 hover:bg-primary hover:text-white transition-colors"
                                title="Partager sur LinkedIn"
                            >
                                in
                            </a>
                        </div>
                    </div>
                </article>

                <footer className="border-t pt-8 mb-8">
                    <div className="flex flex-col mb-6">
                        <h2 className="text-2xl font-bold mb-4">Qui je suis ?</h2>
                        <p>
                            {article.author} est une marque de sacs artisanaux de haute qualité,
                            basée sur les valeurs de durabilité et de créativité.
                        </p>
                    </div>

                    <div className="mb-12 border-t pt-8">
                        <h2 className="text-2xl font-bold mb-4">Découvrez mes sacs artisanaux</h2>
                        <p className="mb-6">
                            Trouvez le sac parfait qui correspond à vos besoins et à vos valeurs.
                        </p>
                        <Button asChild size="lg">
                            <Link href="/boutique">Parcourir la collection</Link>
                        </Button>
                    </div>
                </footer>
            </div>
        </>
    );
}
