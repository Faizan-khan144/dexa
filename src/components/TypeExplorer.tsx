import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import TypeBadge from './TypeBadge'
import { TYPE_META, TYPE_ORDER, artworkUrl, formatName, getType, type TypeInfo } from '../lib/pokedex'

const SAMPLES: Record<string, number[]> = {
  normal: [133, 143, 39],
  fire: [6, 59, 146],
  water: [7, 131, 130],
  electric: [25, 135, 145],
  grass: [1, 3, 154],
  ice: [144, 131, 471],
  fighting: [448, 68, 107],
  poison: [94, 89, 34],
  ground: [445, 51, 105],
  flying: [384, 149, 6],
  psychic: [150, 65, 196],
  bug: [212, 123, 214],
  rock: [248, 142, 141],
  ghost: [94, 92, 778],
  dragon: [149, 445, 384],
  dark: [197, 248, 359],
  steel: [212, 448, 208],
  fairy: [700, 39, 778],
}

export default function TypeExplorer() {
  const [type, setType] = useState('fire')
  const [info, setInfo] = useState<TypeInfo | null>(null)

  useEffect(() => {
    let alive = true
    setInfo(null)
    getType(type)
      .then((value) => {
        if (alive) setInfo(value)
      })
      .catch(() => undefined)
    return () => {
      alive = false
    }
  }, [type])

  const meta = TYPE_META[type] ?? TYPE_META.normal
  const samples = SAMPLES[type] ?? [25, 6, 7]
  const groups = [
    { label: 'Weak to', items: info?.doubleFrom ?? [] },
    { label: 'Resists', items: info?.halfFrom ?? [] },
    { label: 'Immune', items: info?.noneFrom ?? [] },
  ]

  return (
    <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
      <div className="grid grid-cols-3 content-start gap-1.5 sm:grid-cols-4 lg:grid-cols-2">
        {TYPE_ORDER.map((entry) => {
          const entryMeta = TYPE_META[entry]
          const active = entry === type
          return (
            <button
              key={entry}
              type="button"
              onClick={() => setType(entry)}
              className={`group flex items-center gap-2 rounded-xl border px-2.5 py-2 text-left transition-all ${
                active
                  ? 'border-transparent text-white shadow-[0_12px_26px_-16px_rgba(24,13,16,0.6)]'
                  : 'border-line bg-surface text-muted hover:-translate-y-0.5 hover:border-line-strong hover:text-ink'
              }`}
              style={active ? { background: `linear-gradient(120deg, ${entryMeta.a}, ${entryMeta.b})` } : undefined}
            >
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ background: active ? 'rgba(255,255,255,0.9)' : entryMeta.a }}
              />
              <span className="truncate font-mono text-[9.5px] uppercase tracking-[0.08em]">{entry}</span>
            </button>
          )
        })}
      </div>

      <div
        className="card relative overflow-hidden px-5 py-6 sm:px-7"
        style={{ background: `radial-gradient(110% 120% at 100% 0%, ${meta.a}24, var(--color-surface) 62%)` }}
      >
        <span className="dex-number pointer-events-none absolute -right-4 -top-6 select-none text-[7rem] sm:text-[9rem]">
          {String(TYPE_ORDER.indexOf(type) + 1).padStart(2, '0')}
        </span>
        <div className="relative flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="kicker" style={{ color: meta.a }}>
              Type dossier
            </div>
            <h3 className="mt-2 font-display text-[2.4rem] font-extrabold leading-none tracking-[-0.045em] sm:text-[3.1rem]">
              {formatName(type)}
            </h3>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <TypeBadge type={type} />
              <span className="mono self-center text-faint">{samples.length} featured</span>
            </div>
          </div>

          <div className="flex -space-x-3">
            {samples.map((id, index) => (
              <Link
                key={id}
                to={`/pokemon/${id}`}
                className="group relative"
                style={{ zIndex: samples.length - index }}
                aria-label={`Open species ${id}`}
              >
                <img
                  src={artworkUrl(id)}
                  alt=""
                  loading="lazy"
                  className="h-20 w-20 object-contain drop-shadow-[0_14px_16px_rgba(24,13,16,0.25)] transition-transform duration-300 group-hover:-translate-y-2 sm:h-24 sm:w-24"
                />
              </Link>
            ))}
          </div>
        </div>

        <div className="relative mt-5 grid gap-3 sm:grid-cols-3">
          {groups.map((group) => (
            <div key={group.label} className="rounded-xl border border-line bg-surface/80 px-3 py-2.5 backdrop-blur">
              <div className="mono text-[8.5px] uppercase tracking-[0.14em] text-faint">{group.label}</div>
              <div className="mt-1.5 flex flex-wrap gap-1">
                {group.items.length === 0 ? (
                  <span className="font-mono text-[9px] text-faint">none</span>
                ) : (
                  group.items.slice(0, 8).map((item) => (
                    <span key={item} className="font-mono text-[9px] uppercase tracking-[0.06em] text-muted">
                      {item}
                    </span>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="relative mt-5 flex flex-wrap gap-2">
          <Link to={`/types/${type}`} className="btn-ink !px-4 !py-2 !text-[12px]">
            Full {formatName(type).toLowerCase()} chart <ArrowRight className="h-3 w-3" />
          </Link>
          <Link to={`/dex?type=${type}`} className="btn-quiet !px-4 !py-2 !text-[12px]">
            Every {formatName(type).toLowerCase()} species
          </Link>
        </div>
      </div>
    </div>
  )
}
