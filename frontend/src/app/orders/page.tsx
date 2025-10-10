import { Suspense } from "react";
import OrdersClient from "./OrdersClient";

export default function OrdersPage() {
  return (
    <Suspense fallback={<div>Chargement des commandes…</div>}>
      <OrdersClient />
    </Suspense>
  );
}
