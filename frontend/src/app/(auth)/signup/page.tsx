"use client";

import { useState } from "react";
import Link from "next/link";
import { signupSchema } from "@/lib/validation/signupSchema";
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
import { Eye, EyeOff } from "lucide-react";
import { useSessionContext } from "@/components/shared/SessionProvider";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/authClient";
import toast from "react-hot-toast";

export default function SignupPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [lastname, setLastName] = useState("");
    const [firstname, setFirstName] = useState("");
    const [loading, setLoading] = useState(false);
    const { refreshSession } = useSessionContext();
    const [errorMessage, setErrorMessage] = useState("");
    const router = useRouter();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();

        const result = signupSchema.safeParse({ email, password, firstname, lastname });
        if (!result.success) {
            const firstError = result.error.issues?.[0]?.message;
            setErrorMessage(firstError || "Erreur de validation");
            return;
        }
        setLoading(true);
        setErrorMessage("");
        const name = `${firstname} ${lastname}`.trim();

        try {
            const response = await authClient.signUp.email({ name, email, password, callbackURL: `${process.env.NEXT_PUBLIC_URL_FRONT}/` });

            if (response.error) {
                const errorCode = (response.error as any).code || "";
                const localizedMessage = getLocalizedError(errorCode, response.error.message || "Email déjà utilisé");
                setErrorMessage(localizedMessage);
                return;
            }

            await refreshSession();
            router.push("/");
            toast.success("Compte créé. Vous avez reçu un email, pour vérifier votre email.");
        } catch (error: any) {
            setErrorMessage(error.message || "Erreur lors de l'inscription");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-start min-h-screen pt-10">
            <Card className="max-w-sm">
                <CardHeader>
                    <CardTitle>Créer un compte</CardTitle>
                    <CardDescription>
                        Entrez votre email et mot de passe pour commencer.
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSignup} className="flex flex-col gap-6">
                        <div className="flex gap-2">
                            <div className="grid gap-2">
                                <Label htmlFor="lastname">Nom *</Label>
                                <Input
                                    id="lastname"
                                    type="lastname"
                                    value={lastname}
                                    onChange={(e) => setLastName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="firstname">Prénom *</Label>
                                <Input
                                    id="firstname"
                                    type="firstname"
                                    value={firstname}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    required
                                />
                            </div>

                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email *</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            {errorMessage && (errorMessage.toLowerCase().includes("email") || errorMessage.includes("utilisé")) && (
                                <p className="text-sm text-red-500">{errorMessage}</p>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Mot de passe *</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>
                        {errorMessage && !(errorMessage.toLowerCase().includes("email") || errorMessage.includes("utilisé")) && (
                            <p className="text-sm text-red-500">{errorMessage}</p>
                        )}
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? <Spinner /> : "Inscription"}
                        </Button>
                    </form>
                </CardContent>

                <CardFooter className="flex-col gap-4">
                    <Separator />
                    <div className="flex items-center">
                        <p className="text-sm">Déjà inscrit ?</p>
                        <Link href="/login">
                            <Button variant="link" className="text-sm">Connexion</Button>
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
