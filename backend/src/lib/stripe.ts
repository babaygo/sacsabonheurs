import { User } from "@prisma/client";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export function constructEventStripe(payload: string | Buffer<ArrayBufferLike>, header: string | Buffer | Array<string>): Stripe.Event {
    return stripe.webhooks.constructEvent(payload, header, process.env.STRIPE_WEBHOOK_SECRET!);
}

export async function fetchStripeShippingRates(): Promise<Stripe.ShippingRate[]> {
    try {
        const rates = await stripe.shippingRates.list({
            active: true,
            limit: 100,
        });

        return rates.data;
    } catch (error: any) {
        console.error("Erreur lors de la récupération des shipping rates :", error);
        throw new Error("Impossible de récupérer les shipping rates Stripe");
    }
}

export async function getDeliveryMode(session: Stripe.Checkout.Session): Promise<string> {
    const shippingRateId = session.shipping_cost?.shipping_rate;
    const shippingRate = await stripe.shippingRates.retrieve(String(shippingRateId));
    return shippingRate.metadata.ColLivMod;
}

export async function createCheckout(user: User, shipping_options: Stripe.Checkout.SessionCreateParams.ShippingOption[] | undefined, relay: any, slugs: any, items: any): Promise<Stripe.Response<Stripe.Checkout.Session>> {
    const checkout = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        billing_address_collection: 'required',
        mode: "payment",
        customer_email: user.email,
        phone_number_collection: { enabled: true },
        automatic_tax: { enabled: true },
        shipping_options: shipping_options,
        metadata: {
            userId: user.id,
            deliveryMethod: "mondial_relay",
            relayId: relay?.id,
            relayName: relay?.name,
            relayAddress: relay?.address,
            slugs: JSON.stringify(slugs)
        },
        line_items: items.map((item: any) => ({
            price_data: {
                currency: "eur",
                product_data: {
                    name: item.name,
                    images: [item.image]
                },
                unit_amount: Math.round(item.price * 100),
            },
            quantity: item.quantity,
        })),
        success_url: process.env.URL_FRONT + "/choose-relay?session_id={CHECKOUT_SESSION_ID}&refresh=true",
        cancel_url: process.env.URL_FRONT + "/",
    });

    return checkout;
}

export async function getLineItems(session_id: string) {
    return stripe.checkout.sessions.listLineItems(session_id);
}