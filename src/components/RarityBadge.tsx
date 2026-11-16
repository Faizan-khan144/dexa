import type { CSSProperties } from 'react'
import { RARITY_META, type RarityTier } from '../lib/pokedex'

interface RarityBadgeProps {
  tier: RarityTier
  size?: 'sm' | 'md'
}

export default function RarityBadge({ tier, size = 'sm' }: RarityBadgeProps) {
  const meta = RARITY_META[tier]
  return (
    <span
      className={`type-badge ${size === 'md' ? '!px-3 !py-1 !text-[10.5px]' : ''}`}
      style={{ '--type-a': meta.a, '--type-b': meta.b, '--type-ink': meta.ink } as CSSProperties}
      title={meta.note}
    >
      {tier}
    </span>
  )
}
