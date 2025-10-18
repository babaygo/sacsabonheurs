"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
            <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
            <p className="text-lg text-gray-600 mb-6">
                Oups… la page que vous cherchez n'existe pas.
            </p>
            <Link href="/">
                <Button>Retour à l'accueil</Button>
            </Link>
        </div>
    );
}
