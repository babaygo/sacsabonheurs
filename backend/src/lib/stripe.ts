import { User } from "@prisma/client";
import Stripe from "stripe";

const stripe =  new Stripe(process.env.STRIPE_SECRET_KEY!);

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

export async function createStripeShippingRate(data: {
    display_name: string;
    amount: number;
    currency?: string;
    min_delivery?: number;
    max_delivery?: number;
    metadata?: any;
    tax_behavior?: "exclusive" | "inclusive" | "unspecified";
    tax_code?: string;
}): Promise<Stripe.Response<Stripe.ShippingRate>> {
    try {
        const shippingRate = await stripe.shippingRates.create({
            display_name: data.display_name,
            type: "fixed_amount",
            fixed_amount: {
                amount: data.amount,
                currency: data.currency ?? "eur",
            },
            delivery_estimate:
                data.min_delivery && data.max_delivery
                    ? {
                        minimum: { unit: "business_day", value: data.min_delivery },
                        maximum: { unit: "business_day", value: data.max_delivery },
                    }
                    : undefined,
            metadata: data.metadata,
            tax_behavior: data.tax_behavior ?? "inclusive",
            tax_code: data.tax_code ?? undefined,
        });

        return shippingRate;
    } catch (error: any) {
        console.error("Erreur lors de la création du shipping rate :", error);
        throw new Error("Impossible de créer le shipping rate Stripe");
    }
}

export async function getDeliveryMode(shippingRateId: string): Promise<string> {
    const shippingRate = await stripe.shippingRates.retrieve(shippingRateId);
    return shippingRate.metadata.ColLivMod;
}

export async function createCheckout(
    user: User,
    shipping_options: Stripe.Checkout.SessionCreateParams.ShippingOption[] | undefined,
    relay: any,
    slugs: any,
    items: any
): Promise<Stripe.Response<Stripe.Checkout.Session>> {
    const subtotal = items.reduce((sum: number, item: any) => {
        return sum + (item.price * item.quantity);
    }, 0);

    const isFreeShipping = subtotal >= 65;
    let finalShippingOptions: Stripe.Checkout.SessionCreateParams.ShippingOption[];

    if (isFreeShipping) {
        finalShippingOptions = [{
            shipping_rate_data: {
                type: 'fixed_amount',
                fixed_amount: {
                    amount: 0,
                    currency: 'eur',
                },
                display_name: 'Livraison gratuite - Mondial Relay',
                delivery_estimate: {
                    minimum: {
                        unit: 'business_day',
                        value: 3,
                    },
                    maximum: {
                        unit: 'business_day',
                        value: 5,
                    },
                },
                metadata: {
                    type: 'mondial_relay',
                    free_shipping: 'true'
                }
            },
        }];
    } else {
        finalShippingOptions = shipping_options || [];
    }

    const checkout = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        payment_method_options: {
            card: {
                request_three_d_secure: "automatic"
            }
        },
        billing_address_collection: 'required',
        shipping_address_collection: {
            allowed_countries: ["FR"]
        },
        mode: "payment",
        customer_email: user.email,
        phone_number_collection: { enabled: true },
        automatic_tax: { enabled: true },
        shipping_options: finalShippingOptions,
        metadata: {
            userId: user.id,
            deliveryMethod: "mondial_relay",
            relayId: relay?.id,
            relayName: relay?.name,
            relayAddress: relay?.address,
            slugs: JSON.stringify(slugs),
            freeShipping: isFreeShipping ? "true" : "false"
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

export async function updateShippingRate(rateId: string, metadata: Stripe.Emptyable<Stripe.MetadataParam> | undefined) {
    await stripe.shippingRates.update(rateId, {
        metadata: { ...metadata },
    });
}

export async function archiveShippingRate(rateId: string, active: boolean | undefined) {
    await stripe.shippingRates.update(rateId, {
        active: active
    });
}