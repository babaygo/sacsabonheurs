import { cn } from "@/lib/utils/utils";
import { cfImageUrl, cfSrcSet, PRODUCT_WIDTHS } from "@/lib/utils/cfImage";

type Props = Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src" | "srcSet"> & {
    src: string;
    alt: string;
    sizes: string;
    widths?: number[];
    fill?: boolean;
    priority?: boolean;
};

export default function CfImage({
    src,
    alt,
    sizes,
    widths = PRODUCT_WIDTHS,
    fill = false,
    priority = false,
    className,
    ...rest
}: Props) {
    if (!src) return null;

    const fallbackWidth = widths[Math.floor(widths.length / 2)];

    return (
        <img
            src={cfImageUrl(src, fallbackWidth)}
            srcSet={cfSrcSet(src, widths)}
            sizes={sizes}
            alt={alt}
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : undefined}
            decoding="async"
            className={cn(fill && "absolute inset-0 h-full w-full", className)}
            {...rest}
        />
    );
}
