import BreadCrumb from "@/components/shared/BreadCrumb";

export default function AProposPage() {
    return (
        <div className="min-h-screen pt-4">
            <BreadCrumb
                items={[
                    { label: "Accueil", href: "/" },
                    { label: "À propos", }
                ]}
            />
            <h1 className="text-2xl font-bold capitalize">à propos</h1>
            <p className="text-justify leading-7 pt-4"><strong>Qui suis je ?</strong><br />
                Bienvenue dans mon univers ! Je m'appelle <strong>Sophie</strong> et je suis passionnée de créations artisanales depuis toujours.
                J'ai commencé la couture en 2013 et je me suis vite spécialisée dans la couture de sacs et accessoires.
                J'apporte beaucoup d'attention et de soins à mes créations, et utilise des matériaux de qualité.
                Toutes mes créations sont des pièces uniques, dont je créé les patrons. Je vous souhaite une bonne visite !<br />

                <br /><strong>Quel est mon parcours ?</strong><br />
                J'ai travaillé longtemps dans le tourisme, puis après un licenciement économique, je me suis reconvertie dans le secteur médico-social. Mais j'ai toujours adoré créer de mes mains, et c'est ainsi que ma petite entreprise Sacs à Bonheurs est née !</p>
        </div>
    );
}
