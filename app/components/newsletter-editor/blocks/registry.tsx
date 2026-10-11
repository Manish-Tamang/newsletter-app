"use client"

import type { ComponentType } from "react"
import type { BlockComponentProps, BlockData, BlockType } from "../core/types"
import { HeadingBlock } from "./HeadingBlock"
import { TextBlock } from "./TextBlock"
import { ImageBlock } from "./ImageBlock"
import { ButtonBlock } from "./ButtonBlock"
import { DividerBlock } from "./DividerBlock"
import { SpacerBlock } from "./SpacerBlock"
import { ColumnsBlock } from "./ColumnsBlock"
import { HeaderBlock } from "./HeaderBlock"
import { FooterBlock } from "./FooterBlock"
import { SocialsBlock } from "./SocialsBlock"
import { LogoBlock } from "./LogoBlock"
import { CalloutBlock } from "./CalloutBlock"
import { ListBlock } from "./ListBlock"
import { MetaBlock } from "./MetaBlock"
import { LinksBlock } from "./LinksBlock"
import { BannerBlock } from "./BannerBlock"
import { CardBlock } from "./CardBlock"

type AnyBlockComponent = ComponentType<BlockComponentProps<any>>

export const BLOCK_COMPONENTS: Record<BlockType, AnyBlockComponent> = {
  heading: HeadingBlock as AnyBlockComponent,
  text: TextBlock as AnyBlockComponent,
  image: ImageBlock as AnyBlockComponent,
  button: ButtonBlock as AnyBlockComponent,
  divider: DividerBlock as AnyBlockComponent,
  spacer: SpacerBlock as AnyBlockComponent,
  columns: ColumnsBlock as AnyBlockComponent,
  header: HeaderBlock as AnyBlockComponent,
  footer: FooterBlock as AnyBlockComponent,
  socials: SocialsBlock as AnyBlockComponent,
  logo: LogoBlock as AnyBlockComponent,
  callout: CalloutBlock as AnyBlockComponent,
  list: ListBlock as AnyBlockComponent,
  meta: MetaBlock as AnyBlockComponent,
  links: LinksBlock as AnyBlockComponent,
  banner: BannerBlock as AnyBlockComponent,
  card: CardBlock as AnyBlockComponent,
}

export function renderBlockContent(props: BlockComponentProps<BlockData>) {
  const Component = BLOCK_COMPONENTS[props.block.type] as ComponentType<BlockComponentProps<BlockData>>
  return <Component {...props} />
}
