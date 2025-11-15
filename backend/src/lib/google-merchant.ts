import { Product } from "@prisma/client";

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
        // Remplacer les balises de paragraphe par des sauts de ligne
        .replace(/<\/p>/gi, '\n')
        .replace(/<br\s*\/?>/gi, '\n')
        // Supprimer toutes les autres balises HTML
        .replace(/<[^>]*>/g, '')
        // Décoder les entités HTML courantes
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        // Nettoyer les espaces multiples et sauts de ligne
        .replace(/\n\s*\n/g, '\n')
        .replace(/[ \t]+/g, ' ')
        .trim()
        // Limiter à 5000 caractères (limite Google)
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

    // 1. ID (obligatoire) - Identifiant unique
    const id = String(product.id);

    // 2. TITLE (obligatoire) - Nom du produit
    const title = product.name;

    // 3. DESCRIPTION (obligatoire) - Description sans HTML
    const description = stripHtml(product.description);

    // 4. LINK (obligatoire) - URL de la page produit
    const link = `${baseUrl}/produits/${product.slug}`;

    // 5. IMAGE_LINK (obligatoire) - URL de l'image principale
    let imageLink = `${baseUrl}/images/placeholder.jpg`;
    if (product.images && product.images.length > 0) {
        const firstImage = product.images[0];
        imageLink = firstImage.startsWith('http')
            ? firstImage
            : `${baseUrl}${firstImage}`;
    }

    // 6. PRICE (obligatoire) - Prix avec devise
    const price = `${product.price.toFixed(2)} EUR`;

    // 7. AVAILABILITY (obligatoire) - Disponibilité selon le stock
    const availability = product.stock > 0 ? 'in stock' : 'out of stock';

    // 8. CONDITION (obligatoire) - État du produit
    const condition = 'new';

    // 9. BRAND (obligatoire) - Marque
    const brand = brandName;

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