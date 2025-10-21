import { Suspense } from "react";
import ChooseRelayClient from "./ChooseRelayClient";
import { Spinner } from "@/components/ui/spinner";

export default async function ChooseRelayPage() { 
  return (
    <Suspense fallback={<div className="max-w-xl mx-auto mt-10"><Spinner /></div>}>
      <ChooseRelayClient brandId={process.env.MONDIAL_RELAY_BRAND_ID!} />
    </Suspense>
  );
}
