const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Début du seed...');

    // Nettoyer la base de données
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    
    // --- Catégories ---
    const pochetteBandoulière = await prisma.category.create({
        data: { name: 'Pochettes bandoulière', slug: 'pochette-bandoulière' }
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
                images: JSON.stringify([
                    'http://localhost:3001/uploads/pochette-bandouliere-liege-et-cuir-3.jpg',
                    'http://localhost:3001/uploads/pochette-bandouliere-liege-et-cuir-4.jpg',
                    'http://localhost:3001/uploads/pochette-bandouliere-liege-et-cuir-5.jpg'
                ]),
                categoryId: pochetteBandoulière.id
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
                images: JSON.stringify([
                    'http://localhost:3001/uploads/pochette-liege-poissons-1.jpg',
                    'http://localhost:3001/uploads/pochette-liege-poissons-2.jpg',
                    'http://localhost:3001/uploads/pochette-liege-poissons-3.jpg'
                ]),
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
                images: JSON.stringify([
                    'http://localhost:3001/uploads/sac-bandouliere-suedine-jaune-3.png',
                    'http://localhost:3001/uploads/sac-bandouliere-suedine-jaune-4.png',
                    'http://localhost:3001/uploads/sac-bandouliere-suedine-jaune-5.png'
                ]),
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
                images: JSON.stringify([
                    'http://localhost:3001/uploads/sac-medium-simili-bleu-suedine-beige-2.jpg',
                    'http://localhost:3001/uploads/sac-medium-simili-bleu-suedine-beige-3.jpg',
                    'http://localhost:3001/uploads/sac-medium-simili-bleu-suedine-beige-4.jpg'
                ]),
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
                images: JSON.stringify([
                    'http://localhost:3001/uploads/sac-cabas-liege-simili-camel-1.jpg',
                    'http://localhost:3001/uploads/sac-cabas-liege-simili-camel-2.jpg',
                    'http://localhost:3001/uploads/sac-cabas-liege-simili-camel-3.jpg'
                ]),
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
                images: JSON.stringify([
                    'http://localhost:3001/uploads/sac-trapeze-fausse-fourrure-zebre-8.jpg',
                    'http://localhost:3001/uploads/sac-trapeze-fausse-fourrure-zebre-41.jpg',
                    'http://localhost:3001/uploads/sac-trapeze-fausse-fourrure-zebre-51.jpg'
                ]),
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
                images: JSON.stringify([
                    'http://localhost:3001/uploads/sac-tubulaire-lucie-1.jpg',
                    'http://localhost:3001/uploads/sac-tubulaire-lucie-2.jpg',
                    'http://localhost:3001/uploads/sac-tubulaire-lucie-3.jpg'
                ]),
                categoryId: sacTubulaire.id
            }
        ]
    });
}

main()
    .then(() => console.log('Seed terminée'))
    .catch((e) => console.error(e))
    .finally(() => prisma.$disconnect());
