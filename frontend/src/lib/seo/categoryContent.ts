/**
 * Contenu éditorial indexable pour les pages catégories (/category/[slug]).
 *
 * Les catégories proviennent de la base de données et ne portent qu'un `name`.
 * Ce helper fournit, par slug, un H1 enrichi (riche en mots-clés) et un ou
 * plusieurs paragraphes d'introduction à afficher au-dessus de la grille.
 *
 * Pour toute catégorie non listée ici, `getCategoryContent` génère un repli
 * générique à partir du nom afin que chaque page catégorie dispose malgré tout
 * d'un texte d'introduction unique et indexable.
 */

export interface CategoryContent {
    /** H1 enrichi affiché en haut de la page. */
    heading: string;
    /** Paragraphes d'introduction (texte éditorial indexable). */
    intro: string[];
}

const CATEGORY_CONTENT: Record<string, CategoryContent> = {
    "pochette-bandouliere": {
        heading: "Pochettes bandoulière femme faites main",
        intro: [
            "Découvrez nos pochettes bandoulière femme, cousues à la main dans notre atelier de Saint-Nazaire. Légères et mains libres, elles accompagnent vos sorties du quotidien comme vos soirées, en liège vegan, jacquard ou suédine.",
            "Chaque pochette est une pièce unique, fabriquée en quantité limitée et jamais reproduite à l'identique. Une alternative responsable et made in France aux accessoires de série, à un prix accessible.",
        ],
    },
    "pochette-telephone": {
        heading: "Pochettes téléphone bandoulière faites main",
        intro: [
            "Nos pochettes téléphone bandoulière sont pensées pour l'essentiel : votre smartphone, vos cartes et vos clés, gardés près de vous, les mains libres. Un mini-sac pratique, cousu main à Saint-Nazaire en liège vegan, jacquard ou suédine.",
            "Produit d'appel idéal pour offrir, chaque pochette est une création unique fabriquée en France, durable et à petit prix.",
        ],
    },
    "sac-anses": {
        heading: "Sacs à anses faits main en France",
        intro: [
            "Nos sacs à anses allient élégance et praticité au quotidien. Cousus à la main à Saint-Nazaire en liège vegan, jacquard ou suédine, ils se portent à la main ou à l'épaule selon vos envies.",
            "Chaque sac est une pièce unique, fabriquée en série très limitée et jamais reproduite à l'identique : une création artisanale, responsable et made in France.",
        ],
    },
    "sac-besace": {
        heading: "Sacs besace bandoulière faits main",
        intro: [
            "Le sac besace, porté en bandoulière, est l'allié des journées chargées : pratique, spacieux et facile à vivre. Nos besaces sont cousues main à Saint-Nazaire en liège vegan, jacquard ou suédine.",
            "Chaque besace est une pièce unique fabriquée en France, conçue pour durer et pensée comme une alternative responsable aux sacs de série.",
        ],
    },
    "sac-cabas": {
        heading: "Sacs cabas en tissu faits main",
        intro: [
            "Nos sacs cabas réunissent volume et style pour le quotidien, le marché ou la plage. Cousus à la main à Saint-Nazaire en jacquard, suédine ou liège vegan, ils se portent à l'épaule en toute saison.",
            "Chaque cabas est une création unique, fabriquée en quantité limitée et jamais reproduite à l'identique : un sac artisanal, durable et made in France à prix accessible.",
        ],
    },
    "sac-trapeze": {
        heading: "Sacs trapèze faits main en France",
        intro: [
            "Le sac trapèze, à la silhouette structurée et féminine, apporte une touche d'élégance à toutes vos tenues. Nos modèles sont cousus main à Saint-Nazaire en liège vegan, jacquard ou suédine.",
            "Chaque sac trapèze est une pièce unique fabriquée en France, en série très limitée : une création artisanale et responsable, jamais reproduite à l'identique.",
        ],
    },
    "sac-tubulaire": {
        heading: "Sacs tubulaires faits main",
        intro: [
            "Nos sacs tubulaires séduisent par leur forme arrondie et moderne, idéale pour un look affirmé. Cousus à la main à Saint-Nazaire en liège vegan, jacquard ou suédine, ils sont aussi originaux que pratiques.",
            "Chaque sac est une pièce unique, fabriquée en quantité limitée et jamais reproduite : une création artisanale, durable et made in France.",
        ],
    },
};

/**
 * Retourne le contenu éditorial d'une catégorie.
 * À défaut d'entrée dédiée, génère un repli générique à partir du nom.
 */
export function getCategoryContent(slug: string, name: string): CategoryContent {
    const dedicated = CATEGORY_CONTENT[slug];
    if (dedicated) return dedicated;

    const label = name.trim();
    const lower = label.toLowerCase();
    return {
        heading: `${label} artisanaux faits main`,
        intro: [
            `Découvrez notre sélection de ${lower} cousus à la main dans notre atelier de Saint-Nazaire, en liège vegan, jacquard ou suédine. Des pièces élégantes, durables et responsables, fabriquées en France.`,
            "Chaque création est unique, fabriquée en quantité limitée et jamais reproduite à l'identique, à un prix accessible.",
        ],
    };
}
