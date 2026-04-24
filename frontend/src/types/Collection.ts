import { Product } from "./Product";

export interface Collection {
    id: number;
    slug: string;
    title: string;
    subtitle: string;
    heroImage: string | null;
    material: string;
    excerpt: string;
    description: string[];
    characteristics: { label: string; value: string }[];
    metaTitle: string;
    metaDescription: string;
    featured: boolean;
    order: number;
    createdAt: Date;
    updatedAt: Date;
    products?: Product[];
}
