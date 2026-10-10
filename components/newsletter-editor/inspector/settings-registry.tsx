import type { ComponentType } from "react"
import type { BlockData, BlockType } from "../core/types"
import type { BlockSettingsProps } from "./blocks/types"
import { BannerSettings } from "./blocks/BannerSettings"
import { ButtonSettings } from "./blocks/ButtonSettings"
import { CalloutSettings } from "./blocks/CalloutSettings"
import { CardSettings } from "./blocks/CardSettings"
import { ColumnsSettings } from "./blocks/ColumnsSettings"
import { DividerSettings } from "./blocks/DividerSettings"
import { FooterSettings } from "./blocks/FooterSettings"
import { HeaderSettings } from "./blocks/HeaderSettings"
import { HeadingSettings } from "./blocks/HeadingSettings"
import { ImageSettings } from "./blocks/ImageSettings"
import { LinksSettings } from "./blocks/LinksSettings"
import { ListSettings } from "./blocks/ListSettings"
import { LogoSettings } from "./blocks/LogoSettings"
import { MetaSettings } from "./blocks/MetaSettings"
import { SocialsSettings } from "./blocks/SocialsSettings"
import { SpacerSettings } from "./blocks/SpacerSettings"
import { TextSettings } from "./blocks/TextSettings"

type AnySettings = ComponentType<BlockSettingsProps<any>>

export const BLOCK_SETTINGS: Record<BlockType, AnySettings> = {
  heading: HeadingSettings as AnySettings,
  text: TextSettings as AnySettings,
  image: ImageSettings as AnySettings,
  button: ButtonSettings as AnySettings,
  divider: DividerSettings as AnySettings,
  spacer: SpacerSettings as AnySettings,
  columns: ColumnsSettings as AnySettings,
  header: HeaderSettings as AnySettings,
  footer: FooterSettings as AnySettings,
  socials: SocialsSettings as AnySettings,
  logo: LogoSettings as AnySettings,
  callout: CalloutSettings as AnySettings,
  list: ListSettings as AnySettings,
  meta: MetaSettings as AnySettings,
  links: LinksSettings as AnySettings,
  banner: BannerSettings as AnySettings,
  card: CardSettings as AnySettings,
}

export function renderBlockSettings(props: BlockSettingsProps<BlockData>) {
  const Settings = BLOCK_SETTINGS[props.block.type] as ComponentType<BlockSettingsProps<BlockData>>
  return <Settings {...props} />
}
