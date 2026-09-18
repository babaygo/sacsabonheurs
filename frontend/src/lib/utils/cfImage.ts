const CF_SEGMENT = /\/cdn-cgi\/image\/[^/]+/;

export const PRODUCT_WIDTHS = [320, 480, 640, 800, 1000, 1200];
export const ZOOM_WIDTHS = [800, 1200, 1600];

function mediaOrigin(): string | null {
    const raw = process.env.NEXT_PUBLIC_URL_MEDIA;
    if (!raw) return null;
    try {
        return new URL(raw).origin;
    } catch {
        return null;
    }
}

export function isResizable(url: string): boolean {
    if (!url) return false;
    if (CF_SEGMENT.test(url)) return true;
    const origin = mediaOrigin();
    return Boolean(origin && url.startsWith(origin));
}

export function cfImageUrl(url: string, width: number): string {
    if (!isResizable(url)) return url;
    try {
        const u = new URL(url);
        const path = u.pathname.replace(CF_SEGMENT, "");
        return `${u.origin}/cdn-cgi/image/width=${width},quality=auto,format=auto${path}`;
    } catch {
        return url;
    }
}

export function cfSrcSet(url: string, widths: number[] = PRODUCT_WIDTHS): string | undefined {
    if (!isResizable(url)) return undefined;
    return widths.map((w) => `${cfImageUrl(url, w)} ${w}w`).join(", ");
}

export const OG_IMAGE_WIDTH = 1200;
