import { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_URL_FRONT ?? "https://sacsabonheurs.fr";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: ["/admin", "/orders", "/api/", "/choose-relay"],
        },
        sitemap: `${SITE_URL}/sitemap.xml`,
        host: SITE_URL,
    };
}
