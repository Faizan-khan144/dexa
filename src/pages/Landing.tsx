import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, Sparkles, Star } from 'lucide-react'
import Marquee from '../components/Marquee'
import PokemonCard from '../components/PokemonCard'
import RarityBadge from '../components/RarityBadge'
import Reveal from '../components/Reveal'
import SearchDock from '../components/SearchDock'
import TypeBadge from '../components/TypeBadge'
import {
  GENERATIONS,
  LEGENDARY_IDS,
  MYTHICAL_IDS,
  TYPE_META,
  TYPE_ORDER,
  artworkUrl,
  formatDexId,
  formatName,
  getMany,
  type PokemonDetail,
} from '../lib/pokedex'

const STARTERS = [
  { id: 1, name: 'bulbasaur', types: ['grass', 'poison'] },
  { id: 4, name: 'charmander', types: ['fire'] },
  { id: 7, name: 'squirtle', types: ['water'] },
  { id: 25, name: 'pikachu', types: ['electric'] },
]

const FEATURED_IDS = [6, 448, 133, 150, 384, 94]

const ROLLING_NAMES = [
  'Gengar',
  'Lapras',
  'Dragonite',
  'Umbreon',
  'Lucario',
  'Garchomp',
  'Mimikyu',
  'Greninja',
  'Corviknight',
  'Dragapult',
  'Tinkaton',
  'Ceruledge',
  'Clodsire',
  'Baxcalibur',
  'Sylveon',
  'Tyranitar',
]

export default function Landing() {
  const [featured, setFeatured] = useState<PokemonDetail[]>([])
  const [active, setActive] = useState(0)

  useEffect(() => {
    document.title = 'Dexa — every Pokémon, one clean dex'
    let alive = true
    getMany(FEATURED_IDS)
      .then((list) => {
        if (alive) setFeatured(list)
      })
      .catch(() => undefined)
    return () => {
      alive = false
    }
  }, [])

  useEffect(() => {
    if (featured.length < 2) return
    const timer = window.setInterval(() => {
      setActive((value) => (value + 1) % featured.length)
    }, 4800)
    return () => window.clearInterval(timer)
  }, [featured.length])

  const hero = featured[active]
  const heroPrimary = hero?.types[0]?.type.name ?? 'electric'
  const heroMeta = TYPE_META[heroPrimary] ?? TYPE_META.normal
  const specialCount = LEGENDARY_IDS.size + MYTHICAL_IDS.size

  return (
    <div className="pop-in">
      <section className="wrap grid gap-10 pb-12 pt-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:pb-16 lg:pt-16">
        <div>
          <Reveal>
            <div className="kicker">Pokédex · 1025 species</div>
            <h1 className="mt-4 font-display text-[2.9rem] font-extrabold leading-[0.96] tracking-[-0.045em] sm:text-[4.1rem]">
              Every Pokémon,
              <br />
              one clean <span className="text-accent">dex.</span>
            </h1>
            <p className="mt-5 max-w-lg text-[15.5px] leading-relaxed text-muted">
              Search all nine generations in a single keystroke. Types, stats, evolution lines, cries, and a shelf for
              the ones you keep coming back to.
            </p>
          </Reveal>

          <Reveal delay={110}>
            <div className="mt-7 max-w-xl">
              <SearchDock size="hero" placeholder="Try “gengar”, “151”, “dragapult”…" />
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="mono text-faint">Popular</span>
                {['pikachu', 'gengar', 'lucario', 'umbreon'].map((name) => (
                  <Link key={name} to={`/dex?q=${name}`} className="chip">
                    {formatName(name)}
                  </Link>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={200}>
            <div className="mt-8 grid max-w-xl grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { value: '1025', label: 'species' },
                { value: '18', label: 'types' },
                { value: '9', label: 'generations' },
                { value: String(specialCount), label: 'legendary + mythical' },
              ].map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-line bg-surface/70 px-3 py-3">
                  <div className="font-display text-2xl font-extrabold tracking-tight">{stat.value}</div>
                  <div className="mono mt-0.5 text-[9px] uppercase tracking-[0.1em] text-faint">{stat.label}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal variant="right" delay={140}>
          <div className="relative">
            <div className="absolute -inset-6 rounded-[3rem] bg-gradient-to-br from-sun/20 via-transparent to-accent/10 blur-2xl" />
            <div
              className="card pokeball-ring relative overflow-hidden px-6 pb-6 pt-5"
              style={{
                background: `radial-gradient(120% 100% at 50% 0%, ${heroMeta.a}22, #fffdf8 62%)`,
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className="mono text-faint">Now showing</span>
                  <span className="h-1 w-1 rounded-full bg-accent" />
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
                  {hero ? formatDexId(hero.id) : '#—'}
                </span>
              </div>

              <div className="relative mt-2 grid h-[300px] place-items-center sm:h-[340px]">
                <span className="dex-number pointer-events-none absolute select-none text-[9rem] sm:text-[12rem]">
                  {hero ? String(hero.id).padStart(3, '0') : '000'}
                </span>
                {hero ? (
                  <Link to={`/pokemon/${hero.id}`} className="relative">
                    <img
                      key={hero.id}
                      src={artworkUrl(hero.id)}
                      alt={formatName(hero.name)}
                      className="sprite-float h-[240px] w-[240px] object-contain drop-shadow-[0_30px_30px_rgba(20,18,26,0.25)] sm:h-[280px] sm:w-[280px]"
                    />
                  </Link>
                ) : (
                  <div className="skeleton relative h-52 w-52 rounded-full" />
                )}
              </div>

              <div className="relative flex items-end justify-between gap-3">
                <div>
                  <h2 className="font-display text-2xl font-extrabold tracking-tight">
                    {hero ? formatName(hero.name) : 'Loading…'}
                  </h2>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {hero?.types.map((entry) => (
                      <TypeBadge key={entry.type.name} type={entry.type.name} />
                    ))}
                  </div>
                </div>
                {hero && (
                  <Link
                    to={`/pokemon/${hero.id}`}
                    className="grid h-10 w-10 place-items-center rounded-full border border-line-strong bg-surface text-ink transition-colors hover:border-accent hover:text-accent"
                    aria-label={`Open ${formatName(hero.name)}`}
                  >
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                )}
              </div>

              <div className="mt-4 flex gap-1.5">
                {featured.map((item, index) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActive(index)}
                    className={`h-1 flex-1 rounded-full transition-colors ${
                      index === active ? 'bg-ink' : 'bg-line-strong/60 hover:bg-line-strong'
                    }`}
                    aria-label={`Show ${formatName(item.name)}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <Marquee items={ROLLING_NAMES} />

      <section className="wrap py-14">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="kicker">Pick a side</div>
            <h2 className="mt-3 font-display text-[2rem] font-extrabold tracking-tight">Classic starters, no debate</h2>
          </div>
          <Link to="/dex" className="btn-quiet">
            Open the full dex <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STARTERS.map((starter, index) => (
            <Reveal key={starter.id} delay={index * 70}>
              <PokemonCard id={starter.id} name={starter.name} types={starter.types} />
            </Reveal>
          ))}
        </div>
      </section>

      <section id="types" className="border-y border-line bg-surface/50">
        <div className="wrap py-14">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <div className="kicker">18 types</div>
              <h2 className="mt-3 font-display text-[2rem] font-extrabold tracking-tight">Start from a type</h2>
            </div>
            <span className="mono text-faint">filter the dex in one tap</span>
          </div>

          <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-6 lg:grid-cols-9">
            {TYPE_ORDER.map((type, index) => {
              const meta = TYPE_META[type]
              return (
                <Reveal key={type} delay={Math.min(index * 25, 220)}>
                  <Link
                    to={`/dex?type=${type}`}
                    className="group flex items-center justify-between gap-2 rounded-xl border border-line bg-surface px-3 py-2.5 transition-all hover:-translate-y-0.5 hover:border-line-strong hover:shadow-[0_16px_30px_-24px_rgba(20,18,26,0.5)]"
                  >
                    <span className="flex items-center gap-1.5">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ background: `linear-gradient(135deg, ${meta.a}, ${meta.b})` }}
                      />
                      <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted group-hover:text-ink">
                        {type}
                      </span>
                    </span>
                    <ArrowUpRight className="h-3 w-3 text-faint opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      <section className="wrap py-14">
        <div className="mb-6">
          <div className="kicker">Rarity</div>
          <h2 className="mt-3 font-display text-[2rem] font-extrabold tracking-tight">Some are just harder to find</h2>
          <p className="mt-2 max-w-xl text-[14px] leading-relaxed text-muted">
            Every species carries a rarity tier based on official status and catch rate — so a legendary never hides
            between two route-one birds.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              tier: 'Legendary' as const,
              text: 'Ancient, region-defining species. One per save file energy.',
            },
            {
              tier: 'Mythical' as const,
              text: 'Event-only species from the edges of the dex.',
            },
            {
              tier: 'Rare' as const,
              text: 'Ordinary dex numbers with a catch rate that says otherwise.',
            },
          ].map((item, index) => (
            <Reveal key={item.tier} delay={index * 80}>
              <div className="card card-hover flex h-full flex-col p-5">
                <RarityBadge tier={item.tier} size="md" />
                <p className="mt-3 text-[13.5px] leading-relaxed text-muted">{item.text}</p>
                <Link
                  to="/dex?special=1"
                  className="mt-auto flex items-center gap-1.5 pt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-accent"
                >
                  Browse legendary & mythical <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="wrap pb-16">
        <Reveal>
          <div className="card relative overflow-hidden px-6 py-12 text-center sm:px-12">
            <div className="pokeball-ring pointer-events-none absolute inset-0 opacity-70" />
            <div className="relative">
              <div className="kicker justify-center">Nine generations, one shelf</div>
              <h2 className="mx-auto mt-3 max-w-2xl font-display text-[2.1rem] font-extrabold leading-[1.02] tracking-tight sm:text-[2.9rem]">
                Know the dex. Keep the <span className="text-accent">favourites.</span>
              </h2>
              <p className="mx-auto mt-3 max-w-lg text-[14.5px] leading-relaxed text-muted">
                {GENERATIONS.length} generations, every stat, every evolution, and a heart button that remembers.
              </p>
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <Link to="/dex" className="btn-ink">
                  <Sparkles className="h-4 w-4" /> Start browsing
                </Link>
                <Link to="/favorites" className="btn-accent">
                  <Star className="h-4 w-4" /> Your favourites
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  )
}
