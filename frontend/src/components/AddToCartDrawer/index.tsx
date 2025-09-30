"use client";

import AddToCartButton from "@/components/AddToCartButton";

export default function AddToCartDrawer({ product }: { product: any }) {

    return (
        <AddToCartButton product={product} />
    );
}
