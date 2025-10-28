"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function CookiesBanner() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const infoShown = localStorage.getItem("cookie-info-shown");
        if (!infoShown) setVisible(true);
    }, []);

    const handleClose = () => {
        localStorage.setItem("cookie-info-shown", "true");
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <div className="fixed bottom-0 w-full bg-gray-900 text-white p-4 text-sm z-50 shadow-lg">
            <div className="max-w-4xl mx-auto flex justify-between items-center flex-wrap gap-2">
                <p className="flex-1">
                    Ce site utilise uniquement un cookie de session sécurisé et des mesures anonymes de performance.<br /> Aucune donnée personnelle n'est collectée.{" "}
                    <Link href="/policies/privacy-policy" className="underline text-white hover:text-blue-300">
                        En savoir plus
                    </Link>
                </p>
                <button
                    onClick={handleClose}
                    className="bg-white text-black px-3 py-1 rounded hover:bg-gray-200"
                >
                    OK
                </button>
            </div>
        </div>
    );
}
