import { useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, Sparkles } from 'lucide-react'
import Reveal from '../components/Reveal'
import SpotlightCard from '../components/SpotlightCard'
import { TYPE_META, TYPE_ORDER, formatName, spriteUrl } from '../lib/pokedex'

const TYPE_SAMPLES: Record<string, number[]> = {
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

export default function Types() {
  useEffect(() => {
    document.title = 'Types · Dexa'
  }, [])

  const randomType = useMemo(() => TYPE_ORDER[Math.floor(Math.random() * TYPE_ORDER.length)], [])

  return (
    <div className="pop-in wrap py-9">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <div className="kicker">Type atlas</div>
          <h1 className="mt-3 max-w-3xl font-display text-[2.7rem] font-extrabold leading-[0.94] tracking-[-0.05em] sm:text-[3.7rem]">
            Eighteen ways to <span className="text-gradient">hit hard.</span>
          </h1>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted">
            Open any type for its full defensive chart and the species that carry it. Matchups are pulled straight from
            PokéAPI, not from memory.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <div className="font-display text-4xl font-extrabold leading-none tracking-tight">18</div>
            <div className="mono mt-1 text-faint">charts to learn</div>
          </div>
          <Link to={`/types/${randomType}`} className="btn-quiet">
            <Sparkles className="h-4 w-4" /> Random type
          </Link>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {TYPE_ORDER.map((type, index) => {
          const meta = TYPE_META[type]
          const samples = TYPE_SAMPLES[type] ?? [133, 143, 39]
          return (
            <Reveal key={type} delay={Math.min(index * 28, 260)}>
              <Link to={`/types/${type}`} aria-label={`Open the ${type} type chart`}>
                <SpotlightCard className="card group relative h-full min-h-[188px] overflow-hidden p-4" tilt={3.2}>
                  <span className="shine" aria-hidden="true" />
                  <span
                    className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-30 blur-2xl transition-opacity duration-500 group-hover:opacity-70"
                    style={{ background: meta.a }}
                  />
                  <span
                    className="dex-number pointer-events-none absolute -bottom-5 -right-1 select-none text-[6rem] opacity-70"
                    aria-hidden="true"
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  <div className="relative flex items-start justify-between">
                    <span
                      className="type-badge"
                      style={{ background: `linear-gradient(135deg, ${meta.a}, ${meta.b})`, color: meta.ink }}
                    >
                      {type}
                    </span>
                    <ArrowUpRight className="h-4 w-4 text-ink/40 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
                  </div>

                  <div className="relative mt-2 flex h-[64px] items-center">
                    {samples.map((id, position) => (
                      <img
                        key={id}
                        src={spriteUrl(id)}
                        alt=""
                        loading="lazy"
                        className="h-14 w-14 object-contain [image-rendering:pixelated] drop-shadow-[0_8px_8px_rgba(24,13,16,0.18)] transition-transform duration-300 group-hover:-translate-y-1.5"
                        style={{
                          marginLeft: position === 0 ? 0 : '-0.9rem',
                          zIndex: samples.length - position,
                          transitionDelay: `${position * 45}ms`,
                        }}
                      />
                    ))}
                  </div>

                  <div className="relative mt-2">
                    <div className="font-display text-lg font-extrabold tracking-tight">{formatName(type)}</div>
                    <div className="mono text-faint">open type chart</div>
                  </div>
                </SpotlightCard>
              </Link>
            </Reveal>
          )
        })}
      </div>

      <Reveal>
        <div className="card mt-10 flex flex-col items-center gap-4 px-6 py-10 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <h2 className="font-display text-xl font-extrabold tracking-tight">Not sure where to start?</h2>
            <p className="mt-1 text-[13.5px] text-muted">The dex filters by type, generation and rarity in one place.</p>
          </div>
          <Link to="/dex" className="btn-ink">
            <Sparkles className="h-4 w-4" /> Open the dex
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </Reveal>
    </div>
  )
}
