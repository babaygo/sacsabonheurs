"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSignup } from "@/lib/useSignup";
import { signupSchema } from "@/lib/validation/signupSchema";
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
import { useSessionContext } from "@/components/SessionProvider";

export default function SignupPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [lastname, setLastName] = useState("");
    const [fisrtname, setFisrtName] = useState("");
    const { refreshSession } = useSessionContext();
    const router = useRouter();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();

        const result = signupSchema.safeParse({
            email,
            password,
            firstname: fisrtname,
            lastname,
        });

        if (!result.success) {
            const firstError = result.error.issues?.[0]?.message;
            alert(firstError || "Erreur de validation");
            return;
        }

        const name = `${fisrtname} ${lastname}`.trim();

        try {
            await useSignup({ name, email, password });
            await refreshSession();
            router.push("/");
        } catch (err: any) {
            alert(err.message || "Erreur lors de l'inscription");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-sm">
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
                                <Label htmlFor="fisrtname">Prénom *</Label>
                                <Input
                                    id="fisrtname"
                                    type="fisrtname"
                                    value={fisrtname}
                                    onChange={(e) => setFisrtName(e.target.value)}
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
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Mot de passe *</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full">
                            Inscription
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
