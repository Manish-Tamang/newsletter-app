"use client"

import type { NewsletterBlock, BlockData, BlockType } from "./types"
import { stackSpace } from "./stack"
import { BlockControls } from "./BlockControls"
import { HeadingBlock } from "./blocks/HeadingBlock"
import { TextBlock } from "./blocks/TextBlock"
import { ImageBlock } from "./blocks/ImageBlock"
import { ButtonBlock } from "./blocks/ButtonBlock"
import { DividerBlock } from "./blocks/DividerBlock"
import { SpacerBlock } from "./blocks/SpacerBlock"
import { ColumnsBlock } from "./blocks/ColumnsBlock"
import { HeaderBlock } from "./blocks/HeaderBlock"
import { FooterBlock } from "./blocks/FooterBlock"
import { SocialsBlock } from "./blocks/SocialsBlock"
import { LogoBlock } from "./blocks/LogoBlock"
import { CalloutBlock } from "./blocks/CalloutBlock"
import { ListBlock } from "./blocks/ListBlock"
import { MetaBlock } from "./blocks/MetaBlock"
import { LinksBlock } from "./blocks/LinksBlock"
import { BannerBlock } from "./blocks/BannerBlock"
import { CardBlock } from "./blocks/CardBlock"
import type { HeadingData, TextData, ImageData, ButtonData, DividerData, SpacerData, ColumnsData, HeaderData, FooterData, SocialsData, LogoData, CalloutData, ListData, MetaData, LinksData, BannerData, CardData } from "./types"

interface BlockRendererProps {
  block: NewsletterBlock
  onUpdate: (blockId: string, data: Partial<BlockData>) => void
  onDelete: (blockId: string) => void
  onDuplicate: (blockId: string) => void
  onMoveUp: (blockId: string) => void
  onMoveDown: (blockId: string) => void
  isFirst: boolean
  isLast: boolean
  isSelected: boolean
  onSelect: (blockId: string) => void
  previousType: BlockType | null
}

export function BlockRenderer({
  block,
  onUpdate,
  onDelete,
  onDuplicate,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
  isSelected,
  onSelect,
  previousType,
}: BlockRendererProps) {
  const handleUpdate = (data: Partial<BlockData>) => {
    onUpdate(block.id, data)
  }

  const handleSelect = () => {
    onSelect(block.id)
  }

  const renderBlock = () => {
    const baseProps = { block: block as any, onUpdate: handleUpdate, isSelected, onSelect: handleSelect }

    switch (block.type) {
      case "heading":
        return <HeadingBlock {...baseProps} block={block as { id: string; type: NewsletterBlock["type"]; data: HeadingData }} />
      case "text":
        return <TextBlock {...baseProps} block={block as { id: string; type: NewsletterBlock["type"]; data: TextData }} />
      case "image":
        return <ImageBlock {...baseProps} block={block as { id: string; type: NewsletterBlock["type"]; data: ImageData }} />
      case "button":
        return <ButtonBlock {...baseProps} block={block as { id: string; type: NewsletterBlock["type"]; data: ButtonData }} />
      case "divider":
        return <DividerBlock {...baseProps} block={block as { id: string; type: NewsletterBlock["type"]; data: DividerData }} />
      case "spacer":
        return <SpacerBlock {...baseProps} block={block as { id: string; type: NewsletterBlock["type"]; data: SpacerData }} />
      case "columns":
        return <ColumnsBlock {...baseProps} block={block as { id: string; type: NewsletterBlock["type"]; data: ColumnsData }} />
      case "header":
        return <HeaderBlock {...baseProps} block={block as { id: string; type: NewsletterBlock["type"]; data: HeaderData }} />
      case "footer":
        return <FooterBlock {...baseProps} block={block as { id: string; type: NewsletterBlock["type"]; data: FooterData }} />
      case "socials":
        return <SocialsBlock {...baseProps} block={block as { id: string; type: NewsletterBlock["type"]; data: SocialsData }} />
      case "logo":
        return <LogoBlock {...baseProps} block={block as { id: string; type: NewsletterBlock["type"]; data: LogoData }} />
      case "callout":
        return <CalloutBlock {...baseProps} block={block as { id: string; type: NewsletterBlock["type"]; data: CalloutData }} />
      case "list":
        return <ListBlock {...baseProps} block={block as { id: string; type: NewsletterBlock["type"]; data: ListData }} />
      case "meta":
        return <MetaBlock {...baseProps} block={block as { id: string; type: NewsletterBlock["type"]; data: MetaData }} />
      case "links":
        return <LinksBlock {...baseProps} block={block as { id: string; type: NewsletterBlock["type"]; data: LinksData }} />
      case "banner":
        return <BannerBlock {...baseProps} block={block as { id: string; type: NewsletterBlock["type"]; data: BannerData }} />
      case "card":
        return <CardBlock {...baseProps} block={block as { id: string; type: NewsletterBlock["type"]; data: CardData }} />
      default:
        return null
    }
  }

  const space = stackSpace(block.type, previousType)

  return (
    <div className={`nl-block-wrapper ${isSelected ? "nl-block-selected" : ""}`} data-type={block.type}>
      <BlockControls
        onMoveUp={() => onMoveUp(block.id)}
        onMoveDown={() => onMoveDown(block.id)}
        onDuplicate={() => onDuplicate(block.id)}
        onDelete={() => onDelete(block.id)}
        isFirst={isFirst}
        isLast={isLast}
      />
      <div
        className="nl-block-inner"
        style={{
          paddingTop: space.top,
          paddingBottom: space.bottom,
          paddingLeft: "var(--nl-pad-x)",
          paddingRight: "var(--nl-pad-x)",
        }}
      >
        {renderBlock()}
      </div>
    </div>
  )
}
