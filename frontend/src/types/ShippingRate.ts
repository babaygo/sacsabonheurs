export type ShippingRate = {
    id: string;
    object: "shipping_rate";
    active: boolean;
    created: number;
    display_name: string;
    fixed_amount?: {
        amount: number;
        currency: string;
    };
    type: "fixed_amount" | "calculated";
    delivery_estimate?: {
        minimum?: {
            unit: "business_day" | "day";
            value: number;
        };
        maximum?: {
            unit: "business_day" | "day";
            value: number;
        };
    };
    tax_behavior: "inclusive" | "exclusive" | "unspecified";
    tax_code?: string | null;
    metadata?: Record<string, string>;
};
