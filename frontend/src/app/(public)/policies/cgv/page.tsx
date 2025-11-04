import { getBaseUrl } from "@/lib/utils/getBaseUrl";
import BreadCrumb from "@/components/shared/BreadCrumb";

export const metadata = {
    title: "Conditions générales de vente - Sacs à Bonheur",
    description: "Consultez nos conditions générales de vente pour mieux comprendre vos droits et obligations.",
};

export default async function CGVPage() {
    let cgv = "";

    try {
        const res = await fetch(`${getBaseUrl()}/api/admin/legal`);

        if (!res.ok) {
            return (
                <div className="min-h-screen pt-4 text-center text-red-500">
                    Impossible de charger les conditions générales de vente.
                </div>
            );
        }

        const data = await res.json();
        cgv = data.cgv || "";
    } catch (error: any) {
        cgv = "Impossible de charger les conditions générales de vente.";
    }

    return (
        <div className="min-h-screen pt-4">
            <BreadCrumb
                items={[
                    { label: "Accueil", href: "/" },
                    { label: "Conditions générales de vente" },
                ]}
            />
            <h1 className="text-2xl font-bold mb-4">Conditions générales de vente</h1>
            <div
                className="prose prose-sm max-w-none py-4"
                dangerouslySetInnerHTML={{ __html: cgv }}
            />
        </div>
    );
}