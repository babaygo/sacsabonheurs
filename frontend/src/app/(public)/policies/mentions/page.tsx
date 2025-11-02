import { getBaseUrl } from "@/lib/utils/getBaseUrl";
import BreadCrumb from "@/components/shared/BreadCrumb";

export const metadata = {
    title: "Mentions légales - Sacs à Bonheur",
    description: "Consultez les mentions légales du site Sacs à Bonheur : informations légales, hébergeur, propriété intellectuelle.",
};

export default async function MentionsLegalesPage() {
    let mentions = "";

    try {
        const res = await fetch(`${getBaseUrl()}/api/admin/legal`, {
            cache: "no-store",
            next: { revalidate: 604800 }
        });

        if (!res.ok) {
            return (
                <div className="min-h-screen pt-4 text-center text-red-500">
                    Impossible de charger les mentions légales.
                </div>
            );
        }

        const data = await res.json();
        mentions = data.mentions || "";
    } catch (error: any) {
        console.error("Erreur Mentions légales :", error.message);
        mentions = "Impossible de charger les mentions légales.";
    }

    return (
        <div className="min-h-screen pt-4">
            <BreadCrumb
                items={[
                    { label: "Accueil", href: "/" },
                    { label: "Mentions légales" },
                ]}
            />
            <h1 className="text-2xl font-bold">Mentions légales</h1>
            <div
                className="prose prose-sm max-w-none py-4"
                dangerouslySetInnerHTML={{ __html: mentions }}
            />
        </div>
    );
}
