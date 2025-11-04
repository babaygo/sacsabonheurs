import Banner from "@/components/shared/Banner";
import { getBaseUrl } from "@/lib/utils/getBaseUrl";
import type { Banner as BannerType } from "@/types/Banner";

export default async function DynamicBanner() {
    let banners: BannerType[] = [];
    try {
        const res = await fetch(`${getBaseUrl()}/api/banners`, { cache: 'no-store' });
        if (res.ok) banners = await res.json();
    } catch (err) {
        return null;
    }

    return (
        banners[0] ? (
            <Banner
                key={banners[0].id}
                message={banners[0].message}
                variant={banners[0].variant as any}
                dismissible={banners[0].dismissible}
                cta={banners[0].ctaLabel ? { label: banners[0].ctaLabel, href: banners[0].ctaHref || "#" } : null}
            />
        ) : null
    );
}