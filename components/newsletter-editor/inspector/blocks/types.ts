import type { BlockData, BlockType, BlockUpdater } from "../../core/types"
import type { EmailTheme } from "../../core/theme"

export interface BlockSettingsProps<T extends BlockData = BlockData> {
  block: { id: string; type: BlockType; data: T }
  onUpdate: BlockUpdater<T>
  theme: EmailTheme
}
