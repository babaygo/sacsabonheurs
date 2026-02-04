"use client";

import Link from "next/link";
import { Facebook, Instagram } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Image from "next/image";

export default function Footer() {
    return (
        <footer className="w-full mt-8 bg-secondary px-4 sm:px-6 lg:px-8 py-8 text-base border-t">
            <div className="max-w-7xl mx-auto space-y-2">
                <div className="md:hidden">
                    <Accordion type="multiple" className="space-y-2">
                        <AccordionItem value="navigation" className="border-b-muted">
                            <AccordionTrigger className="font-semibold">Navigation</AccordionTrigger>
                            <AccordionContent>
                                <ul className="space-y-2 text-sm">
                                    <li><Link href="/" className="hover:underline">Accueil</Link></li>
                                    <li><Link href="/boutique" className="hover:underline">Boutique</Link></li>
                                    <li><Link href="/a-propos" className="hover:underline">À propos</Link></li>
                                </ul>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="legal" className="border-b-muted">
                            <AccordionTrigger className="font-semibold">Légal</AccordionTrigger>
                            <AccordionContent>
                                <ul className="space-y-2 text-sm">
                                    <li><Link href="/policies/mentions" className="hover:underline">Mentions légales</Link></li>
                                    <li><Link href="/policies/cgv" className="hover:underline">Conditions générales</Link></li>
                                    <li><Link href="/policies/privacy-policy" className="hover:underline">Politique de confidentialité</Link></li>
                                </ul>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="support" className="border-b-muted">
                            <AccordionTrigger className="font-semibold">Support</AccordionTrigger>
                            <AccordionContent>
                                <ul className="space-y-2 text-sm">
                                    <li><Link href="/contact" className="hover:underline">Contact</Link></li>
                                    <li><Link href="/faq" className="hover:underline">FAQ</Link></li>
                                </ul>
                            </AccordionContent>
                        </AccordionItem>

                        <div className="flex items-center space-x-4 pt-5">
                                <a href="https://www.instagram.com/sacs_a_bonheurs/" target="_blank" rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-sm hover:text-pink-500 transition">
                                    <Instagram className="w-5 h-5" />
                                </a>
                                <a href="https://www.facebook.com/p/Sacs-%C3%A0-bonheurs-61555061294316/" target="_blank" rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-sm hover:text-blue-500 transition">
                                    <Facebook className="w-5 h-5" />
                                </a>
                        </div>
                    </Accordion>
                </div>

                <div className="hidden md:flex justify-between">
                    <div className="space-y-2">
                        <p className="font-semibold">Navigation</p>
                        <ul className="space-y-1 text-sm">
                            <li><Link href="/" className="hover:underline">Accueil</Link></li>
                            <li><Link href="/boutique" className="hover:underline">Boutique</Link></li>
                            <li><Link href="/a-propos" className="hover:underline">À propos</Link></li>
                        </ul>
                    </div>

                    <div className="space-y-2">
                        <p className="font-semibold">Légal</p>
                        <ul className="space-y-1 text-sm">
                            <li><Link href="/policies/mentions" className="hover:underline">Mentions légales</Link></li>
                            <li><Link href="/policies/cgv" className="hover:underline">Conditions générales</Link></li>
                            <li><Link href="/policies/privacy-policy" className="hover:underline">Politique de confidentialité</Link></li>
                        </ul>
                    </div>

                    <div className="space-y-2">
                        <p className="font-semibold">Support</p>
                        <ul className="space-y-1 text-sm">
                            <li><Link href="/contact" className="hover:underline">Contact</Link></li>
                            <li><Link href="/faq" className="hover:underline">FAQ</Link></li>
                        </ul>
                    </div>

                    <div className="space-y-2">
                        <p className="font-semibold">Suivez nous</p>
                        <div className="space-y-1">
                            <a href="https://www.instagram.com/sacs_a_bonheurs/" target="_blank" rel="noopener noreferrer"
                                className="flex items-center gap-2 text-sm hover:text-pink-500 transition">
                                <Instagram className="w-5 h-5" />
                                Instagram
                            </a>
                            <a href="https://www.facebook.com/p/Sacs-%C3%A0-bonheurs-61555061294316/" target="_blank" rel="noopener noreferrer"
                                className="flex items-center gap-2 text-sm hover:text-blue-500 transition">
                                <Facebook className="w-5 h-5" />
                                Facebook
                            </a>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8">
                    <div className="flex items-center gap-2">
                        <Image src="/assets/sacs-a-bonheurs-logo.png" alt="Logo Sacs à Bonheurs"
                            width={32} height={32} className="h-8 w-auto" loading="lazy" />
                        <div className="text-center md:text-left">
                            <p className="font-semibold">Sacs à Bonheurs</p>
                            <p className="text-xs text-gray-600">© {new Date().getFullYear()} Tous droits réservés.</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap justify-center items-center gap-3">
                        <Image src="/assets/mastercard-svgrepo-com.svg" alt="Mastercard" width={40} height={40} className="h-8 md:h-10 w-auto" />
                        <Image src="/assets/visa-classic-svgrepo-com.svg" alt="Visa" width={40} height={40} className="h-8 md:h-10 w-auto" />
                        <Image src="/assets/apple-pay-svgrepo-com.svg" alt="Apple Pay" width={40} height={40} className="h-8 md:h-10 w-auto" />
                        <Image src="/assets/google-pay-svgrepo-com.svg" alt="Google Pay" width={40} height={40} className="h-8 md:h-10 w-auto" />
                        <Image src="https://storage.mondialrelay.fr/mrlogoprincipal.png" alt="Mondial Relay" width={40} height={40} className="h-8 md:h-10 w-auto" />
                    </div>
                </div>
            </div>
        </footer>
    );
}
