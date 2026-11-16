import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import RarityBadge from './RarityBadge'
import TypeBadge from './TypeBadge'
import { artworkUrl, formatDexId, formatName, getMany, staticRarity, type PokemonDetail } from '../lib/pokedex'

const SPOTLIGHT = [
  { id: 150, note: 'The genetic original. Still the benchmark for a legendary silhouette.' },
  { id: 249, note: 'Guardian of the seas, and the calmest storm in the dex.' },
  { id: 384, note: 'A sky serpent that treats the atmosphere as a front garden.' },
  { id: 483, note: 'Time itself bends politely around this one.' },
  { id: 888, note: 'A blade so clean it needed a whole legend to hold it.' },
  { id: 1008, note: 'The newest headline legendary, and already a design icon.' },
]

export default function LegendarySpotlight() {
  const [items, setItems] = useState<PokemonDetail[]>([])
  const [active, setActive] = useState(0)

  useEffect(() => {
    let alive = true
    getMany(SPOTLIGHT.map((entry) => entry.id))
      .then((list) => {
        if (alive) setItems(list)
      })
      .catch(() => undefined)
    return () => {
      alive = false
    }
  }, [])

  const entry = SPOTLIGHT[active]
  const detail = items[active]
  const rarity = staticRarity(entry.id) ?? 'Legendary'

  return (
    <div className="grid gap-5 lg:grid-cols-[300px_1fr]">
      <div className="flex flex-col gap-1.5">
        {SPOTLIGHT.map((item, index) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setActive(index)}
            className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-all ${
              index === active
                ? 'border-accent/40 bg-accent/5'
                : 'border-line bg-surface hover:-translate-y-0.5 hover:border-line-strong'
            }`}
          >
            <img
              src={artworkUrl(item.id)}
              alt=""
              loading="lazy"
              className="h-10 w-10 object-contain drop-shadow-[0_8px_10px_rgba(24,13,16,0.2)]"
            />
            <div className="min-w-0 flex-1">
              <div className="truncate font-display text-[13.5px] font-bold">
                {detail && index === active ? formatName(detail.name) : `#${item.id}`}
              </div>
              <div className="mono text-faint">{formatDexId(item.id)}</div>
            </div>
            {index === active && <span className="h-1.5 w-1.5 rounded-full bg-accent" />}
          </button>
        ))}
      </div>

      <div className="card relative overflow-hidden">
        <div className="grid sm:grid-cols-[1fr_1.05fr]">
          <div className="relative min-h-[260px] overflow-hidden bg-surface2/50">
            <div className="absolute inset-0 bg-[radial-gradient(70%_70%_at_50%_20%,rgba(247,201,72,0.28),transparent_70%)]" />
            <span className="dex-number pointer-events-none absolute left-1/2 top-2 -translate-x-1/2 select-none text-[7.5rem]">
              {String(entry.id).padStart(3, '0')}
            </span>
            <img
              src={artworkUrl(entry.id)}
              alt=""
              className="sprite-float relative mx-auto mt-8 h-52 w-52 object-contain drop-shadow-[0_24px_26px_rgba(24,13,16,0.28)]"
            />
          </div>

          <div className="flex flex-col p-5 sm:p-6">
            <div className="flex flex-wrap items-center gap-1.5">
              <RarityBadge tier={rarity} />
              {detail?.types.map((type) => (
                <TypeBadge key={type.type.name} type={type.type.name} />
              ))}
            </div>
            <h3 className="mt-3 font-display text-[2rem] font-extrabold leading-none tracking-[-0.04em] sm:text-[2.5rem]">
              {detail ? formatName(detail.name) : 'Loading…'}
            </h3>
            <p className="mt-3 text-[13px] leading-relaxed text-muted">{entry.note}</p>

            {detail && (
              <div className="mt-4 grid grid-cols-3 gap-2">
                {detail.stats.slice(0, 3).map((stat) => (
                  <div key={stat.stat.name} className="rounded-lg border border-line bg-surface2/40 px-2 py-1.5">
                    <div className="mono text-[8px] uppercase tracking-[0.1em] text-faint">
                      {stat.stat.name.replace('special-', 'sp. ')}
                    </div>
                    <div className="font-display text-base font-extrabold">{stat.base_stat}</div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-auto flex flex-wrap gap-2 pt-5">
              <Link to={`/pokemon/${entry.id}`} className="btn-ink !px-4 !py-2 !text-[12px]">
                Open dossier <ArrowRight className="h-3 w-3" />
              </Link>
              <Link to="/dex?special=1" className="btn-quiet !px-4 !py-2 !text-[12px]">
                All legends
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
