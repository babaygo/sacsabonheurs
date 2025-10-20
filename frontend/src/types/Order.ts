import { User } from "better-auth";
import { OrderItem } from "./OrderItem";
import { OrderStatusType } from "./OrderStatusType";

export interface Order {
    id: number;
    userId: string;
    user: User;
    stripeSessionId: string;
    email: string;
    phone?: string;
    total: number;
    subtotal?: number;
    shippingOption?: string;
    shippingCost?: number;
    taxes?: number;
    deliveryMethod?: string;
    relayId?: string;
    relayName?: string;
    relayAddress?: string;
    trackingNumber?: string
    trackingUrl?: string
    labelUrl?: string
    billingAddress?: string;
    detailsBillingAddress?: string;
    postalCode?: string;
    city?: string;
    country?: string;
    createdAt: string;
    status: OrderStatusType
    items: OrderItem[];
}
