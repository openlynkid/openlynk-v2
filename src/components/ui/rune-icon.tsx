import { getIconById } from "runeicons-react";

export const ICON_ALIASES: Record<string, string> = {
  "glass-sparkle": "glass-sparkle-3-2",
  "glass-star": "glass-star-4",
  "glass-badge-check": "glass-shield-check-1",
  "glass-video-recorder": "glass-video-2",
  "glass-video": "glass-video-2",
  "glass-camera": "glass-camera-1-2",
  "glass-music": "glass-volume-full-2",
  "glass-message": "glass-bubble-2",
  "glass-mail": "glass-email",
  "glass-phone": "glass-telephone",
  "glass-user": "glass-circle-person",
  "glass-book": "glass-file-text",
  "glass-trash": "glass-trash-can",
  "glass-edit-pen": "glass-pencil",
  "glass-code": "glass-code",
  "glass-lock-1": "glass-lock-1",
  "glass-chain-link-3-1": "glass-chain-link-3-1",
  "glass-shopping-bag": "glass-shopping-bag",
};

export function resolveIconName(name?: string | null): string {
  if (!name) return "glass-sparkle-3-2";
  return ICON_ALIASES[name] || name;
}

interface RuneIconProps {
  name: string;
  type?: "normal" | "duotone" | "fill" | "pixelated" | "glass";
  size?: number;
  className?: string;
}

export function RuneIcon({
  name,
  type = "glass",
  size = 24,
  className,
}: RuneIconProps) {
  const resolvedName = resolveIconName(name);
  const icon = getIconById(resolvedName);
  const variant = icon?.variants?.[type] || icon?.variants?.glass;

  if (!variant) {
    // Fallback gracefully to default glass sparkle icon if not found
    const fallback = getIconById("glass-sparkle-3-2")?.variants?.glass;
    if (fallback) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={size}
          height={size}
          viewBox={fallback.viewBox}
          className={className}
          dangerouslySetInnerHTML={{ __html: fallback.markup }}
        />
      );
    }
    return null;
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox={variant.viewBox}
      className={className}
      dangerouslySetInnerHTML={{ __html: variant.markup }}
    />
  );
}
