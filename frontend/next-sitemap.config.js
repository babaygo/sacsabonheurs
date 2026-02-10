/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: 'https://sacsabonheurs.fr',
    generateRobotsTxt: true,
    sitemapSize: 5000,
    changefreq: 'weekly',
    priority: 0.7,
    exclude: ['/admin*', '/choose-relay', '/signup', '/login', '/reset-password', '/orders'],
    robotsTxtOptions: {
        sitemaps: [
            'https://sacsabonheurs.fr/sitemap.xml',
        ],
        policies: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/admin', '/orders', '/api/*'],
            },
        ],
    },
    additionalSitemaps: [
        'https://sacsabonheurs.fr/sitemap-products.xml',
        'https://sacsabonheurs.fr/sitemap-blog.xml',
    ],
};
