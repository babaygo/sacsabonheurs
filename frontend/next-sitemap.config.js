/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: 'https://sacsabonheurs.fr',
    generateRobotsTxt: true,
    exclude: [
        '/admin*',
        '/choose-relay',
        '/signup',
        '/login',
        '/reset-password',
        '/forgot-password',
        '/orders',
        '/orders/*',
    ],
    robotsTxtOptions: {
        policies: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/admin', '/orders', '/api/*', '/choose-relay'],
            },
        ],
    },
};
