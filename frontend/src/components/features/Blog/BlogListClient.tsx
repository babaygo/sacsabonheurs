"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Article } from "@/types/Article";
import { getArticles } from "@/lib/api/article";
import { MoveRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type PaginationInfo = {
    total: number;
    page: number;
    limit: number;
    pages: number;
};

type BlogListClientProps = {
    initialPage: number;
    featuredSlug?: string;
};

export default function BlogListClient({ initialPage, featuredSlug }: BlogListClientProps) {
    const searchParams = useSearchParams();
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [columns, setColumns] = useState(1);
    const [articles, setArticles] = useState<Article[]>([]);
    const [pagination, setPagination] = useState<PaginationInfo>({
        total: 0,
        page: initialPage,
        limit: 3,
        pages: 0,
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const updateColumns = () => {
            const width = window.innerWidth;
            if (width >= 1024) {
                setColumns(3);
            } else if (width >= 768) {
                setColumns(2);
            } else {
                setColumns(1);
            }
        };

        updateColumns();
        window.addEventListener("resize", updateColumns);
        return () => window.removeEventListener("resize", updateColumns);
    }, []);

    useEffect(() => {
        const pageParam = searchParams.get("page");
        const nextPage = Math.max(1, parseInt(pageParam || "1"));
        if (nextPage !== currentPage) {
            setCurrentPage(nextPage);
        }
    }, [searchParams, currentPage]);

    const baseLimit = useMemo(() => {
        if (columns === 3) return 9;
        if (columns === 2) return 6;
        return 3;
    }, [columns]);
    const limit = baseLimit;

    useEffect(() => {
        let isActive = true;

        const loadArticles = async () => {
            setLoading(true);
            const result = await getArticles(currentPage, limit, featuredSlug);
            if (isActive) {
                setArticles(result.data);
                setPagination(result.pagination);
                setLoading(false);
            }
        };

        loadArticles();

        return () => {
            isActive = false;
        };
    }, [currentPage, limit, featuredSlug]);

    if (loading) {
        return (
            <div className="text-center py-16">
                <p className="text-muted-foreground text-lg">Chargement des articles...</p>
            </div>
        );
    }

    if (articles.length === 0) {
        return (
            <div className="text-center py-16">
                <p className="text-muted-foreground text-lg">Aucun article disponible.</p>
            </div>
        );
    }

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 mb-12">
                {articles.map((article: Article) => (
                    <Link key={article.id} href={`/blog/${article.slug}`} className="group flex flex-col h-full">
                        <div className="relative aspect-[3/2] w-full overflow-hidden rounded-[var(--radius)] mb-5 bg-muted border border-border">
                            {article.image && (
                                <Image
                                    src={article.image}
                                    alt={article.title}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                            )}
                        </div>

                        <div className="flex flex-col flex-grow">
                            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">
                                <span className="text-primary font-bold">{article.category}</span>
                                <span className="text-accent">—</span>
                                <span>{article.readingTime} min</span>
                            </div>

                            <h3 className="text-xl font-bold text-foreground mb-3 leading-snug group-hover:text-primary transition-colors font-serif">
                                {article.title}
                            </h3>

                            <p className="text-muted-foreground text-sm line-clamp-2 mb-4 flex-grow">
                                {article.excerpt}
                            </p>

                            <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors mt-auto flex items-center">
                                Lire la suite
                                <MoveRight className="w-5 h-5 ml-1 transition-transform group-hover:translate-x-1" />
                            </span>
                        </div>
                    </Link>
                ))}
            </div>

            {pagination.pages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-16 pt-12 border-t border-border">
                    <div className="flex items-center gap-1">
                        {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                            <Link key={page} href={`/blog?page=${page}`}>
                                <Button
                                    variant={currentPage === page ? "default" : "outline"}
                                    size="sm"
                                    className="w-10 h-10 p-0"
                                >
                                    {page}
                                </Button>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}
