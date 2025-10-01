export interface Category {
    id: number;
    name: string;
    slug: string;
    products: {
        id: number;
        name: string;
        price: number;
        images: string;
    }[];
}