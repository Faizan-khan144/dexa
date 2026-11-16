import { useEffect } from 'react'
import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Sparkles } from 'lucide-react'
import Reveal from '../components/Reveal'
import { TYPE_META, TYPE_ORDER, formatName, spriteUrl } from '../lib/pokedex'

const TYPE_SAMPLES: Record<string, number> = {
  normal: 133,
  fire: 6,
  water: 7,
  electric: 25,
  grass: 1,
  ice: 144,
  fighting: 448,
  poison: 94,
  ground: 445,
  flying: 384,
  psychic: 150,
  bug: 123,
  rock: 248,
  ghost: 92,
  dragon: 149,
  dark: 197,
  steel: 212,
  fairy: 700,
}

export default function Types() {
  useEffect(() => {
    document.title = 'Types · Dexa'
  }, [])

  return (
    <div className="pop-in wrap py-10">
      <div className="kicker">Type atlas</div>
      <h1 className="mt-3 max-w-3xl font-display text-[2.6rem] font-extrabold leading-[0.96] tracking-[-0.045em] sm:text-[3.5rem]">
        Eighteen ways to <span className="text-gradient">hit hard.</span>
      </h1>
      <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted">
        Pick a type to see its full defensive chart and every species that carries it. Matchups are pulled straight
        from PokéAPI, not from memory.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {TYPE_ORDER.map((type, index) => {
          const meta = TYPE_META[type]
          return (
            <Reveal key={type} delay={Math.min(index * 35, 300)}>
              <Link
                to={`/types/${type}`}
                className="card card-tilt group relative block overflow-hidden p-4"
                style={{
                  background: `radial-gradient(130% 100% at 0% 0%, ${meta.a}55, var(--color-surface) 72%)`,
                }}
              >
                <span className="shine" aria-hidden="true" />
                <div className="flex items-start justify-between">
                  <span
                    className="type-badge"
                    style={{ '--type-a': meta.a, '--type-b': meta.b, '--type-ink': meta.ink } as CSSProperties}
                  >
                    {type}
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-ink/40 transition-all group-hover:-translate-y-0.5 group-hover:text-accent" />
                </div>
                <img
                  src={spriteUrl(TYPE_SAMPLES[type] ?? 133)}
                  alt=""
                  loading="lazy"
                  className="mt-3 h-16 w-16 object-contain [image-rendering:pixelated] transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-110"
                />
                <div className="mt-1 font-display text-lg font-extrabold tracking-tight">{formatName(type)}</div>
                <div className="mono text-faint">open type chart</div>
              </Link>
            </Reveal>
          )
        })}
      </div>

      <Reveal>
        <div className="card mt-10 flex flex-col items-center gap-4 px-6 py-10 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <h2 className="font-display text-xl font-extrabold tracking-tight">Prefer to browse every species?</h2>
            <p className="mt-1 text-[13.5px] text-muted">The dex filters by type, generation and rarity in one place.</p>
          </div>
          <Link to="/dex" className="btn-ink">
            <Sparkles className="h-4 w-4" /> Open the dex
          </Link>
        </div>
      </Reveal>
    </div>
  )
}
