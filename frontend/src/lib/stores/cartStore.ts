import { create } from "zustand";
import { persist, createJSONStorage, type StateStorage } from "zustand/middleware";

const noopStorage: StateStorage = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
};

type CartItem = {
    id: number;
    name: string;
    slug: string;
    price: number;
    quantity: number;
    image: string;
    originalPrice?: number;
    isOnSale?: boolean;
};

type CartState = {
    items: CartItem[];
    addToCart: (item: Omit<CartItem, "quantity">) => void;
    removeFromCart: (id: number) => void;
    clearCart: () => void;
};

export const useCartStore = create<CartState>()(
    persist(
        (set) => ({
            items: [],
            addToCart: (item) =>
                set((state) => {
                    const existing = state.items.find((i) => i.id === item.id);
                    if (existing) {
                        return {
                            items: state.items.map((i) =>
                                i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
                            ),
                        };
                    }
                    return {
                        items: [...state.items, { ...item, quantity: 1 }],
                    };
                }),
            removeFromCart: (id) =>
                set((state) => ({
                    items: state.items.filter((i) => i.id !== id),
                })),
            clearCart: () => set(() => ({ items: [] })),
        }),
        {
            name: "cart-storage",
            storage: createJSONStorage(() =>
                typeof window !== "undefined" ? window.localStorage : noopStorage
            ),
        }
    )
);
