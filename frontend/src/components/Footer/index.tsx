"use client";

import Link from "next/link";
import { Instagram } from "lucide-react";

export default function Footer() {
    return (
        <footer className="relative top-6 bottom-6 left-1/2 transform -translate-x-1/2 w-4/5 bg-secondary rounded-t-xl shadow-sm">
            <div className="p-8 flex flex-col md:flex-row justify-between gap-6 text-sm">
                <div className="space-y-2">
                    <p className="font-semibold">Sacs à Bonheurs</p>
                    <p>Créations uniques et artisanales, faites en France.</p>
                    <p className="text-xs">© {new Date().getFullYear()} Tous droits réservés.</p>
                </div>

                <div className="space-y-2">
                    <p className="font-semibold">Navigation</p>
                    <ul className="space-y-1">
                        <li><Link href="/" className="hover:underline">Accueil</Link></li>
                        <li><Link href="/a-propos" className="hover:underline">À propos</Link></li>
                        <li><Link href="/contact" className="hover:underline">Contact</Link></li>
                    </ul>
                </div>

                <div className="space-y-2">
                    <p className="font-semibold">Légal</p>
                    <ul className="space-y-1">
                        <li><Link href="/policies/mentions" className="hover:underline">Mentions légales</Link></li>
                        <li><Link href="/policies/cgv" className="hover:underline">Conditions générales</Link></li>
                        <li><Link href="/policies/privacy-policy" className="hover:underline">Politique de confidentialité</Link></li>
                    </ul>
                </div>

                <div className="space-y-2">
                    <p className="font-semibold">Suivez-nous</p>
                    <div className="flex items-center gap-2">
                        <a
                            href="https://www.instagram.com/sacs_a_bonheurs/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-pink-500 transition"
                        >
                            <Instagram className="w-5 h-5" />
                        </a>
                        <span className="text-sm">Instagram</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
