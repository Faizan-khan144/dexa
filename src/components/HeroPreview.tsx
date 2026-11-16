import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Search } from 'lucide-react'
import TypeBadge from './TypeBadge'
import { artworkUrl, formatDexId, formatName } from '../lib/pokedex'

interface PreviewEntry {
  id: number
  name: string
  types: string[]
}

const POOL: PreviewEntry[] = [
  { id: 1, name: 'bulbasaur', types: ['grass', 'poison'] },
  { id: 4, name: 'charmander', types: ['fire'] },
  { id: 7, name: 'squirtle', types: ['water'] },
  { id: 25, name: 'pikachu', types: ['electric'] },
  { id: 39, name: 'jigglypuff', types: ['normal', 'fairy'] },
  { id: 59, name: 'arcanine', types: ['fire'] },
  { id: 65, name: 'alakazam', types: ['psychic'] },
  { id: 68, name: 'machamp', types: ['fighting'] },
  { id: 92, name: 'gastly', types: ['ghost', 'poison'] },
  { id: 94, name: 'gengar', types: ['ghost', 'poison'] },
  { id: 130, name: 'gyarados', types: ['water', 'flying'] },
  { id: 131, name: 'lapras', types: ['water', 'ice'] },
  { id: 133, name: 'eevee', types: ['normal'] },
  { id: 143, name: 'snorlax', types: ['normal'] },
  { id: 149, name: 'dragonite', types: ['dragon', 'flying'] },
  { id: 150, name: 'mewtwo', types: ['psychic'] },
  { id: 197, name: 'umbreon', types: ['dark'] },
  { id: 212, name: 'scizor', types: ['bug', 'steel'] },
  { id: 248, name: 'tyranitar', types: ['rock', 'dark'] },
  { id: 384, name: 'rayquaza', types: ['dragon', 'flying'] },
  { id: 445, name: 'garchomp', types: ['dragon', 'ground'] },
  { id: 448, name: 'lucario', types: ['fighting', 'steel'] },
  { id: 609, name: 'chandelure', types: ['ghost', 'fire'] },
  { id: 778, name: 'mimikyu', types: ['ghost', 'fairy'] },
]

const TYPES = ['all', 'fire', 'water', 'grass', 'electric', 'psychic', 'dragon', 'ghost', 'fairy', 'steel']

export default function HeroPreview() {
  const [type, setType] = useState('all')
  const [query, setQuery] = useState('')

  const results = useMemo(() => {
    const value = query.trim().toLowerCase()
    return POOL.filter((entry) => {
      if (type !== 'all' && !entry.types.includes(type)) return false
      if (value && !entry.name.includes(value) && String(entry.id) !== value) return false
      return true
    })
  }, [type, query])

  return (
    <div className="card overflow-hidden text-left">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
          </span>
          <span className="mono text-faint">Live preview · try it</span>
        </div>
        <span className="mono text-faint">
          {results.length} of {POOL.length}
        </span>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-2 rounded-full border border-line-strong bg-bg/60 px-3 py-2.5 transition-shadow focus-within:border-accent focus-within:shadow-[0_0_0_4px_rgba(245,37,63,0.12)]">
          <Search className="h-3.5 w-3.5 shrink-0 text-faint" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search this preview — try “gengar” or 448"
            className="min-w-0 flex-1 border-0 bg-transparent text-[12.5px] text-ink outline-none placeholder:text-faint"
            aria-label="Preview search"
          />
          {query && (
            <button type="button" onClick={() => setQuery('')} className="mono text-faint hover:text-ink">
              clear
            </button>
          )}
        </div>

        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {TYPES.map((entry) => (
            <button
              key={entry}
              type="button"
              onClick={() => setType(entry)}
              className="chip"
              data-active={type === entry}
            >
              {entry}
            </button>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {results.slice(0, 6).map((entry) => (
            <Link
              key={entry.id}
              to={`/pokemon/${entry.id}`}
              className="group rounded-xl border border-line bg-bg/40 p-2.5 transition-all hover:-translate-y-1 hover:border-accent/50 hover:bg-accent/5"
            >
              <div className="flex items-start justify-between gap-1">
                <span className="mono text-[8.5px] text-faint">{formatDexId(entry.id)}</span>
                <ArrowRight className="h-3 w-3 -translate-x-1 text-faint opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
              </div>
              <img
                src={artworkUrl(entry.id)}
                alt={formatName(entry.name)}
                loading="lazy"
                className="mx-auto h-[64px] w-[64px] object-contain drop-shadow-[0_10px_12px_rgba(0,0,0,0.5)] transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-110"
              />
              <div className="mt-1 truncate font-display text-[12.5px] font-bold">{formatName(entry.name)}</div>
              <div className="mt-1 flex flex-wrap gap-1">
                {entry.types.map((item) => (
                  <TypeBadge key={item} type={item} />
                ))}
              </div>
            </Link>
          ))}
          {results.length === 0 && (
            <div className="col-span-full rounded-xl border border-dashed border-line px-4 py-10 text-center">
              <p className="font-display text-[14px] font-bold">Nothing in the preview matches</p>
              <p className="mt-1 text-[12px] text-muted">The full dex searches all 1025 species instead.</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line px-4 py-2.5">
        <span className="mono text-[9px] text-faint">preview pool · full dex has 1025</span>
        <Link
          to="/dex"
          className="flex items-center gap-1 font-mono text-[9px] uppercase tracking-[0.14em] text-accent hover:text-ink"
        >
          Open the full dex <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  )
}
