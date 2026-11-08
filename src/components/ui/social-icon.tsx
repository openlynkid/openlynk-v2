import { BrandLogo } from "runeicons-react/brands";

interface SocialIconProps {
  platform: "instagram" | "tiktok" | "youtube" | "twitter" | "x" | "github" | "whatsapp" | string;
  size?: number;
  className?: string;
}

export function SocialIcon({
  platform,
  size = 18,
  className = "",
}: SocialIconProps) {
  const brandName = platform.toLowerCase() === "twitter" ? "x" : platform.toLowerCase();
  const isMonochrome = brandName === "x" || brandName === "github";

  return (
    <span
      className={`inline-flex items-center justify-center shrink-0 ${
        isMonochrome ? "[&_path]:fill-white [&_g]:fill-white" : ""
      } ${className}`}
    >
      <BrandLogo name={brandName} size={size} />
    </span>
  );
}
