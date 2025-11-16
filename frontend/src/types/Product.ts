import { Category } from "./Category";
import { OrderItem } from "./OrderItem";

export interface Product {
    id: number;
    name: string;
    slug: string;
    description: string;
    price: number;
    stock: number;
    weight: number;
    height: number;
    lenght: number;
    width: number;
    images: string[];
    categoryId: number;
    category: Category;
    orderItems: OrderItem[];
    createdAt: Date;
    updatedAt: Date;
    hidden: boolean;
    color: string;
    material: string;
}
