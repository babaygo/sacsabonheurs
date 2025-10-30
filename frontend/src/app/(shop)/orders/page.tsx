import OrdersClient from "@/components/features/Orders/OrdersClient";
import { Suspense } from "react";

export default function OrdersPage() {
  return (
    <Suspense fallback={<div>Chargement des commandes…</div>}>
      <OrdersClient />
    </Suspense>
  );
}
