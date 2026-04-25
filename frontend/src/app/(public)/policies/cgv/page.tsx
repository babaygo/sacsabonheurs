import { getBaseUrl } from "@/lib/utils/getBaseUrl";
import BreadCrumb from "@/components/shared/BreadCrumb";
import { normalizeRichTextContent } from "@/lib/utils/richText";

export const metadata = {
    title: "Conditions générales de vente - Sacs à Bonheur",
    description: "Consultez nos conditions générales de vente pour mieux comprendre vos droits et obligations.",
    robots: { index: false, follow: false },
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
            <h1>Conditions générales de vente</h1>
            <div
                className="rich-content py-4"
                dangerouslySetInnerHTML={{ __html: normalizeRichTextContent(cgv) }}
            />
        </div>
    );
}