import BreadCrumb from "@/components/shared/BreadCrumb";

export default function FAQPage() {
    return (
        <div className="min-h-screen pt-4">
            <BreadCrumb
                items={[
                    { label: "Accueil", href: "/" },
                    { label: "FAQ", }
                ]}
            />
            <h1 className="text-2xl font-bold">FAQ</h1>
        </div>
    );
}