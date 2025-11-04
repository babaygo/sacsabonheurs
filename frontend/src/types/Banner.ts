import { BannerVariant } from "@/lib/constants/BannerVariants";

export type Banner = {
  id: number;
  message: string;
  variant: BannerVariant;
  ctaLabel?: string | null;
  ctaHref?: string | null;
  dismissible: boolean;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type BannerCreateInput = Omit<Partial<Banner>, "id" | "createdAt" | "updatedAt"> & {
  message: string;
  variant?: BannerVariant;
};

export default Banner;
