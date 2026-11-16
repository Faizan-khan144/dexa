import type { CSSProperties } from 'react'
import { TYPE_META } from '../lib/pokedex'

interface TypeBadgeProps {
  type: string
  size?: 'sm' | 'md'
}

export default function TypeBadge({ type, size = 'sm' }: TypeBadgeProps) {
  const meta = TYPE_META[type] ?? { a: '#8e8a99', b: '#b6b1bf', ink: '#fff' }
  return (
    <span
      className={`type-badge ${size === 'md' ? '!px-3 !py-1 !text-[10.5px]' : ''}`}
      style={{ '--type-a': meta.a, '--type-b': meta.b, '--type-ink': meta.ink } as CSSProperties}
    >
      {type}
    </span>
  )
}
