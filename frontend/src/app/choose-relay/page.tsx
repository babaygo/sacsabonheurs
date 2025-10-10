import { Suspense } from "react";
import ChooseRelayClient from "./ChooseRelayClient";

export default function ChooseRelayPage() {
  return (
    <Suspense fallback={<div>Chargement du widget…</div>}>
      <ChooseRelayClient />
    </Suspense>
  );
}
