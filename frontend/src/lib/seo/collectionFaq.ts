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
