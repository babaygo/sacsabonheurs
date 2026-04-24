import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const connectionString = `${process.env.DATABASE_URL}`

const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
    console.log('Début du seed...');

    // Nettoyer la base de données
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.article.deleteMany();
    await prisma.collection.deleteMany();

    // --- Collections ---
    await prisma.collection.createMany({
        data: [
            {
                slug: 'liege',
                title: 'Le Liège',
                subtitle: 'Naturel & Vegan',
                heroImage: "https://media.sacsabonheurs.fr/images-collections/liege.webp",
                material: 'liège',
                excerpt: 'Une matière d\'exception récoltée sur l\'écorce du chêne-liège. Légère, imperméable et 100 % vegan, elle incarne une mode responsable et intemporelle.',
                description: JSON.stringify([
                    "Le liège est l'une des matières les plus fascinantes qui soit : récoltée sur l'écorce du chêne-liège sans abattre l'arbre, c'est une ressource renouvelable, 100 % naturelle et entièrement vegan. Sa texture chaleureuse et ses reflets dorés en font une matière d'exception, idéale pour confectionner des sacs à la fois beaux et responsables.",
                    "Dans mon atelier à Saint-Nazaire, je travaille le liège avec soin, en valorisant ses nuances naturelles. Chaque pièce est unique : les légères variations de grain et de couleur sont la signature de la matière et de la main qui la façonne.",
                    "Léger, imperméable et résistant, le liège vieillit avec élégance et développe une belle patine au fil du temps. C'est une matière qui raconte une histoire — celle d'une mode plus responsable, enracinée dans la nature."
                ]),
                characteristics: JSON.stringify([
                    { label: 'Origine', value: 'Portugal & France' },
                    { label: 'Engagement', value: '100 % Vegan' },
                    { label: 'Entretien', value: 'Chiffon humide' },
                    { label: 'Fabrication', value: 'Faite main en Loire-Atlantique' }
                ]),
                metaTitle: 'Collection Liège — Sacs artisanaux naturels & vegan | Sacs à Bonheurs',
                metaDescription: 'Découvrez la collection Liège de Sacs à Bonheurs : des sacs artisanaux fabriqués en France avec du liège naturel, matière écologique, vegan et durable.',
                featured: true,
                order: 1,
            },
            {
                slug: 'jacquard',
                title: 'Le Jacquard',
                subtitle: 'Élégance Tissée',
                heroImage: "https://media.sacsabonheurs.fr/images-collections/jacquard.webp",
                material: 'jacquard',
                excerpt: 'Des motifs tissés au cœur de la matière, une densité luxueuse et une élégance qui traverse les saisons. Le jacquard est le tissu des pièces qui durent.',
                description: JSON.stringify([
                    "Le jacquard est un tissu d'exception, né d'une technique de tissage inventée au XIXe siècle. Ses motifs — floraux, géométriques ou abstraits — sont directement intégrés à la structure même du tissu, et non imprimés en surface. Le résultat : une matière dense, structurée, au rendu luxueux qui ne se démode jamais.",
                    "Je sélectionne mes jacquards auprès de tisserands français et européens, en privilégiant des compositions nobles : coton, lin, laine. Chaque rouleau de tissu est unique, et je ne propose jamais deux fois exactement le même modèle.",
                    "Porter un sac en jacquard, c'est choisir une pièce qui traverse les saisons avec élégance. Le tissu se bonifie avec le temps, les fils acquièrent du caractère, et chaque sac devient un objet de collection à part entière."
                ]),
                characteristics: JSON.stringify([
                    { label: 'Tissage', value: 'Jacquard traditionnel' },
                    { label: 'Composition', value: 'Coton, lin ou laine' },
                    { label: 'Entretien', value: 'Lavage à 30°C délicat' },
                    { label: 'Fabrication', value: 'Faite main en Loire-Atlantique' }
                ]),
                metaTitle: 'Collection Jacquard — Sacs artisanaux élégants & tissés | Sacs à Bonheurs',
                metaDescription: 'Explorez la collection Jacquard de Sacs à Bonheurs : des sacs artisanaux fabriqués à la main en France avec des tissus jacquard d\'excellence.',
                featured: true,
                order: 2,
            },
            {
                slug: 'suedine',
                title: 'La Suédine',
                subtitle: 'Douceur & Caractère',
                heroImage: "https://media.sacsabonheurs.fr/images-collections/suedine.webp",
                material: 'suédine',
                excerpt: 'Veloutée, souple et résolument moderne. La suédine séduit par son toucher chaleureux et ses tons profonds, parfaits pour un usage quotidien.',
                description: JSON.stringify([
                    "La suédine séduit immédiatement par son toucher doux et velouté. Inspirée du suède naturel mais fabriquée à partir de fibres synthétiques ou de microfibres, elle allie la douceur d'un cuir retourné à la légèreté d'un textile moderne. Son aspect mat et chaleureux lui confère une élégance décontractée très actuelle.",
                    "Je travaille la suédine dans des teintes soigneusement sélectionnées — des tons neutres et profonds qui s'accordent à toutes les tenues. La matière est suffisamment souple pour dessiner des formes généreuses, et suffisamment structurée pour conserver le galbe d'un beau sac.",
                    "Facile d'entretien et remarquablement résistante, la suédine est idéale pour un usage quotidien. Chaque sac de cette collection est une invitation à la douceur, du matin au soir."
                ]),
                characteristics: JSON.stringify([
                    { label: 'Matière', value: 'Suédine microfibre' },
                    { label: 'Toucher', value: 'Velouté & souple' },
                    { label: 'Entretien', value: 'Brosse douce à sec' },
                    { label: 'Fabrication', value: 'Faite main en Loire-Atlantique' }
                ]),
                metaTitle: 'Collection Suédine — Sacs artisanaux doux & caractère | Sacs à Bonheurs',
                metaDescription: 'Découvrez la collection Suédine de Sacs à Bonheurs : des sacs artisanaux fabriqués à la main en France avec de la suédine souple et douce.',
                featured: true,
                order: 3,
            },
        ]
    });

    // --- Catégories ---
    const pochetteBandoulière = await prisma.category.create({
        data: { name: 'Pochettes bandoulière', slug: 'pochette-bandouliere' }
    });

    const pochetteTelephone = await prisma.category.create({
        data: { name: 'Pochettes téléphone', slug: 'pochette-telephone' }
    });

    const sacAnses = await prisma.category.create({
        data: { name: 'Sacs anses ', slug: 'sac-anses' }
    });

    const sacBesace = await prisma.category.create({
        data: { name: 'Sacs besace ', slug: 'sac-besace' }
    });

    const sacCabas = await prisma.category.create({
        data: { name: 'Sacs cabas ', slug: 'sac-cabas' }
    });

    const sacTrapeze = await prisma.category.create({
        data: { name: 'Sacs trapèze ', slug: 'sac-trapeze' }
    });

    const sacTubulaire = await prisma.category.create({
        data: { name: 'Sacs tubulaire ', slug: 'sac-tubulaire' }
    });

    // --- Produit : Pochette bandoulière ---
    await prisma.product.createMany({
        data: [
            {
                name: 'Pochette bandoulière liège et cuir',
                slug: 'pochette-bandouliere-liege-cuir',
                description:
                    'Pochette bandoulière en liège naturel et cuir véritable. Parfaite pour vos sorties quotidiennes.',
                price: 30,
                stock: 1,
                images: [
                    'https://media.sacsabonheurs.fr/pochette-bandouliere-liege-et-cuir-3.jpg',
                    'https://media.sacsabonheurs.fr/pochette-bandouliere-liege-et-cuir-4.jpg',
                    'https://media.sacsabonheurs.fr/pochette-bandouliere-liege-et-cuir-5.jpg'
                ],
                categoryId: pochetteBandoulière.id
            }
        ]
    });

    // --- Articles ---
    await prisma.article.createMany({
        data: [
            {
                title: "Comment choisir un sac artisanal durable",
                slug: "choisir-sac-artisanal-durable",
                excerpt:
                    "Guide pratique pour choisir un sac artisanal qui dure dans le temps, sans compromis sur le style.",
                content:
                    "<p>Un sac artisanal durable repose sur des matieres robustes, des coutures solides et un design intemporel.</p><p>Regardez les finitions, la doublure, et privilegiez les petites series pour une meilleure qualite.</p>",
                image: "https://media.sacsabonheurs.fr/blog/sac-artisanal-durable.jpg",
                author: "Sacs a Bonheurs",
                category: "Conseils",
                keywords: "sac artisanal, durable, qualite, conseils",
                metaDescription:
                    "Conseils simples pour choisir un sac artisanal durable et elegant.",
                readingTime: 4,
                published: true
            },
            {
                title: "Les tendances sacs pour la saison",
                slug: "tendances-sacs-saison",
                excerpt:
                    "Couleurs, matieres et formes: les grandes tendances sacs a adopter cette saison.",
                content:
                    "<p>Les tons naturels et les textures douces dominent, avec une preference pour les formats pratiques.</p><p>Les details en liege et les finitions minimalistes apportent une touche chic.</p>",
                image: "https://media.sacsabonheurs.fr/blog/tendances-sacs-saison.jpg",
                author: "Sacs a Bonheurs",
                category: "Tendances",
                keywords: "tendances, sacs, saison, mode",
                metaDescription:
                    "Decouvrez les tendances sacs de la saison: couleurs, matieres et formats.",
                readingTime: 5,
                published: true
            },
            {
                title: "Pourquoi le liege est un materiau d'avenir",
                slug: "liege-materiau-avenir",
                excerpt:
                    "Le liege est leger, resistant et responsable. Decouvrez ses avantages.",
                content:
                    "<p>Le liege est un materiau naturel, renouvelable et tres resilient.</p><p>Il est ideal pour des accessoires du quotidien, faciles a entretenir.</p>",
                image: "https://media.sacsabonheurs.fr/blog/liege-materiau-avenir.jpg",
                author: "Sacs a Bonheurs",
                category: "Materiaux",
                keywords: "liege, materiau, durable, eco",
                metaDescription:
                    "Les atouts du liege pour des sacs esthetiques et durables.",
                readingTime: 3,
                published: true
            },
            {
                title: "Entretenir son sac en cuir au quotidien",
                slug: "entretenir-sac-cuir",
                excerpt:
                    "Les bons gestes pour garder votre sac en cuir propre et beau plus longtemps.",
                content:
                    "<p>Nettoyez delicatement avec un chiffon doux et utilisez un lait d'entretien adapte.</p><p>Evitez l'exposition prolongee au soleil et a l'humidite.</p>",
                image: "https://media.sacsabonheurs.fr/blog/entretenir-sac-cuir.jpg",
                author: "Sacs a Bonheurs",
                category: "Entretien",
                keywords: "cuir, entretien, sac, conseils",
                metaDescription:
                    "Astuces simples pour entretenir un sac en cuir et prolonger sa duree de vie.",
                readingTime: 4,
                published: true
            },
            {
                title: "Comment porter un sac cabas avec style",
                slug: "porter-sac-cabas-style",
                excerpt:
                    "Des idees de looks pour porter un sac cabas au quotidien, sans faute de gout.",
                content:
                    "<p>Le sac cabas s'associe parfaitement a des tenues casual chic.</p><p>Jouez sur les contrastes de matieres pour un look equilibre.</p>",
                image: "https://media.sacsabonheurs.fr/blog/porter-sac-cabas-style.jpg",
                author: "Sacs a Bonheurs",
                category: "Style",
                keywords: "sac cabas, style, look, mode",
                metaDescription:
                    "Inspiration pour porter un sac cabas avec style et simplicite.",
                readingTime: 5,
                published: true
            }
        ]
    });

    // --- Produit : Pochette téléphone ---
    await prisma.product.createMany({
        data: [
            {
                name: 'Pochette téléphone poissons en liège',
                slug: 'pochette-telephone-poissons-liege',
                description:
                    'Pochette téléphone en liège naturel avec un motif de poissons colorés.',
                price: 25,
                stock: 1,
                images: [
                    'https://media.sacsabonheurs.fr/pochette-liege-poissons-1.jpg',
                    'https://media.sacsabonheurs.fr/pochette-liege-poissons-2.jpg',
                    'https://media.sacsabonheurs.fr/pochette-liege-poissons-3.jpg'
                ],
                categoryId: pochetteTelephone.id
            }
        ]
    });

    // --- Produit : Sac anses ---
    await prisma.product.createMany({
        data: [
            {
                name: 'Sac bandoulière suédine jaune',
                slug: 'sac-bandouliere-suedine-jaune',
                description:
                    'Sac bandoulière en suédine jaune. Parfait pour un look décontracté et élégant.',
                price: 65,
                stock: 1,
                images: [
                    'https://media.sacsabonheurs.fr/sac-bandouliere-suedine-jaune-3.png',
                    'https://media.sacsabonheurs.fr/sac-bandouliere-suedine-jaune-4.png',
                    'https://media.sacsabonheurs.fr/sac-bandouliere-suedine-jaune-5.png'
                ],
                categoryId: sacAnses.id
            }
        ]
    });

    // --- Produit : Sac besace ---
    await prisma.product.createMany({
        data: [
            {
                name: 'Sac besace simili bleu et suédine beige',
                slug: 'sac-besace-simili-bleu-suedine-beige',
                description:
                    'Sac besace en simili cuir bleu et suédine beige. Parfait pour un usage quotidien.',
                price: 55,
                stock: 1,
                images: [
                    'https://media.sacsabonheurs.fr/sac-medium-simil-bleu-et-suedine-beige-2.jpg',
                    'https://media.sacsabonheurs.fr/sac-medium-simil-bleu-et-suedine-beige-3.jpg',
                    'https://media.sacsabonheurs.fr/sac-medium-simil-bleu-et-suedine-beige-4.jpg'
                ],
                categoryId: sacBesace.id
            }
        ]
    });

    // --- Produit : Sac cabas ---
    await prisma.product.createMany({
        data: [
            {
                name: 'Sac cabas liège et simili camel',
                slug: 'sac-cabas-liege-simili-camel',
                description:
                    'Sac cabas en liège naturel et simili cuir camel. Parfait pour vos courses ou une journée à la plage.',
                price: 55,
                stock: 1,
                images: [
                    'https://media.sacsabonheurs.fr/sac-cabas-liege-et-simili-camel-1.jpg',
                    'https://media.sacsabonheurs.fr/sac-cabas-liege-et-simili-camel-6.jpg',
                    'https://media.sacsabonheurs.fr/sac-cabas-liege-et-simili-camel-8.jpg'
                ],
                categoryId: sacCabas.id
            }
        ]
    });

    // --- Produit : Sac trapèze ---
    await prisma.product.createMany({
        data: [
            {
                name: 'Sac trapèze fausse fourrure zèbre',
                slug: 'sac-trapeze-fausse-fourrure-zebre',
                description:
                    'Sac trapèze en fausse fourrure zèbre. Un accessoire tendance et éthique.',
                price: 48,
                stock: 1,
                images: [
                    'https://media.sacsabonheurs.fr/sac-trapeze-fausse-fourrure-zebre-8.jpg',
                    'https://media.sacsabonheurs.fr/sac-trapeze-fausse-fourrure-zebre-41.jpg',
                    'https://media.sacsabonheurs.fr/sac-trapeze-fausse-fourrure-zebre-51.jpg'
                ],
                categoryId: sacTrapeze.id
            }
        ]
    });

    // --- Produit : Sac tubulaire ---
    await prisma.product.createMany({
        data: [
            {
                name: 'Sac tubulaire blanc',
                slug: 'sac-tubulaire-blanc',
                description:
                    'Sac tubulaire blanc. Élégant et pratique pour toutes les occasions.',
                price: 72,
                stock: 1,
                images: [
                    'https://media.sacsabonheurs.fr/sac-tubulaire-lucie-1.jpg',
                    'https://media.sacsabonheurs.fr/sac-tubulaire-lucie-2.jpg',
                    'https://media.sacsabonheurs.fr/sac-tubulaire-lucie-3.jpg'
                ],
                categoryId: sacTubulaire.id
            }
        ]
    });
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
