"use client";

import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { getLocalizedError } from "@/lib/constants/errorTranslations";
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
import { loginSchema } from "@/lib/validation/loginSchema";
import { useSessionContext } from "@/components/shared/SessionProvider";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth/authClient";
import { Spinner } from "@/components/ui/spinner";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const { refreshSession } = useSessionContext();
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        const result = loginSchema.safeParse({ email, password });
        if (!result.success) {
            const firstError = result.error.issues?.[0]?.message;
            setErrorMessage(firstError || "Erreur de validation");
            return;
        }

        setLoading(true);
        setErrorMessage("");
        try {
            const response = await authClient.signIn.email({ email, password });

            if (response.error) {
                const errorCode = (response.error as any).code || "";
                const localizedMessage = getLocalizedError(errorCode, response.error.message || "Erreur lors de la connexion");
                setErrorMessage(localizedMessage);
                return;
            }

            await refreshSession();
            router.push("/");
        } catch (err: any) {
            const errorCode = err.code || "";
            const localizedMessage = getLocalizedError(errorCode, err.message || "Erreur lors de la connexion");
            setErrorMessage(localizedMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-start min-h-screen pt-10">
            <Card className="max-w-sm">
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
                            <div className="flex justify-between items-center">
                                <Label htmlFor="password">Mot de passe *</Label>
                                <Link href="/forgot-password">
                                    <Button
                                        type="button"
                                        variant={"link"}
                                        className="ml-auto"
                                    >
                                        Mot de passe oublié ?
                                    </Button>
                                </Link>
                            </div>
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
