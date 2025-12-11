"use client";

import React, { useEffect, useState } from "react";
import { Info, AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BannerVariant } from "@/lib/constants/BannerVariants";

export type BannerProps = {
    message: React.ReactNode;
    variant?: BannerVariant;
    dismissible?: boolean;
    autoDismiss?: number | null;
    cta?: { label: string; href: string } | null;
    className?: string;
};

const VARIANT_STYLES: Record<BannerVariant, { bg: string; text: string; icon?: React.ReactNode }> = {
    info: {
        bg: "bg-blue-50",
        text: "text-blue-800",
        icon: <Info className="h-5 w-5" aria-hidden />,
    },
    warning: {
        bg: "bg-yellow-50",
        text: "text-yellow-800",
        icon: <AlertTriangle className="h-5 w-5" aria-hidden />,
    },
    primary: {
        bg: "bg-primary",
        text: "text-white",
    },
};

export default function Banner({
    message,
    variant = "primary",
    dismissible = true,
    cta = null,
    className = "",
}: BannerProps) {
    const [visible, setVisible] = useState(true);
    const href = cta?.href.startsWith("http") ? cta.href : `https://${cta?.href}`;

    useEffect(() => {
        if (!visible) return;
    }, [visible]);

    if (!visible) return null;

    const styles = VARIANT_STYLES[variant];

    return (
        <div className={`${styles.bg} ${className} w-full flex items-center justify-center p-2 space-x-4`}
        >
            <div className={`${styles.text}`}>{styles.icon}</div>

            <p className={`${styles.text} text-sm font-medium`}>{message}</p>
            {cta ? (
                <Link className="text-white text-sm hover:underline" href={new URL(href)} target="_blank" rel="noopener noreferrer">
                    {cta.label}
                </Link>
            ) : null}

            {dismissible ? (
                <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Close banner"
                    onClick={() => setVisible(false)}
                    className="hover:bg-primary p-0 h-auto"
                >
                    <X className="h-5 w-5 text-white" aria-hidden />
                </Button>
            ) : null}
        </div>
    );
}
