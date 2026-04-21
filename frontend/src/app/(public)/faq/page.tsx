import BreadCrumb from "@/components/shared/BreadCrumb";
import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "@/components/ui/accordion";
import Link from "next/link";

export default function FAQPage() {
    return (
        <div className="min-h-screen pt-4">
            <BreadCrumb
                items={[
                    { label: "Accueil", href: "/" },
                    { label: "FAQ" },
                ]}
            />
            <h1 className="mb-6">FAQ</h1>
            <div className="space-y-8 [&_button]:font-montserrat [&_button]:text-base ">
                <section>
                    <h2 className="text-xl font-bold mb-2">Disponibilité</h2>
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="nouveaux-articles">
                            <AccordionTrigger>
                                Quand est-ce que les nouveaux articles sortent ?
                            </AccordionTrigger>
                            <AccordionContent>
                                Nous publions régulièrement de nouveaux articles, restez attentif aux annonces sur Instagram.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="rupture-stock">
                            <AccordionTrigger>
                                Les articles en rupture de stock vont-ils revenir ?
                            </AccordionTrigger>
                            <AccordionContent>
                                Tous les articles sont fabriqués une seule fois, il n'y a pas de réaprovisionnement prévu.
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </section>

                <section>
                    <h2 className="text-xl font-bold mb-2">Produits</h2>
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="defectueux">
                            <AccordionTrigger>Que faire si mon article est défectueux ?</AccordionTrigger>
                            <AccordionContent>
                                Contactez notre service client avec des photos du défaut.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="entretien">
                            <AccordionTrigger>Comment entretenir mes articles ?</AccordionTrigger>
                            <AccordionContent>
                                Consultez les instructions d'entretien fournies dans la description de chaque produit.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="infos-article">
                            <AccordionTrigger>Puis-je avoir plus d'informations sur un article ?</AccordionTrigger>
                            <AccordionContent>
                                Oui, chaque fiche produit contient des détails complets, dans la description.
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </section>

                <section>
                    <h2 className="text-xl font-bold mb-2">Livraison</h2>
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="zone-livraison">
                            <AccordionTrigger>Livrez-vous à l'international ?</AccordionTrigger>
                            <AccordionContent>
                                Les livraisons sont actuellement, disponible uniquement en France métropolitaine.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="prix-livraison">
                            <AccordionTrigger>La livraison est-elle gratuite ?</AccordionTrigger>
                            <AccordionContent>
                                La livraison est gratuite à partir de 85€ d'achats.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="delais-livraison">
                            <AccordionTrigger>Quels sont les délais de livraison ?</AccordionTrigger>
                            <AccordionContent>
                                Le service de livraison Mondial Relay, prévois une livraison entre 3 à 5 jours ouvrés.
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </section>

                <section>
                    <h2 className="text-xl font-bold mb-2">Commande</h2>
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="commande-modifier-annuler">
                            <AccordionTrigger>Puis-je modifier ou annuler ma commande ?</AccordionTrigger>
                            <AccordionContent>
                                Le service de livraison Mondial Relay, prévois une livraison entre 3 à 5 jours ouvrés.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="commande-email-confirmation">
                            <AccordionTrigger>Je n'ai pas reçu d'email de confirmation, que faire ?</AccordionTrigger>
                            <AccordionContent>
                                Le service de livraison Mondial Relay, prévois une livraison entre 3 à 5 jours ouvrés.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="commande-colis-livre">
                            <AccordionTrigger>Mon colis est indiqué comme livré mais je n'ai rien reçu, que faire ?</AccordionTrigger>
                            <AccordionContent>
                                Le service de livraison Mondial Relay, prévois une livraison entre 3 à 5 jours ouvrés.
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </section>

                {/* Retour et échange */}
                <section>
                    <h2 className="text-xl font-bold mb-2">Retour et échange</h2>
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="retour-0">
                            <AccordionTrigger>Puis-je retourner un article ?</AccordionTrigger>
                            <AccordionContent>
                                Oui. Conformément à l'article L221-18 du Code de la consommation, vous disposez d'un délai de 14 jours à compter de la réception de votre commande pour exercer votre droit de rétractation, sans avoir à justifier votre décision. Contactez-nous via le formulaire de contact ou à sacsabonheurs@gmail.com pour initier le retour.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="retour-1">
                            <AccordionTrigger>Quelles sont les conditions de retour ?</AccordionTrigger>
                            <AccordionContent>
                                Le produit doit être retourné en parfait état, sans avoir été utilisé, dans les 14 jours suivant l'envoi de votre formulaire de rétractation. Tout article retourné en mauvais état ou ayant été utilisé ne pourra pas être remboursé.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="retour-2">
                            <AccordionTrigger>Les frais de retour sont-ils à ma charge ?</AccordionTrigger>
                            <AccordionContent>
                                Oui, les frais de retour sont à votre charge.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="retour-3">
                            <AccordionTrigger>Quand vais-je être remboursé ?</AccordionTrigger>
                            <AccordionContent>
                                Le remboursement est effectué dans les 14 jours suivant la réception de votre notification de rétractation, par le même moyen de paiement que celui utilisé lors de l'achat. Le remboursement inclut la totalité des sommes versées, frais de livraison compris.
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </section>

                {/* Paiement */}
                <section>
                    <h2 className="text-xl font-bold mb-2">Paiement</h2>
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="moyens-paiement">
                            <AccordionTrigger>Quels moyens de paiement acceptez-vous ?</AccordionTrigger>
                            <AccordionContent>
                                Nous acceptons les paiements avec Visa, MasterCard, Apple Pay, Google Pay et Link. Les paiements sont gérés avec Stripe, nous ne collections aucunes données bancaires.
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </section>

                <section className="flex flex-col md:flex-row text-center items-center gap-8 md:gap-6 mt-10">
                    <div>
                        <h2 className="text-xl font-bold">Retours</h2>
                        <p className="text-sm">
                            Retours sous 14 jours pour recevoir un remboursement complet ou un échange.
                        </p>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">Livraison en France métropolitaine</h2>
                        <p className="text-sm">
                            Expédition uniquement en France métropolitaine, tarifs disponibles lors du passage en caisse.
                        </p>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">Support</h2>
                        <p className="text-sm">
                            Rendez-vous sur la page contact ou écrivez-nous à l'adresse{" "}
                            <Link href="mailto:contact@sacsabonheurs.fr" className="text-primary underline">
                                contact@sacsabonheurs.fr
                            </Link>{" "}
                            pour toute assistance.
                        </p>
                    </div>
                </section>
            </div>
        </div>
    );
}
