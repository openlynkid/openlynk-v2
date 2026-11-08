import type { PageBlock } from "@/db/schema";
import type { PageBlockConfig } from "../types";
import { LinkBlock } from "./blocks/link-block";
import { BentoCardBlock } from "./blocks/bento-card-block";
import { MediaEmbedBlock } from "./blocks/media-embed-block";
import { HeaderTextBlock } from "./blocks/header-text-block";
import { SocialRowBlock } from "./blocks/social-row-block";
import { NoteCardBlock } from "./blocks/note-card-block";
import { ImageCardBlock } from "./blocks/image-card-block";
import { MapCardBlock } from "./blocks/map-card-block";
import { GitHubCardBlock } from "./blocks/github-card-block";

interface PageCardProps {
  block: PageBlock;
  isStudio?: boolean;
}

export function PageCard({ block, isStudio = false }: PageCardProps) {
  const config = (block.config ?? {}) as PageBlockConfig;

  // Route to specialized block variants inspired by OpenBio / Bento
  if (config.variant === "note") {
    return <NoteCardBlock block={block} isStudio={isStudio} />;
  }
  if (config.variant === "image") {
    return <ImageCardBlock block={block} isStudio={isStudio} />;
  }
  if (config.variant === "map") {
    return <MapCardBlock block={block} isStudio={isStudio} />;
  }
  if (config.variant === "github") {
    return <GitHubCardBlock block={block} isStudio={isStudio} />;
  }

  // Route by base block type
  switch (block.type) {
    case "social_row":
      return <SocialRowBlock block={block} isStudio={isStudio} />;
    case "bento_card":
      return <BentoCardBlock block={block} isStudio={isStudio} />;
    case "media_embed":
      return <MediaEmbedBlock block={block} isStudio={isStudio} />;
    case "header_text":
      return <HeaderTextBlock block={block} />;
    case "link":
    default:
      return <LinkBlock block={block} isStudio={isStudio} />;
  }
}
