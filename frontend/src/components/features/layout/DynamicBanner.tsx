import Banner from "@/components/shared/Banner";
import { getBanners } from "@/lib/api/banner";
import type { Banner as BannerType } from "@/types/Banner";

export default async function DynamicBanner() {
    let banners: BannerType[] = [];
    try {
        banners = await getBanners();
    } catch (err) {
        return null;
    }

    const activeBanners = banners.filter((b) => b.active);

    if (activeBanners.length === 0) return null;

    const items = activeBanners.map((b) => ({
        message: b.message,
        cta: b.ctaLabel ? { label: b.ctaLabel, href: b.ctaHref || "#" } : null,
    }));

    return <Banner items={items} variant={activeBanners[0].variant as any} />;
}