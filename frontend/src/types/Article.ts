export interface Article {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    image: string;
    author: string;
    category: string;
    keywords: string;
    metaDescription: string;
    readingTime: number;
    createdAt: Date;
    updatedAt: Date;
    published: boolean;
}
