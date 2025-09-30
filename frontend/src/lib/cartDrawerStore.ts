import { create } from "zustand";

type CartDrawerState = {
    open: boolean;
    setOpen: (open: boolean) => void;
};

export const useCartDrawerStore = create<CartDrawerState>((set) => ({
    open: false,
    setOpen: (open: boolean) => set({ open }),
}));
