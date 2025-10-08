import { OrderItem } from "./OrderItem";

export interface Order {
    id: number;
    email: string;
    total: number;
    createdAt: string;
    items: OrderItem[];
}