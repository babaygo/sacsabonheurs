import { MetadataRoute } from "next";
import { getProducts } from "@/lib/api/product";
import { getAllArticles } from "@/lib/api/article";

const SITE_URL = process.env.NEXT_PUBLIC_URL_FRONT!;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Pages statiques
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: SITE_URL,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 1,
        },
        {
            url: `${SITE_URL}/boutique`,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 0.9,
        },
        {
            url: `${SITE_URL}/blog`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.8,
        },
        {
            url: `${SITE_URL}/a-propos`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.5,
        },
        {
            url: `${SITE_URL}/contact`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.5,
        },
        {
            url: `${SITE_URL}/faq`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.5,
        },
        {
            url: `${SITE_URL}/policies/cgv`,
            lastModified: new Date(),
            changeFrequency: "yearly",
            priority: 0.3,
        },
        {
            url: `${SITE_URL}/policies/mentions`,
            lastModified: new Date(),
            changeFrequency: "yearly",
            priority: 0.3,
        },
        {
            url: `${SITE_URL}/policies/privacy-policy`,
            lastModified: new Date(),
            changeFrequency: "yearly",
            priority: 0.3,
        },
    ];

    // Pages produits dynamiques
    const products = await getProducts(undefined, true);
    const productPages: MetadataRoute.Sitemap = products.map((product) => ({
        url: `${SITE_URL}/products/${product.slug}`,
        lastModified: new Date(product.updatedAt),
        changeFrequency: "weekly",
        priority: 0.8,
    }));

    // Pages articles dynamiques
    const articles = await getAllArticles();
    const articlePages: MetadataRoute.Sitemap = articles
        .filter((article) => article.published)
        .map((article) => ({
            url: `${SITE_URL}/blog/${article.slug}`,
            lastModified: new Date(article.updatedAt),
            changeFrequency: "monthly",
            priority: 0.6,
        }));

    return [...staticPages, ...productPages, ...articlePages];
}
