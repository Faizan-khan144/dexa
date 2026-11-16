import type { MouseEvent } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Heart } from 'lucide-react'
import RarityBadge from './RarityBadge'
import TypeBadge from './TypeBadge'
import {
  STAT_LABELS,
  TYPE_META,
  artworkUrl,
  formatDexId,
  formatName,
  staticRarity,
  type PokemonStat,
} from '../lib/pokedex'
import { useFavorites } from '../store/favorites'

interface PokemonCardProps {
  id: number
  name: string
  types: string[]
  stats?: PokemonStat[]
}

const MINI_STATS = ['hp', 'attack', 'speed']

export default function PokemonCard({ id, name, types, stats }: PokemonCardProps) {
  const favorite = useFavorites((state) => state.isFavorite(id))
  const toggle = useFavorites((state) => state.toggle)
  const primary = types[0] ?? 'normal'
  const meta = TYPE_META[primary] ?? { a: '#857173', b: '#b3a3a5', ink: '#fff' }
  const rarity = staticRarity(id)
  const total = stats?.reduce((sum, stat) => sum + stat.base_stat, 0)
  const picks = stats
    ? (MINI_STATS.map((key) => stats.find((stat) => stat.stat.name === key)).filter(Boolean) as PokemonStat[])
    : []

  const tilt = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width - 0.5
    const y = (event.clientY - rect.top) / rect.height - 0.5
    event.currentTarget.style.setProperty('--ry', `${x * 6}deg`)
    event.currentTarget.style.setProperty('--rx', `${-y * 6}deg`)
    event.currentTarget.style.setProperty('--mx', `${event.clientX - rect.left}px`)
    event.currentTarget.style.setProperty('--my', `${event.clientY - rect.top}px`)
  }

  const reset = (event: MouseEvent<HTMLDivElement>) => {
    event.currentTarget.style.setProperty('--ry', '0deg')
    event.currentTarget.style.setProperty('--rx', '0deg')
  }

  return (
    <div className="card spotlight-card card-tilt group relative overflow-hidden" onMouseMove={tilt} onMouseLeave={reset}>
      <span className="shine" aria-hidden="true" />

      <div
        className="relative overflow-hidden px-4 pb-1 pt-3.5"
        style={{ background: `linear-gradient(165deg, ${meta.a}1f, transparent 62%)` }}
      >
        <span
          className="pointer-events-none absolute -right-10 -top-12 h-36 w-36 rounded-full opacity-30 blur-2xl transition-opacity duration-500 group-hover:opacity-60"
          style={{ background: meta.a }}
          aria-hidden="true"
        />
        <span
          className="pokeball-ring pointer-events-none absolute inset-x-0 -bottom-8 h-40 opacity-60"
          aria-hidden="true"
        />

        <div className="relative flex items-start justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-[10px] font-medium tracking-[0.08em] text-ink/45">{formatDexId(id)}</span>
            {rarity && <RarityBadge tier={rarity} />}
          </div>
          <button
            type="button"
            onClick={() => toggle({ id, name, types })}
            className={`grid h-8 w-8 place-items-center rounded-full border backdrop-blur transition-all ${
              favorite
                ? 'border-accent bg-accent text-white'
                : 'border-white/70 bg-white/70 text-ink/40 hover:border-accent hover:text-accent'
            }`}
            aria-label={favorite ? `Remove ${name} from favourites` : `Add ${name} to favourites`}
          >
            <Heart className={`h-3.5 w-3.5 ${favorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        <Link to={`/pokemon/${id}`} className="relative mt-0.5 block" aria-label={`Open ${formatName(name)}`}>
          <img
            src={artworkUrl(id)}
            alt={formatName(name)}
            loading="lazy"
            className="mx-auto h-[136px] w-[136px] object-contain drop-shadow-[0_20px_18px_rgba(24,13,16,0.28)] transition-transform duration-500 group-hover:-translate-y-2 group-hover:scale-[1.07]"
          />
        </Link>
      </div>

      <Link to={`/pokemon/${id}`} className="relative block px-4 pb-4 pt-1">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="truncate font-display text-[16.5px] font-bold tracking-tight">{formatName(name)}</h3>
          {total !== undefined && (
            <span className="shrink-0 font-mono text-[9px] uppercase tracking-[0.1em] text-faint">
              total <span className="text-ink">{total}</span>
            </span>
          )}
        </div>

        <div className="mt-2 flex flex-wrap gap-1.5">
          {types.map((type) => (
            <TypeBadge key={type} type={type} />
          ))}
        </div>

        {picks.length > 0 && (
          <div className="mt-3 grid grid-cols-3 gap-2">
            {picks.map((stat) => (
              <div key={stat.stat.name}>
                <div className="flex items-baseline justify-between">
                  <span className="font-mono text-[8px] uppercase tracking-[0.08em] text-faint">
                    {STAT_LABELS[stat.stat.name] ?? stat.stat.name}
                  </span>
                  <span className="font-display text-[10.5px] font-bold">{stat.base_stat}</span>
                </div>
                <div className="mt-1 h-1 overflow-hidden rounded-full bg-line">
                  <div
                    className="h-full rounded-full transition-[width] duration-500"
                    style={{
                      width: `${Math.min(100, Math.round((stat.base_stat / 180) * 100))}%`,
                      background: `linear-gradient(90deg, ${meta.a}, ${meta.b})`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-3 flex items-center justify-between border-t border-line pt-2.5">
          <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-faint transition-colors group-hover:text-accent">
            Open dossier
          </span>
          <ArrowUpRight className="h-3.5 w-3.5 text-faint transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
        </div>
      </Link>
    </div>
  )
}
