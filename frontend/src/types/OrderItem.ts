import { Order } from "./Order";
import { Product } from "./Product";

export interface OrderItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
    imageUrl?: string;
    orderId: number;
    order: Order;
    productId?: number;
    product?: Product;
}