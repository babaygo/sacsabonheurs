/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: 'https://sacsabonheurs.fr',
    generateRobotsTxt: true,
    sitemapSize: 5000,
    changefreq: 'weekly',
    priority: 0.7,
    exclude: ['/admin*', '/choose-relay', '/signup', '/login', '/reset-password', '/orders'],
};
