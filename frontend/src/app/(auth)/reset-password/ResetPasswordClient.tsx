"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/authClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ResetPasswordClient() {
    const router = useRouter();
    const token = useSearchParams().get("token");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleReset = async () => {
        if (!token) {
            setErrorMessage("Lien de réinitialisation invalide ou expiré.");
            return;
        }

        if (newPassword.length < 8) {
            setErrorMessage("Le mot de passe doit contenir au moins 8 caractères.");
            return;
        }

        if (!/[A-Z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
            setErrorMessage("Le mot de passe doit contenir une majuscule et un chiffre.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setErrorMessage("Les mots de passe ne correspondent pas.");
            return;
        }

        try {
            setLoading(true);
            await authClient.resetPassword({ token, newPassword });
            toast.success("Mot de passe réinitialisé avec succès !");
            router.push("/login");
        } catch (err: any) {
            setErrorMessage(err.message || "Erreur lors de la réinitialisation.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>
                        Réinitialiser votre mot de passe
                    </CardTitle>
                    <CardDescription className="w-full">
                        Saisissez un nouveau mot de passe.<br />
                        Avec au moins une majuscule et un chiffre.
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                            <Input
                                id="newPassword"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                        {errorMessage && (
                            <p className="text-sm text-red-500">{errorMessage}</p>
                        )}
                        <Button onClick={handleReset} disabled={loading} className="w-full">
                            {loading ? "Réinitialisation..." : "Valider"}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

