import { getBaseUrl } from "@/lib/getBaseUrl";
import BreadCrumb from "@/components/BreadCrumb";

export const metadata = {
    title: "Politique de confidentialité - Sacs à Bonheur",
    description:
        "Découvrez comment nous protégeons vos données personnelles sur sacsabonheur.fr. Transparence et respect de votre vie privée.",
};

export default async function PrivacyPolicyPage() {
    let privacy = "";
    try {
        const res = await fetch(`${getBaseUrl()}/api/admin/legal`, {
            cache: "no-store",
        });

        if (!res.ok) {
            return (
                <div className="min-h-screen pt-4 text-center text-red-500">
                    Impossible de charger la politique de confidentialité.
                </div>
            );
        }

        const data = await res.json();
        privacy = data.privacy || "";
    } catch (error: any) {
        console.error("Erreur Politique de confidentialité :", error.message);
        privacy = "Impossible de charger la politique de confidentialité.";
    }

    return (
        <div className="min-h-screen pt-4">
            <BreadCrumb
                items={[
                    { label: "Accueil", href: "/" },
                    { label: "Politique de confidentialité" },
                ]}
            />
            <h1 className="text-2xl font-bold">Politique de confidentialité</h1>
            <div
                className="prose prose-sm max-w-none py-4"
                dangerouslySetInnerHTML={{ __html: privacy }}
            />
        </div>
    );
}
