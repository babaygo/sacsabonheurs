"use client";

import { useEffect, useState } from "react";

export function CookieBanner() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem("cookie-consent");
        if (!consent) setVisible(true);
    }, []);

    const handleConsent = (value: "accepted" | "refused") => {
        localStorage.setItem("cookie-consent", value);
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <div className="fixed bottom-0 w-full bg-gray-900 text-white p-4 text-sm z-50 shadow-lg">
            <div className="max-w-4xl mx-auto flex justify-between items-center flex-wrap gap-2">
                <p className="flex-1">
                    Ce site utilise des cookies pour améliorer votre expérience. Vous pouvez accepter ou refuser.
                </p>
                <div className="flex gap-2">
                    <button
                        onClick={() => handleConsent("refused")}
                        className="underline text-white hover:text-red-300"
                    >
                        Refuser
                    </button>
                    <button
                        onClick={() => handleConsent("accepted")}
                        className="bg-white text-black px-3 py-1 rounded hover:bg-gray-200"
                    >
                        Accepter
                    </button>
                </div>
            </div>
        </div>
    );
}
