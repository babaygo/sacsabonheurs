"use client";

import BreadCrumb from "@/components/shared/BreadCrumb";
import { useSessionContext } from "@/components/shared/SessionProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { sendContactMessage } from "@/lib/api/contact";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ContactPage() {
    const { user } = useSessionContext();
    const router = useRouter();

    const [name, setName] = useState(user?.name || "");
    const [email, setEmail] = useState(user?.email || "");
    const [order, setOrder] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = sendContactMessage({name, email, order, message});
            if ((await response).success === true) {
                toast.success("Message envoyé !");
                router.push("/");
            } else {
                toast.error("Erreur lors de l'envoi du message. Réessayez plus tard.");
            }
        } catch (error: any) {
            toast.error("Erreur lors de l'envoi du message : " + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-4">
            <BreadCrumb
                items={[
                    { label: "Accueil", href: "/" },
                    { label: "Contact", }
                ]}
            />
            <h1 className="text-2xl font-bold">Contact</h1>
            <p className="py-4">
                Besoin d'aide ?<br />
                Vous avez une question concernant une commande récente ou un produit ?
                Vous êtes au bon endroit.<br />
                Si votre demande concerne un achat, n'hésitez pas à nous transmettre
                votre numéro de commande ou toute information utile pour faciliter le
                traitement.<br />
                Une fois le formulaire rempli, vous recevrez un e-mail de confirmation
                indiquant que votre demande a bien été reçue.
            </p>

            <form className="space-y-6 py-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                    <Label htmlFor="name">Nom / Prénom</Label>
                    <Input
                        id="name"
                        name="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="order">Numéro de commande (optionnel)</Label>
                    <Input
                        id="order"
                        name="order"
                        value={order}
                        onChange={(e) => setOrder(e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                        id="message"
                        name="message"
                        rows={5}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                    />
                </div>

                <Button type="submit" disabled={isLoading}>
                    {isLoading ? <Spinner /> : "Envoyer"}
                </Button>
            </form>
        </div>
    );
}
