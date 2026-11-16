import type { CSSProperties, MouseEvent } from 'react'
import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import TypeBadge from './TypeBadge'
import { TYPE_META, artworkUrl, formatDexId, formatName } from '../lib/pokedex'
import { useFavorites } from '../store/favorites'

interface PokemonCardProps {
  id: number
  name: string
  types: string[]
}

export default function PokemonCard({ id, name, types }: PokemonCardProps) {
  const favorite = useFavorites((state) => state.isFavorite(id))
  const toggle = useFavorites((state) => state.toggle)
  const primary = types[0] ?? 'normal'
  const meta = TYPE_META[primary] ?? { a: '#857173', b: '#b3a3a5', ink: '#fff' }

  const tilt = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width - 0.5
    const y = (event.clientY - rect.top) / rect.height - 0.5
    event.currentTarget.style.setProperty('--ry', `${x * 9}deg`)
    event.currentTarget.style.setProperty('--rx', `${-y * 9}deg`)
  }

  const reset = (event: MouseEvent<HTMLDivElement>) => {
    event.currentTarget.style.setProperty('--ry', '0deg')
    event.currentTarget.style.setProperty('--rx', '0deg')
  }

  return (
    <div className="card card-tilt group relative overflow-hidden" onMouseMove={tilt} onMouseLeave={reset}>
      <span className="shine" aria-hidden="true" />
      <div
        className="type-wash relative px-4 pb-2 pt-4"
        style={{ '--type-a': meta.a, '--type-b': meta.b } as CSSProperties}
      >
        <div className="flex items-start justify-between">
          <span className="font-mono text-[10px] font-medium tracking-[0.08em] text-ink/45">{formatDexId(id)}</span>
          <button
            type="button"
            onClick={() => toggle({ id, name, types })}
            className={`grid h-8 w-8 place-items-center rounded-full border transition-all ${
              favorite
                ? 'border-accent bg-accent text-white'
                : 'border-white/70 bg-white/70 text-ink/40 hover:border-accent hover:text-accent'
            }`}
            aria-label={favorite ? `Remove ${name} from favourites` : `Add ${name} to favourites`}
          >
            <Heart className={`h-3.5 w-3.5 ${favorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        <Link to={`/pokemon/${id}`} className="mt-1 block">
          <img
            src={artworkUrl(id)}
            alt={formatName(name)}
            loading="lazy"
            className="mx-auto h-[132px] w-[132px] object-contain drop-shadow-[0_18px_18px_rgba(0,0,0,0.45)] transition-transform duration-500 group-hover:-translate-y-2 group-hover:scale-[1.06]"
          />
        </Link>
      </div>

      <Link to={`/pokemon/${id}`} className="block px-4 pb-4 pt-1">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="truncate font-display text-[16.5px] font-bold tracking-tight">{formatName(name)}</h3>
          <span className="font-mono text-[9.5px] uppercase tracking-[0.1em] text-faint">
            {types.length > 1 ? 'dual' : types[0]}
          </span>
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {types.map((type) => (
            <TypeBadge key={type} type={type} />
          ))}
        </div>
      </Link>
    </div>
  )
}
