import { Request, Response } from 'express';
import Stripe from 'stripe';
import { constructEventStripe, getLineItems, getDeliveryMode } from '../lib/stripe.js';
import { prisma } from '../lib/prisma.js';
import { getImageUrl } from '../lib/utils.js';
import { sendEmail } from '../lib/email.js';

export async function webhookHandler(req: Request, res: Response) {
    let event: Stripe.Event;
    try {
        event = constructEventStripe(req.body, req.headers['stripe-signature']!);
    } catch (err: any) {
        console.error('Webhook signature error:', err);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session: Stripe.Checkout.Session = event.data.object as any;
        const lineItems = await getLineItems(session.id);
        const slugs: string[] = JSON.parse(session.metadata!.slugs);
        const billingAddress = session.customer_details?.address;

        await prisma.product.updateMany({ where: { slug: { in: slugs } }, data: { stock: { decrement: 1 } } });

        const items = await Promise.all(
            lineItems.data.map(async (item, index) => ({
                name: item.description ?? 'Produit inconnu',
                price: item.amount_total ? item.amount_total / 100 : 0,
                quantity: item.quantity ?? 1,
                imageUrl: await getImageUrl(slugs[index]),
                productId: await prisma.product.findFirst({ where: { slug: slugs[index] } }).then(p => p?.id),
            }))
        );

        const shippingRateId = session.shipping_cost?.shipping_rate;
        if (!shippingRateId) {
            console.warn('Aucun shippingRateId trouvé dans la session.');
            return null as any;
        }

        const deliveryMode = await getDeliveryMode(shippingRateId.toString());
        if (!deliveryMode) console.warn('Aucun deliveryMode trouvé pour le shippingRateId :', shippingRateId);

        try {
            const order = await prisma.order.create({ data: {
                stripeSessionId: session.id,
                user: { connect: { id: session.metadata!.userId } },
                email: session.customer_email!,
                phone: session.customer_details?.phone ?? null,
                total: session.amount_total! / 100,
                subtotal: session.amount_subtotal! / 100,
                shippingOption: deliveryMode ?? '24R',
                shippingCost: session.total_details?.amount_shipping! / 100,
                taxes: session.total_details?.amount_tax,
                deliveryMethod: session.metadata?.deliveryMethod ?? null,
                relayId: session.metadata?.relayId ?? null,
                relayName: session.metadata?.relayName ?? null,
                relayAddress: session.metadata?.relayAddress ?? null,
                billingAddress: billingAddress?.line1 ?? null,
                detailsBillingAddress: billingAddress?.line2 ?? null,
                postalCode: billingAddress?.postal_code ?? null,
                city: billingAddress?.city ?? null,
                country: billingAddress?.country ?? 'FR',
                items: { create: items }
            }});

            await sendEmail({
                from: process.env.MAIL_BOUTIQUE!,
                html: `<h1>Une nouvelle commande a été passée.</h1><p><a href="${process.env.URL_FRONT}/admin/orders/${order.id}">Accéder à la commande</a></p>`,
                subject: 'Nouvelle commande !',
                to: process.env.MAIL_OWNER!
            });
        } catch (error: any) {
            console.error("Erreur sur la création d'une commande :", error);
            return res.status(200).json({ received: true, error: 'Internal processing error' });
        }
    }

    res.status(200).json({ received: true });
}
