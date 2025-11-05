"use client";

import Link from "next/link";
import { Facebook, Instagram } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Image from "next/image";

export default function Footer() {
    return (
        <footer className="w-full mt-8 bg-secondary p-6 text-sm">
            <div className="max-w-7xl mx-auto hidden md:flex justify-between gap-6">
                <div className="flex items-center space-x-4">
                    <div className="space-y-2 items-center text-center md:items-start md:text-left">
                        <div className="flex items-center space-x-2">
                            <Image
                                src="/sacs-a-bonheurs-logo.png"
                                alt="Logo Sacs à Bonheurs"
                                width={32}
                                height={32}
                                className="h-6 w-auto md:h-8"
                                loading="lazy"
                            />
                            <p className="font-semibold">Sacs à Bonheurs</p>
                        </div>

                        <p>Créations uniques et artisanales, faites en France.</p>
                        <p className="text-xs">© {new Date().getFullYear()} Tous droits réservés.</p>
                        <div className="flex items-center space-x-2">
                            <img src="/assets/mastercard-svgrepo-com.svg" alt="Mastercard" className="h-10" />
                            <img src="/assets/visa-classic-svgrepo-com.svg" alt="Visa" className="h-10" />
                            <img
                                src="https://storage.mondialrelay.fr/mrlogoprincipal.png"
                                alt="Mondial Relay"
                                className="h-10"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-2 items-center text-center md:items-start md:text-left">
                    <p className="font-semibold">Navigation</p>
                    <ul className="space-y-1">
                        <li><Link href="/" className="hover:underline">Accueil</Link></li>
                        <li><Link href="/boutique" className="hover:underline">Boutique</Link></li>
                        <li><Link href="/a-propos" className="hover:underline">À propos</Link></li>
                        <li><Link href="/contact" className="hover:underline">Contact</Link></li>
                    </ul>
                </div>

                <div className="space-y-2 items-center text-center md:items-start md:text-left">
                    <p className="font-semibold">Légal</p>
                    <ul className="space-y-1">
                        <li><Link href="/policies/mentions" className="hover:underline">Mentions légales</Link></li>
                        <li><Link href="/policies/cgv" className="hover:underline">Conditions générales</Link></li>
                        <li><Link href="/policies/privacy-policy" className="hover:underline">Politique de confidentialité</Link></li>
                    </ul>
                </div>

                <div className="space-y-2 items-center text-center md:items-start md:text-left">
                    <p className="font-semibold">Suivez-nous</p>
                    <a
                        href="https://www.instagram.com/sacs_a_bonheurs/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 hover:text-pink-500 transition"
                    >
                        <Instagram className="w-5 h-5" />
                        <span className="text-sm">Instagram</span>
                    </a>

                    <a
                        href="https://www.facebook.com/p/Sacs-%C3%A0-bonheurs-61555061294316/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 hover:text-blue-500 transition"
                    >
                        <Facebook className="w-5 h-5" />
                        <span className="text-sm">Facebook</span>
                    </a>
                </div>
            </div>
            <div className="md:hidden">
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="navigation">
                        <AccordionTrigger>Navigation</AccordionTrigger>
                        <AccordionContent>
                            <ul className="space-y-1">
                                <li><Link href="/">Accueil</Link></li>
                                <li><Link href="/boutique">Boutique</Link></li>
                                <li><Link href="/a-propos">À propos</Link></li>
                                <li><Link href="/contact">Contact</Link></li>
                            </ul>
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="legal">
                        <AccordionTrigger>Légal</AccordionTrigger>
                        <AccordionContent>
                            <ul className="space-y-1">
                                <li><Link href="/policies/mentions">Mentions légales</Link></li>
                                <li><Link href="/policies/cgv">Conditions générales</Link></li>
                                <li><Link href="/policies/privacy-policy">Politique de confidentialité</Link></li>
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
                <div className="mt-4 flex flex-col space-y-4">
                    <div className="flex items-center space-x-2">
                        <img src="/assets/mastercard-svgrepo-com.svg" alt="Mastercard" className="h-10" />
                        <img src="/assets/visa-classic-svgrepo-com.svg" alt="Visa" className="h-10" />
                        <img
                            src="https://storage.mondialrelay.fr/mrlogoprincipal.png"
                            alt="Mondial Relay"
                            className="h-10"
                        />
                    </div>

                    <div className="flex items-center space-x-4">
                        <a
                            href="https://www.instagram.com/sacs_a_bonheurs/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-pink-500 transition"
                        >
                            <Instagram className="w-5 h-5" />
                        </a>

                        <a
                            href="https://www.facebook.com/p/Sacs-%C3%A0-bonheurs-61555061294316/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-blue-500 transition"
                        >
                            <Facebook className="w-5 h-5" />
                        </a>
                    </div>
                    <p>© &nbsp; Sacs à Bonheurs &nbsp; {new Date().getFullYear()}</p>
                </div>
            </div>
        </footer>
    );
}
