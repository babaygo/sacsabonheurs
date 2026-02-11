import { getBaseUrl } from "@/lib/utils/getBaseUrl";
import BreadCrumb from "@/components/shared/BreadCrumb";

export const metadata = {
    title: "Mentions légales - Sacs à Bonheur",
    description: "Consultez les mentions légales du site Sacs à Bonheur : informations légales, hébergeur, propriété intellectuelle.",
};

export default async function MentionsLegalesPage() {
    let mentions = "";

    try {
        const res = await fetch(`${getBaseUrl()}/api/admin/legal`);

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
            <h1>Mentions légales</h1>
            <div
                className="prose prose-sm max-w-none py-4"
                dangerouslySetInnerHTML={{ __html: mentions }}
            />
        </div>
    );
}
