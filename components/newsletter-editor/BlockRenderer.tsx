"use client"

import type { NewsletterBlock, BlockData } from "./types"
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
import type { HeadingData, TextData, ImageData, ButtonData, DividerData, SpacerData, ColumnsData, HeaderData, FooterData, SocialsData } from "./types"

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
        return <HeadingBlock {...baseProps} block={block as NewsletterBlock & { data: HeadingData }} />
      case "text":
        return <TextBlock {...baseProps} block={block as NewsletterBlock & { data: TextData }} />
      case "image":
        return <ImageBlock {...baseProps} block={block as NewsletterBlock & { data: ImageData }} />
      case "button":
        return <ButtonBlock {...baseProps} block={block as NewsletterBlock & { data: ButtonData }} />
      case "divider":
        return <DividerBlock {...baseProps} block={block as NewsletterBlock & { data: DividerData }} />
      case "spacer":
        return <SpacerBlock {...baseProps} block={block as NewsletterBlock & { data: SpacerData }} />
      case "columns":
        return <ColumnsBlock {...baseProps} block={block as NewsletterBlock & { data: ColumnsData }} />
      case "header":
        return <HeaderBlock {...baseProps} block={block as NewsletterBlock & { data: HeaderData }} />
      case "footer":
        return <FooterBlock {...baseProps} block={block as NewsletterBlock & { data: FooterData }} />
      case "socials":
        return <SocialsBlock {...baseProps} block={block as NewsletterBlock & { data: SocialsData }} />
      default:
        return null
    }
  }

  return (
    <div className={`nl-block-wrapper ${isSelected ? "nl-block-selected" : ""}`}>
      <BlockControls
        onMoveUp={() => onMoveUp(block.id)}
        onMoveDown={() => onMoveDown(block.id)}
        onDuplicate={() => onDuplicate(block.id)}
        onDelete={() => onDelete(block.id)}
        isFirst={isFirst}
        isLast={isLast}
      />
      <div className="nl-block-inner">{renderBlock()}</div>
    </div>
  )
}
