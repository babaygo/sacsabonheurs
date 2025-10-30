import { Suspense } from "react";
import ResetPasswordClient from "../../../components/features/ResetPassword/ResetPasswordClient";

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<p className="text-center py-10">Chargement du formulaire...</p>}>
            <ResetPasswordClient />
        </Suspense>
    );
}
