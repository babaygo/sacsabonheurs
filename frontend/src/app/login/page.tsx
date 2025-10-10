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

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { refreshSession } = useSessionContext();
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        const result = loginSchema.safeParse({ email, password });
        if (!result.success) {
            const firstError = result.error.issues?.[0]?.message;
            toast.error(firstError || "Erreur de validation");
            return;
        }

        try {
            await useLogin({ email, password });
            await refreshSession();
            router.push("/");
        } catch (err: any) {
            toast.error(err.message || "Erreur lors de la connexion");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
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
                                <a
                                    href="#"
                                    className="ml-auto text-sm underline-offset-4 hover:underline"
                                >
                                    Mot de passe oublié ?
                                </a>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full">
                            Connexion
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
