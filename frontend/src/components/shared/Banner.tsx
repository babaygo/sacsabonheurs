"use client";

import React, { useState } from "react";
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

const REPEATS = 6;

function BannerContent({ message, cta, textClass }: { message: React.ReactNode; cta: { label: string; href: string } | null; textClass: string }) {
    const href = cta?.href.startsWith("http") ? cta.href : `https://${cta?.href}`;
    return (
        <span className={`${textClass} text-sm font-medium inline-flex items-center px-10`}>
            {message}
            {cta ? (
                <Link className="ml-4 underline hover:opacity-80" href={new URL(href)} target="_blank" rel="noopener noreferrer">
                    {cta.label}
                </Link>
            ) : null}
        </span>
    );
}

export default function Banner({
    message,
    variant = "primary",
    dismissible = true,
    cta = null,
    className = "",
}: BannerProps) {
    const [visible, setVisible] = useState(true);

    if (!visible) return null;

    const styles = VARIANT_STYLES[variant];

    return (
        <div className={`${styles.bg} ${className} w-full flex items-center p-2 overflow-hidden`}>
            {styles.icon && (
                <div className={`${styles.text} flex-shrink-0 mr-3`}>{styles.icon}</div>
            )}

            <div className="flex-1 overflow-hidden marquee-container">
                <div className="animate-marquee inline-flex whitespace-nowrap w-max">
                    {Array.from({ length: REPEATS }).map((_, i) => (
                        <BannerContent key={`a-${i}`} message={message} cta={cta} textClass={styles.text} />
                    ))}
                    {Array.from({ length: REPEATS }).map((_, i) => (
                        <BannerContent key={`b-${i}`} message={message} cta={cta} textClass={styles.text} />
                    ))}
                </div>
            </div>

            {dismissible ? (
                <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Close banner"
                    onClick={() => setVisible(false)}
                    className="flex-shrink-0 ml-2 hover:bg-black/10 p-0 h-auto"
                >
                    <X className={`h-5 w-5 ${styles.text}`} aria-hidden />
                </Button>
            ) : null}
        </div>
    );
}
