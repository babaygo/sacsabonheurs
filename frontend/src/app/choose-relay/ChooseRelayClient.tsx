"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useSessionContext } from "@/components/SessionProvider";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { getBaseUrl } from "@/lib/getBaseUrl";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";

declare global {
    interface Window {
        $: any;
        jQuery: any;
    }
}

export default function ChooseRelayClient() {
    const { user } = useSessionContext();
    const searchParams = useSearchParams();
    const sessionId = searchParams.get("session_id");
    const [relay, setRelay] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [loadingConfirmRelay, setLoadingConfirmRelay] = useState(false);
    const [errorConfirmRelay, setErrorConfirmRelay] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const widgetInitialized = useRef(false);
    const router = useRouter();

    const isValid = sessionId && user;

    useEffect(() => {
        if (!isValid) {
            setIsLoading(false);
            return;
        }

        if (widgetInitialized.current) return;
        widgetInitialized.current = true;

        const loadScript = (src: string): Promise<void> => {
            return new Promise((resolve, reject) => {
                const existing = document.querySelector(`script[src="${src}"]`);
                if (existing) {
                    resolve();
                    return;
                }

                const script = document.createElement("script");
                script.src = src;
                script.async = true;
                script.onload = () => resolve();
                script.onerror = (e) => reject(new Error(`Erreur chargement script: ${src}`));
                document.body.appendChild(script);
            });
        };

        const initWidget = async () => {
            try {
                await loadScript("https://code.jquery.com/jquery-3.6.0.min.js");

                let attempts = 0;
                while (!window.jQuery && attempts < 50) {
                    await new Promise((r) => setTimeout(r, 100));
                    attempts++;
                }

                if (!window.jQuery) throw new Error("jQuery n'a pas pu être chargé");

                const link = document.createElement("link");
                link.rel = "stylesheet";
                link.href = "https://widget.mondialrelay.com/parcelshop-picker/css/style.css";
                document.head.appendChild(link);

                await loadScript("https://widget.mondialrelay.com/parcelshop-picker/jquery.plugin.mondialrelay.parcelshoppicker.min.js");

                attempts = 0;
                while (!window.$.fn.MR_ParcelShopPicker && attempts < 50) {
                    await new Promise((r) => setTimeout(r, 100));
                    attempts++;
                }

                if (!window.$.fn.MR_ParcelShopPicker) throw new Error("Le plugin Mondial Relay n'a pas pu être chargé");

                window.$("#Zone_Widget").MR_ParcelShopPicker({
                    Target: "#Target_Widget",
                    TargetDisplay: "#TargetDisplay_Widget",
                    TargetDisplayInfoPR: "#TargetDisplayInfoPR_Widget",
                    Brand: process.env.NEXT_PUBLIC_CODE_MARCHAND_MR,
                    Country: "FR",
                    ColLivMod: "24R",
                    NbResults: 10,
                    Responsive: true,
                    ShowResultsOnMap: true,
                    OnParcelShopSelected: (data: any) => setRelay(data),
                });

                setIsLoading(false);
            } catch (err) {
                setError((err as Error).message);
                setIsLoading(false);
            }
        };

        initWidget();
    }, [isValid]);

    const handleConfirm = async () => {
        setLoadingConfirmRelay(true);
        setErrorConfirmRelay(null);
        if (!relay) return toast.error("Veuillez choisir un point relais");

        try {
            const response = await fetch(`${getBaseUrl()}/api/order/${sessionId}/relay`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ relay }),
                credentials: "include"
            });

            if (response.ok) {
                toast.success("Point relais enregistré avec succès, vous avez reçu un email de confirmation !");
                router.push("/orders");
            } else {
                toast.error("Erreur lors de l'enregistrement");
            }
        } catch (error: any) {
            toast.error("Erreur lors de l'enregistrement : " + error);
            setErrorConfirmRelay(error.message);
        } finally {
            setLoadingConfirmRelay(false);
        }
    };

    if (!isValid) {
        return (
            <Alert variant="destructive" className="max-w-xl mx-auto mt-10">
                <AlertTitle>Session invalide</AlertTitle>
                <AlertDescription>Utilisateur non connecté ou session Stripe manquante.</AlertDescription>
            </Alert>
        );
    }

    return (
        <div className="p-4 max-w-6xl mx-auto min-h-screen">
            <h1 className="text-2xl font-bold mb-6">Choisissez votre point relais</h1>

            {error && (
                <Alert variant="destructive" className="mb-6">
                    <AlertTitle>Erreur</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                    <Button variant="destructive" className="mt-4" onClick={() => window.location.reload()}>
                        Rafraîchir la page
                    </Button>
                </Alert>
            )}

            {isLoading && !error && (
                <div className="space-y-4 mb-6">
                    <Skeleton className="h-8 w-1/3" />
                    <Skeleton className="h-[500px] w-full" />
                </div>
            )}

            <input type="hidden" id="Target_Widget" />
            <input type="text" id="TargetDisplay_Widget" className="hidden" />
            <textarea id="TargetDisplayInfoPR_Widget" className="hidden" />
            <div id="Zone_Widget" className="mb-6 min-h-[500px]" />

            <Button
                onClick={handleConfirm}
                disabled={!relay || isLoading}
                className="w-full md:w-auto"
            >
                {loadingConfirmRelay ? (
                    <Badge variant="outline">
                        <Spinner />
                        Confirmation
                    </Badge>
                ) : (
                    'Confirmer ce point relais'
                )}
            </Button>

            {errorConfirmRelay && (
                <Alert variant="destructive">
                    <AlertTitle>Erreur</AlertTitle>
                    <AlertDescription>{errorConfirmRelay}</AlertDescription>
                </Alert>
            )}
        </div>
    );
}
