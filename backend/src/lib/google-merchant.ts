import { Product } from "@prisma/client";

interface GoogleMerchantConfig {
    baseUrl: string;
    brandName: string;
}

type ProductWithCategory = Product & {
    category?: {
        name: string;
    };
};

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
    product: ProductWithCategory,
    config: GoogleMerchantConfig
): string {
    const { baseUrl, brandName } = config;
    const toImageUrl = (image: string): string =>
        image.startsWith('http') ? image : `${baseUrl}${image}`;
    const id = String(product.id);
    const title = product.name;
    const description = stripHtml(product.description);
    const link = `${baseUrl}/products/${product.slug}`;
    let imageLink = `${baseUrl}/images/placeholder.jpg`;
    if (product.images && product.images.length > 0) {
        const firstImage = product.images[0];
        imageLink = toImageUrl(firstImage);
    }
    const price = `${product.price.toFixed(2)} EUR`;
    const availability = product.stock > 0 ? 'in_stock' : 'out_of_stock';
    const condition = 'new';
    const brand = brandName;
    const color = product.color;
    const material = product.material;
    const productType = product.category?.name;
    const salePrice = product.isOnSale && product.salePrice
        ? `${product.salePrice.toFixed(2)} EUR`
        : null;
    const additionalImages = (product.images || []).slice(1, 11);
    const weightUnit = 'g';
    const dimensionUnit = 'cm';
    const shippingWeight = product.weight > 0
        ? `${product.weight} ${weightUnit}`
        : null;
    const shippingLength = product.lenght > 0
        ? `${product.lenght} ${dimensionUnit}`
        : null;
    const shippingWidth = product.width > 0
        ? `${product.width} ${dimensionUnit}`
        : null;
    const shippingHeight = product.height > 0
        ? `${product.height} ${dimensionUnit}`
        : null;

    return `
    <item>
      <g:id>${escapeXml(id)}</g:id>
      <g:title>${escapeXml(title)}</g:title>
      <g:description>${escapeXml(description)}</g:description>
      <g:link>${escapeXml(link)}</g:link>
      <g:image_link>${escapeXml(imageLink)}</g:image_link>
      ${additionalImages
            .map(image => `
        <g:additional_image_link>${escapeXml(toImageUrl(image))}</g:additional_image_link>`)
            .join('')}
      <g:price>${escapeXml(price)}</g:price>
      ${salePrice ? `
      <g:sale_price>${escapeXml(salePrice)}</g:sale_price>` : ''}
      <g:availability>${escapeXml(availability)}</g:availability>
      <g:condition>${escapeXml(condition)}</g:condition>
      <g:brand>${escapeXml(brand)}</g:brand>
      <g:identifier_exists>${escapeXml("no")}</g:identifier_exists>
      <g:age_group>${escapeXml("adult")}</g:age_group>
      <g:gender>${escapeXml("female")}</g:gender>
            ${color ? `
            <g:color>${escapeXml(color)}</g:color>` : ''}
            ${material ? `
            <g:material>${escapeXml(material)}</g:material>` : ''}
      ${productType ? `
      <g:product_type>${escapeXml(productType)}</g:product_type>` : ''}
      ${shippingWeight ? `
      <g:shipping_weight>${escapeXml(shippingWeight)}</g:shipping_weight>` : ''}
      ${shippingLength ? `
      <g:shipping_length>${escapeXml(shippingLength)}</g:shipping_length>` : ''}
      ${shippingWidth ? `
      <g:shipping_width>${escapeXml(shippingWidth)}</g:shipping_width>` : ''}
      ${shippingHeight ? `
      <g:shipping_height>${escapeXml(shippingHeight)}</g:shipping_height>` : ''}
    </item>`;
}

/**
 * Génère le flux XML complet pour Google Merchant Center
 */
export function generateProductFeed(
    products: ProductWithCategory[],
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