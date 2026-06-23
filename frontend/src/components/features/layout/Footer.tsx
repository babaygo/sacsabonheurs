"use client";

import Link from "next/link";
import { Facebook, Instagram } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Image from "next/image";

function PinterestIcon({ className = "" }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
            <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345c-.091.378-.293 1.194-.333 1.361-.052.22-.174.266-.401.16-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.608 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12C24 5.373 18.627 0 12 0z" />
        </svg>
    );
}

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
                                    <li><Link href="/blog" className="hover:underline">Blog</Link></li>
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
                                    aria-label="Instagram (nouvel onglet)"
                                    className="flex items-center gap-2 text-sm hover:text-pink-500 transition">
                                    <Instagram className="w-5 h-5" aria-hidden="true" />
                                </a>
                                <a href="https://www.facebook.com/p/Sacs-%C3%A0-bonheurs-61555061294316/" target="_blank" rel="noopener noreferrer"
                                    aria-label="Facebook (nouvel onglet)"
                                    className="flex items-center gap-2 text-sm hover:text-blue-500 transition">
                                    <Facebook className="w-5 h-5" aria-hidden="true" />
                                </a>
                                <a href="https://fr.pinterest.com/sacsabonheurs/" target="_blank" rel="noopener noreferrer"
                                    aria-label="Pinterest (nouvel onglet)"
                                    className="flex items-center gap-2 text-sm hover:text-red-600 transition">
                                    <PinterestIcon className="w-5 h-5" />
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
                            <li><Link href="/blog" className="hover:underline">Blog</Link></li>
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
                            <a href="https://fr.pinterest.com/sacsabonheurs/" target="_blank" rel="noopener noreferrer"
                                className="flex items-center gap-2 text-sm hover:text-red-600 transition">
                                <PinterestIcon className="w-5 h-5" />
                                Pinterest
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
                    </div>
                </div>
            </div>
        </footer>
    );
}
