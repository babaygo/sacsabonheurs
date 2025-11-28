import { Product } from "../../src/generated/prisma/index.js";

interface GoogleMerchantConfig {
    baseUrl: string;
    brandName: string;
}

/**
 * Échappe les caractères spéciaux pour XML
 */
export function escapeXml(unsafe: string | number | null | undefined): string {
    if (!unsafe && unsafe !== 0) return '';
    return String(unsafe)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

/**
 * Convertit le HTML en texte brut pour Google Merchant
 */
function stripHtml(html: string): string {
    if (!html) return '';

    return html
        .replace(/<\/p>/gi, '\n')
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<[^>]*>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/\n\s*\n/g, '\n')
        .replace(/[ \t]+/g, ' ')
        .trim()
        .substring(0, 5000);
}

/**
 * Génère une entrée XML pour un produit
 */
function generateProductItem(
    product: Product,
    config: GoogleMerchantConfig
): string {
    const { baseUrl, brandName } = config;
    const id = String(product.id);
    const title = product.name;
    const description = stripHtml(product.description);
    const link = `${baseUrl}/products/${product.slug}`;
    let imageLink = `${baseUrl}/images/placeholder.jpg`;
    if (product.images && product.images.length > 0) {
        const firstImage = product.images[0];
        imageLink = firstImage.startsWith('http')
            ? firstImage
            : `${baseUrl}${firstImage}`;
    }
    const price = `${product.price.toFixed(2)} EUR`;
    const availability = product.stock > 0 ? 'in stock' : 'out of stock';
    const condition = 'new';
    const brand = brandName;
    const color = product.color;
    const material = product.material;

    return `
    <item>
      <g:id>${escapeXml(id)}</g:id>
      <g:title>${escapeXml(title)}</g:title>
      <g:description>${escapeXml(description)}</g:description>
      <g:link>${escapeXml(link)}</g:link>
      <g:image_link>${escapeXml(imageLink)}</g:image_link>
      <g:price>${escapeXml(price)}</g:price>
      <g:availability>${escapeXml(availability)}</g:availability>
      <g:condition>${escapeXml(condition)}</g:condition>
      <g:brand>${escapeXml(brand)}</g:brand>
      <g:age_group>${escapeXml("adult")}</g:age_group>
      <g:gender>${escapeXml("female")}</g:gender>
      <g:color>${escapeXml(color)}</g:color>
      <g:material>${escapeXml(material)}</g:material>
    </item>`;
}

/**
 * Génère le flux XML complet pour Google Merchant Center
 */
export function generateProductFeed(
    products: Product[],
    config: GoogleMerchantConfig
): string {
    const { baseUrl, brandName } = config;

    const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>';
    const rssOpen = '<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">';
    const channelOpen = '<channel>';
    const channelInfo = `
    <title>${escapeXml(brandName)}</title>
    <link>${escapeXml(baseUrl)}</link>
    <description>Boutique en ligne ${escapeXml(brandName)}</description>
  `;

    const items = products
        .map(product => generateProductItem(product, config))
        .join('');

    const channelClose = '</channel>';
    const rssClose = '</rss>';

    return `${xmlHeader}\n${rssOpen}\n${channelOpen}${channelInfo}${items}${channelClose}\n${rssClose}`;
}