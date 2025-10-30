import { useCartDrawerStore } from "../lib/stores/cartDrawerStore";
import { useCartStore } from "../lib/stores/cartStore";


export function useCart() {
    const items = useCartStore((s: any) => s.items);
    const addToCart = useCartStore((s: any) => s.addToCart);
    const removeFromCart = useCartStore((s: any) => s.removeFromCart);
    const clearCart = useCartStore((s: any) => s.clearCart);

    const open = useCartDrawerStore((s: any) => s.open);
    const setOpen = useCartDrawerStore((s: any) => s.setOpen);

    const total = items.reduce((acc: number, item: { price: number; quantity: number; }) => acc + item.price * item.quantity, 0);
    const count = items.reduce((acc: any, item: { quantity: any; }) => acc + item.quantity, 0);
    const isEmpty = items.length === 0;

    return {
        items,
        addToCart,
        removeFromCart,
        clearCart,
        open,
        setOpen,
        total,
        count,
        isEmpty,
    };
}
