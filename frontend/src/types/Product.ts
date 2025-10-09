import { Category } from "./Category";

export interface Product {
    id: number;
    name: String;
    slug: String;
    description: String;
    price: number;
    stock: number;
    weight: number;
    height: number;
    lenght: number;
    width: number;
    images: any;
    categoryId: number;
    category: Category;
    createdAt: Date;
    updatedAt: Date;
}
