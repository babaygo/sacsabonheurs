"use client";

import { useState } from "react";
import Link from "next/link";
import { getLocalizedError } from "@/lib/constants/errorTranslations";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/authClient";
import toast from "react-hot-toast";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !email.includes("@")) {
            setErrorMessage("Veuillez entrer une adresse email valide.");
            return;
        }

        setLoading(true);
        setErrorMessage("");
        setSuccessMessage("");

        try {
            await authClient.requestPasswordReset({
                email,
                redirectTo: `${process.env.NEXT_PUBLIC_URL_FRONT}/reset-password`
            });

            setSuccessMessage("Un lien de réinitialisation a été envoyé à votre adresse email.");
            setEmail("");
            toast.success("Email de réinitialisation envoyé !");
        } catch (err: any) {
            const errorCode = err.code || "";
            const localizedMessage = getLocalizedError(errorCode, err.message || "Erreur lors de la réinitialisation du mot de passe.");
            setErrorMessage(localizedMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-start min-h-screen pt-10">
            <Card className="max-w-sm">
                <CardHeader>
                    <CardTitle>Réinitialiser votre mot de passe</CardTitle>
                    <CardDescription>
                        Entrez votre adresse email pour recevoir un lien de réinitialisation.
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleForgotPassword} className="flex flex-col gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email *</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            {errorMessage && (
                                <p className="text-sm text-red-500">{errorMessage}</p>
                            )}
                        </div>

                        {successMessage && (
                            <p className="text-sm text-green-600 bg-green-50 p-3 rounded border border-green-200">
                                ✓ {successMessage}
                            </p>
                        )}

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? <Spinner /> : "Envoyer le lien de réinitialisation"}
                        </Button>
                    </form>
                </CardContent>

                <CardFooter className="flex-col gap-4">
                    <Separator />
                    <div className="flex items-center gap-2 text-sm">
                        <p>Vous vous souvenez de votre mot de passe ?</p>
                        <Link href="/login">
                            <Button variant="link" className="text-sm p-0">Se connecter</Button>
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
