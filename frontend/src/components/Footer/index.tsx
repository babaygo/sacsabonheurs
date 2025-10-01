"use client";

import Link from "next/link";
import { Instagram } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-gray-100 mt-12">
            <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row justify-between gap-6 text-sm text-gray-600">
                {/* Bloc gauche */}
                <div className="space-y-2">
                    <p className="font-semibold text-gray-800">Sacs à Bonheur</p>
                    <p>Créations uniques, faites main avec amour.</p>
                    <p className="text-xs text-gray-400">© {new Date().getFullYear()} Tous droits réservés.</p>
                </div>

                {/* Bloc navigation */}
                <div className="space-y-2">
                    <p className="font-semibold text-gray-800">Navigation</p>
                    <ul className="space-y-1">
                        <li><Link href="/" className="hover:underline">Accueil</Link></li>
                        <li><Link href="/about" className="hover:underline">À propos</Link></li>
                        <li><Link href="/contact" className="hover:underline">Contact</Link></li>
                    </ul>
                </div>

                {/* Bloc légal */}
                <div className="space-y-2">
                    <p className="font-semibold text-gray-800">Légal</p>
                    <ul className="space-y-1">
                        <li><Link href="/mentions-legales" className="hover:underline">Mentions légales</Link></li>
                        <li><Link href="/cgv" className="hover:underline">Conditions générales</Link></li>
                        <li><Link href="/confidentialite" className="hover:underline">Politique de confidentialité</Link></li>
                    </ul>
                </div>

                {/* Bloc réseaux sociaux */}
                <div className="space-y-2">
                    <p className="font-semibold text-gray-800">Suivez-nous</p>
                    <div className="flex items-center gap-2">
                        <a
                            href="https://www.instagram.com/sacs_a_bonheurs/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-600 hover:text-pink-500 transition"
                        >
                            <Instagram className="w-5 h-5" />
                        </a>
                        <span className="text-sm text-gray-600">Instagram</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
