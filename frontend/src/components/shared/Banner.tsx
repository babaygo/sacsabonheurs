import React from "react";
import { Info, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { BannerVariant } from "@/lib/constants/BannerVariants";

export type BannerItem = {
    message: string;
    cta?: { label: string; href: string } | null;
};

export type BannerProps = {
    items: BannerItem[];
    variant?: BannerVariant;
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

const REPEATS = 4;

export default function Banner({
    items,
    variant = "primary",
    className = "",
}: BannerProps) {
    if (!items.length) return null;

    const styles = VARIANT_STYLES[variant];

    const track = items.map((item, i) => {
        const href = item.cta?.href
            ? item.cta.href.startsWith("http")
                ? item.cta.href
                : `https://${item.cta.href}`
            : undefined;
        return (
            <React.Fragment key={i}>
                <span className={`${styles.text} text-sm font-medium inline-flex items-center`}>
                    {item.message}
                    {item.cta && href ? (
                        <Link
                            className="ml-3 pr-20 text-white underline hover:opacity-80"
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {item.cta.label}
                        </Link>
                    ) : null}
                </span>
            </React.Fragment>
        );
    });

    return (
        <div className={`${styles.bg} ${className} w-full flex items-center p-2 overflow-hidden`}>
            {styles.icon && (
                <div className={`${styles.text} flex-shrink-0 mr-3`}>{styles.icon}</div>
            )}

            <div className="flex-1 overflow-hidden marquee-container">
                <div className="animate-marquee inline-flex whitespace-nowrap w-max">
                    {Array.from({ length: REPEATS }).map((_, i) => (
                        <span key={`a-${i}`} className="inline-flex items-center pr-20">
                            {track}
                        </span>
                    ))}
                    {Array.from({ length: REPEATS }).map((_, i) => (
                        <span key={`b-${i}`} className="inline-flex items-center pr-20">
                            {track}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}
