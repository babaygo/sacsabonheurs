import { Product } from "./Product";

export interface Category {
    id: number;
    name: string;
    slug: string;
    products: Product[];
}