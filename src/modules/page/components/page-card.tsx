import type { PageBlock } from "@/db/schema";
import { LinkBlock } from "./blocks/link-block";
import { BentoCardBlock } from "./blocks/bento-card-block";
import { MediaEmbedBlock } from "./blocks/media-embed-block";
import { HeaderTextBlock } from "./blocks/header-text-block";

interface PageCardProps {
  block: PageBlock;
}

export function PageCard({ block }: PageCardProps) {
  switch (block.type) {
    case "bento_card":
      return <BentoCardBlock block={block} />;
    case "media_embed":
      return <MediaEmbedBlock block={block} />;
    case "header_text":
      return <HeaderTextBlock block={block} />;
    case "link":
    default:
      return <LinkBlock block={block} />;
  }
}
