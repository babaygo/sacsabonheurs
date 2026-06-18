/**
 * FAQ éditoriales par collection, utilisées à la fois pour :
 *  - le bloc FAQ visible affiché en bas de la page collection ;
 *  - les données structurées JSON-LD FAQPage injectées côté serveur.
 *
 * Le contenu visible et le schema sont générés à partir de la MÊME source
 * (cette table), ce qui garantit qu'ils restent synchronisés — condition
 * requise par Google pour l'éligibilité aux rich snippets FAQ.
 *
 * Pour ajouter une FAQ à une autre collection, il suffit d'ajouter une entrée
 * dont la clé correspond au slug de la collection.
 */

export interface FaqItem {
    question: string;
    answer: string;
}

const COLLECTION_FAQ: Record<string, FaqItem[]> = {
    liege: [
        {
            question: "Le liège est-il vraiment vegan et écologique ?",
            answer:
                "Oui. Le liège est récolté sur l'écorce du chêne-liège sans jamais abattre l'arbre, qui se régénère naturellement. C'est une matière 100 % végétale, renouvelable et entièrement vegan : nos sacs en liège ne contiennent aucune matière d'origine animale et constituent une véritable alternative au cuir.",
        },
        {
            question: "Où sont fabriqués vos sacs en liège ?",
            answer:
                "Tous nos sacs en liège sont cousus à la main dans notre atelier de Saint-Nazaire, en Loire-Atlantique. Le liège est sourcé au Portugal et en France, puis travaillé une pièce à la fois. Chaque sac est donc un produit artisanal et made in France.",
        },
        {
            question: "Un sac en liège est-il résistant et imperméable ?",
            answer:
                "Le liège est étonnamment léger, résistant et naturellement imperméable. Il ne craint pas les éclaboussures et vieillit en développant une belle patine. C'est une matière idéale pour un usage quotidien, conçue pour durer plusieurs années.",
        },
        {
            question: "Comment entretenir un sac en liège ?",
            answer:
                "L'entretien est très simple : il suffit de passer un chiffon doux légèrement humide sur la surface, sans produit agressif ni détergent. Évitez de frotter trop fort et laissez sécher à l'air libre, à l'écart d'une source de chaleur directe.",
        },
        {
            question: "Vos sacs en liège sont-ils des pièces uniques ?",
            answer:
                "Oui. Chaque sac est fabriqué en quantité très limitée, le plus souvent en exemplaire unique. Les légères variations de grain et de teinte du liège sont la signature de la matière naturelle et de la main qui la façonne : aucun modèle n'est jamais reproduit exactement à l'identique.",
        },
    ],
    velours: [
        {
            question: "Le velours est-il une matière fragile pour un sac ?",
            answer:
                "Non, à condition d'en prendre soin. Le velours que j'utilise est dense et résistant ; associé à des finitions en simili cuir, il supporte très bien un usage quotidien. Il suffit d'éviter l'humidité prolongée et les frottements répétés.",
        },
        {
            question: "Comment entretenir un sac en velours ?",
            answer:
                "Un brossage doux à sec, dans le sens du poil, suffit à raviver l'aspect du velours et à retirer les poussières. Évitez l'eau et le nettoyage agressif ; en cas de tache, tamponnez délicatement sans frotter.",
        },
        {
            question: "Vos sacs en velours sont-ils faits main ?",
            answer:
                "Oui. Chaque sac en velours est coupé, assemblé et cousu à la main dans mon atelier de Saint-Nazaire, en Loire-Atlantique, le plus souvent en exemplaire unique.",
        },
        {
            question: "Le velours convient-il à toutes les saisons ?",
            answer:
                "Le velours est particulièrement chaleureux à l'automne et en hiver, mais ses coloris profonds s'accordent à toutes les saisons. C'est une matière intemporelle qui apporte une touche d'élégance toute l'année.",
        },
        {
            question: "Pourquoi associer le velours au simili cuir ?",
            answer:
                "Le simili cuir structure le sac, protège les zones d'usure et facilite l'entretien, tandis que le velours apporte la douceur et le caractère. Cette association allie esthétique et durabilité.",
        },
    ],
    "simili-cuir": [
        {
            question: "Le simili cuir est-il vegan ?",
            answer:
                "Oui. Le simili cuir ne contient aucune matière d'origine animale : il reproduit l'aspect et la tenue du cuir tout en étant une alternative végane, idéale pour celles qui veulent un beau sac sans cuir.",
        },
        {
            question: "Un sac en simili cuir est-il résistant ?",
            answer:
                "Oui. Le simili cuir est robuste, garde sa forme et résiste bien aux petits accrocs du quotidien. Cousu à la main avec des finitions soignées, il est conçu pour durer.",
        },
        {
            question: "Comment entretenir un sac en simili cuir ?",
            answer:
                "L'entretien est très simple : un chiffon doux légèrement humide suffit à nettoyer la surface. Évitez les produits agressifs et séchez avec un chiffon sec.",
        },
        {
            question: "Le simili cuir craint-il la pluie ?",
            answer:
                "Le simili cuir résiste bien aux éclaboussures et à l'humidité légère, mieux que beaucoup de tissus. Il reste conseillé d'essuyer les gouttes et d'éviter une exposition prolongée à la pluie.",
        },
        {
            question: "Vos sacs en simili cuir sont-ils des pièces uniques ?",
            answer:
                "Oui. Chaque sac est fabriqué à la main en quantité très limitée, le plus souvent en exemplaire unique, dans mon atelier de Saint-Nazaire.",
        },
    ],
};

export function getCollectionFaq(slug: string): FaqItem[] | null {
    return COLLECTION_FAQ[slug] ?? null;
}

/** Construit l'objet JSON-LD FAQPage à partir d'une liste de questions. */
export function buildFaqSchema(faq: FaqItem[]) {
    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faq.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
                "@type": "Answer",
                text: item.answer,
            },
        })),
    };
}
