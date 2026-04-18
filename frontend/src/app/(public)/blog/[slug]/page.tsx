import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { ArrowRight, CalendarDays, ChevronDown, Clock3, Facebook, Linkedin, Share2 } from "lucide-react";
import BreadCrumb from "@/components/shared/BreadCrumb";
import { Button } from "@/components/ui/button";
import { Article } from "@/types/Article";
import { getArticleBySlug, getAllArticles } from "@/lib/api/article";

export const revalidate = 60;

function stripHtmlTags(value: string) {
    return value
        .replace(/<[^>]+>/g, " ")
        .replace(/&nbsp;/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

function slugify(value: string) {
    return value
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

function enrichArticleContent(content: string) {
    const headings: Array<{ id: string; label: string; level: "h2" | "h3" }> = [];
    const usedIds = new Set<string>();

    const enhancedContent = content.replace(
        /<(h2|h3)([^>]*)>(.*?)<\/\1>/gi,
        (_, tag: "h2" | "h3", attrs: string, inner: string) => {
            const label = stripHtmlTags(inner);
            if (!label) {
                return `<${tag}${attrs}>${inner}</${tag}>`;
            }

            let id = slugify(label) || `section-${headings.length + 1}`;
            while (usedIds.has(id)) {
                id = `${id}-${headings.length + 1}`;
            }
            usedIds.add(id);

            headings.push({ id, label, level: tag });
            return `<${tag}${attrs} id="${id}">${inner}</${tag}>`;
        }
    );

    return { headings, enhancedContent };
}

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
            publishedTime: new Date(article.createdAt).toISOString(),
            authors: [article.author],
        },
    };
}

export async function generateStaticParams() {
    const articles = await getAllArticles();
    return articles.map((article: Article) => ({
        slug: article.slug,
    }));
}

function buildArticleSchema(article: Article) {
    return {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: article.title,
        description: article.excerpt,
        image: article.image,
        datePublished: new Date(article.createdAt).toISOString(),
        dateModified: new Date(article.updatedAt).toISOString(),
        author: {
            "@type": "Organization",
            name: article.author,
            url: "https://sacsabonheurs.fr",
        },
        publisher: {
            "@type": "Organization",
            name: "Sacs à Bonheurs",
            logo: {
                "@type": "ImageObject",
                url: "https://sacsabonheurs.fr/logo.png",
                width: 200,
                height: 60,
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
    const shareUrl = `https://sacsabonheurs.fr/blog/${article.slug}`;
    const formattedDate = new Date(article.createdAt).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
    const { headings, enhancedContent } = enrichArticleContent(article.content);

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaObj) }}
            />

            <div className="min-h-screen pb-12">
                <BreadCrumb
                    items={[
                        { label: "Accueil", href: "/" },
                        { label: "Blog", href: "/blog" },
                    ]}
                />

                <header className="mb-6 overflow-hidden rounded-[22px] border border-border bg-card shadow-sm sm:mb-8 sm:rounded-[28px]">
                    <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
                        <div className="order-2 p-4 sm:p-6 lg:order-1 lg:p-10">
                            <div className="mb-4 flex flex-wrap items-center gap-2 text-xs sm:text-sm">
                                <span className="rounded-full bg-secondary px-3 py-1 font-semibold text-primary">
                                    {article.category}
                                </span>
                                <span className="rounded-full border border-border bg-background px-3 py-1 text-muted-foreground">
                                    {article.readingTime} min de lecture
                                </span>
                            </div>

                            <h1 className="mb-4 !text-3xl leading-tight md:!text-5xl">
                                {article.title}
                            </h1>

                            <p className="max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
                                {article.excerpt}
                            </p>

                            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                <span className="inline-flex items-center gap-2">
                                    <CalendarDays className="h-4 w-4 text-primary" />
                                    {formattedDate}
                                </span>
                            </div>
                        </div>

                        {article.image && (
                            <div className="relative order-1 min-h-[260px] overflow-hidden bg-secondary lg:order-2 lg:min-h-full">
                                <Image
                                    src={article.image}
                                    alt={article.title}
                                    fill
                                    sizes="(max-width: 1024px) 100vw, 40vw"
                                    className="object-cover"
                                    fetchPriority="high"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                            </div>
                        )}
                    </div>
                </header>

                <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start">
                    <div className="min-w-0">
                        {headings.length > 0 && (
                            <details className="group mb-4 rounded-2xl border border-border bg-card p-3 shadow-sm lg:hidden">
                                <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
                                    <div>
                                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                                            Sommaire
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {headings.length} section{headings.length > 1 ? "s" : ""}
                                        </p>
                                    </div>
                                    <span className="rounded-full border border-border p-2 text-foreground transition-transform duration-500 ease-out group-open:rotate-180">
                                        <ChevronDown className="h-4 w-4" />
                                    </span>
                                </summary>

                                <div className="toc-mobile-content">
                                    <div className="toc-mobile-inner max-h-56 overflow-y-auto pr-1">
                                        <ul className="space-y-1.5">
                                            {headings.map((heading) => (
                                                <li key={heading.id}>
                                                    <a
                                                        href={`#${heading.id}`}
                                                        className={`block rounded-lg px-2 py-2 text-sm leading-5 hover:bg-secondary ${heading.level === "h3" ? "pl-5 text-muted-foreground" : "font-medium text-foreground"}`}
                                                    >
                                                        {heading.label}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </details>
                        )}

                        <article className="rounded-[22px] border border-border bg-card px-4 py-5 shadow-sm sm:rounded-[28px] sm:p-8 lg:p-10">
                            <div
                                dangerouslySetInnerHTML={{ __html: enhancedContent }}
                                className="blog-article-content"
                            />

                            <div className="mt-10 border-t border-border pt-6">
                                <p className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                                    <Share2 className="h-4 w-4" />
                                    Partager cet article
                                </p>
                                <div className="flex flex-wrap gap-3">
                                    <a
                                        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(shareUrl)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium hover:border-primary"
                                        title="Partager sur X"
                                    >
                                        <span>X</span>
                                    </a>
                                    <a
                                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium hover:border-primary"
                                        title="Partager sur Facebook"
                                    >
                                        <Facebook className="h-4 w-4" />
                                        Facebook
                                    </a>
                                    <a
                                        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium hover:border-primary"
                                        title="Partager sur LinkedIn"
                                    >
                                        <Linkedin className="h-4 w-4" />
                                        LinkedIn
                                    </a>
                                </div>
                            </div>
                        </article>

                        <section className="mt-8 grid gap-4 md:grid-cols-2">
                            <div className="rounded-[24px] border border-border bg-card p-6 shadow-sm">
                                <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                                    À propos
                                </p>
                                <h2 className="mb-3 !text-2xl">Qui je suis ?</h2>
                                <p className="text-sm leading-7 text-muted-foreground md:text-base">
                                    {article.author} crée des sacs artisanaux durables, pensés pour allier style, qualité et usage quotidien.
                                </p>
                            </div>

                            <div className="rounded-[24px] border border-border p-6 shadow-sm">
                                <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                                    Découverte
                                </p>
                                <h2 className="mb-3 !text-2xl">Découvrez mes sacs artisanaux</h2>
                                <p className="mb-5 text-sm leading-7 text-muted-foreground md:text-base">
                                    Trouvez le sac parfait selon vos besoins, votre style et vos valeurs.
                                </p>
                                <Button asChild size="lg" className="w-full sm:w-auto">
                                    <Link href="/boutique" className="inline-flex items-center gap-2">
                                        Parcourir la collection
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </Button>
                            </div>
                        </section>
                    </div>

                    <aside className="hidden lg:block">
                        <div className="sticky top-28 space-y-4">
                            {headings.length > 0 && (
                                <nav className="rounded-[24px] border border-border bg-card p-5 shadow-sm">
                                    <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                                        Sommaire
                                    </p>
                                    <ul className="space-y-2">
                                        {headings.map((heading) => (
                                            <li key={heading.id}>
                                                <a
                                                    href={`#${heading.id}`}
                                                    className={`block text-sm leading-6 hover:text-primary ${heading.level === "h3" ? "pl-3 text-muted-foreground" : "font-medium text-foreground"}`}
                                                >
                                                    {heading.label}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </nav>
                            )}
                        </div>
                    </aside>
                </div>
            </div>
        </>
    );
}
