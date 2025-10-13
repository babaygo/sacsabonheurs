"use client";

import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginSchema } from "@/lib/validation/loginSchema";
import { useLogin } from "@/lib/useLogin";
import { useSessionContext } from "@/components/SessionProvider";
import toast from "react-hot-toast";
import { authClient } from "@/lib/authClient";
import { Spinner } from "@/components/ui/spinner";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const { refreshSession } = useSessionContext();
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage("");

        const result = loginSchema.safeParse({ email, password });
        if (!result.success) {
            const firstError = result.error.issues?.[0]?.message;
            setErrorMessage(firstError || "Erreur de validation");
            return;
        }

        setLoading(true);
        try {
            await useLogin({ email, password });
            await refreshSession();
            router.push("/");
        } catch (err: any) {
            setErrorMessage(err.message || "Erreur lors de la connexion");
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async () => {
        try {
            if (!email) {
                setErrorMessage("Veuillez entrer votre email avant de réinitialiser le mot de passe");
                return;
            }

            await authClient.requestPasswordReset({
                email,
                redirectTo: `${process.env.NEXT_PUBLIC_URL_FRONT}/reset-password`
            });

            toast.success("Un lien de réinitialisation a été envoyé à votre adresse email");
        } catch (err: any) {
            setErrorMessage(err.message);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Se connecter</CardTitle>
                    <CardDescription>
                        Entrez votre email et mot de passe pour accéder à votre compte.
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleLogin} className="flex flex-col gap-6">
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
                        </div>
                        <div className="grid gap-2">
                            <div className="flex items-center">
                                <Label htmlFor="password">Mot de passe *</Label>
                                <Button
                                    onClick={handleResetPassword}
                                    variant={"link"}
                                    className="ml-auto"
                                >
                                    Mot de passe oublié ?
                                </Button>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        {errorMessage && (
                            <p className="text-sm text-red-500">{errorMessage}</p>
                        )}
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? <Spinner /> : "Connexion"}
                        </Button>
                    </form>
                </CardContent>

                <CardFooter className="flex-col gap-4">
                    <Separator />
                    <div className="flex items-center">
                        <p className="text-sm">Pas encore de compte ?</p>
                        <Link href="/signup">
                            <Button variant="link" className="text-sm">Inscription</Button>
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
