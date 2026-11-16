import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, Search, Sparkles, Star } from 'lucide-react'
import CountUp from '../components/CountUp'
import Marquee from '../components/Marquee'
import PokemonCard from '../components/PokemonCard'
import RarityBadge from '../components/RarityBadge'
import Reveal from '../components/Reveal'
import SearchDock from '../components/SearchDock'
import {
  GENERATIONS,
  TYPE_META,
  TYPE_ORDER,
  artworkUrl,
  formatDexId,
  formatName,
  getIndex,
  getMany,
  spriteUrl,
  type PokemonDetail,
  type PokemonEntry,
} from '../lib/pokedex'

const STARTERS = [
  { id: 1, name: 'bulbasaur', types: ['grass', 'poison'] },
  { id: 4, name: 'charmander', types: ['fire'] },
  { id: 7, name: 'squirtle', types: ['water'] },
  { id: 25, name: 'pikachu', types: ['electric'] },
]

const FEATURED_IDS = [6, 448, 133, 150, 384, 94]

const LEGENDARY_SHOWCASE = [150, 249, 384, 483, 888, 1008]

const GEN_ICONS: Record<number, number> = {
  1: 25,
  2: 155,
  3: 252,
  4: 387,
  5: 495,
  6: 650,
  7: 722,
  8: 813,
  9: 906,
}

const SECOND_MARQUEE = [
  'Bulbasaur',
  'Squirtle',
  'Jigglypuff',
  'Machamp',
  'Alakazam',
  'Arcanine',
  'Snorlax',
  'Mewtwo',
  'Scizor',
  'Blissey',
  'Metagross',
  'Infernape',
  'Zoroark',
  'Aegislash',
  'Toxtricity',
  'Annihilape',
]

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
  const [legendaries, setLegendaries] = useState<PokemonDetail[]>([])
  const [all, setAll] = useState<PokemonEntry[]>([])
  const [scrollOffset, setScrollOffset] = useState(0)

  useEffect(() => {
    document.title = 'Dexa — every Pokémon, one clean dex'
    let alive = true
    getMany(FEATURED_IDS)
      .then((list) => {
        if (alive) setFeatured(list)
      })
      .catch(() => undefined)
    getMany(LEGENDARY_SHOWCASE)
      .then((list) => {
        if (alive) setLegendaries(list)
      })
      .catch(() => undefined)
    getIndex()
      .then((list) => {
        if (alive) setAll(list)
      })
      .catch(() => undefined)
    return () => {
      alive = false
    }
  }, [])

  useEffect(() => {
    const onScroll = () => setScrollOffset(Math.min(window.scrollY, 700))
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const preview = featured[0]
  const previewStats = preview ? preview.stats.slice(0, 3) : []
  const previewTotal = previewStats.reduce((total, stat) => total + stat.base_stat, 0)

  return (
    <div className="pop-in">
      <section className="wrap grid gap-10 pb-12 pt-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:pb-16 lg:pt-16">
        <div className="max-w-xl">
          <Reveal>
            <div className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/70 px-3 py-1.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                All 1025 species · no account
              </span>
            </div>
            <h1 className="mt-5 font-display text-[3rem] font-extrabold leading-[0.94] tracking-[-0.05em] sm:text-[4.35rem]">
              Every Pokémon.
              <br />
              One quiet <span className="text-gradient">dex.</span>
            </h1>
            <p className="mt-5 max-w-lg text-[15.5px] leading-relaxed text-muted">
              Types, stats, evolution lines and cries for every species — indexed locally, searchable by name or
              number, and ready before the conversation moves on.
            </p>
          </Reveal>

          <Reveal delay={100}>
            <div className="mt-7">
              <SearchDock size="hero" placeholder="Try “gengar”, “151”, “dragapult”…" />
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="mono text-faint">Popular</span>
              {['pikachu', 'gengar', 'lucario', 'umbreon'].map((name) => (
                <Link key={name} to={`/dex?q=${name}`} className="chip">
                  {formatName(name)}
                </Link>
              ))}
            </div>
          </Reveal>

          <Reveal delay={180}>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link to="/dex" className="btn-accent">
                Open the dex <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link to="/random" className="btn-quiet">
                Surprise me
              </Link>
            </div>
            <p className="mono mt-4 text-faint">Free · fan-made · data from PokéAPI</p>
            <div className="mt-7 grid max-w-md grid-cols-3 gap-3 border-t border-line pt-5">
              {[
                { value: 1025, label: 'species' },
                { value: 18, label: 'types' },
                { value: 9, label: 'generations' },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="font-display text-xl font-extrabold tracking-tight">
                    <CountUp value={stat.value} />
                  </div>
                  <div className="mono mt-0.5 text-[9px] uppercase tracking-[0.1em] text-faint">{stat.label}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal variant="right" delay={140}>
          <div className="relative" style={{ transform: `translateY(${-scrollOffset * 0.02}px)` }}>
            <div className="absolute -inset-6 rounded-[3rem] bg-gradient-to-br from-accent/25 via-transparent to-sun/10 blur-2xl" />
            <div className="card relative overflow-hidden">
              <div className="flex items-center gap-2 border-b border-line bg-surface2/60 px-4 py-2.5">
                <span className="flex gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-accent/70" />
                  <span className="h-2 w-2 rounded-full bg-sun/60" />
                  <span className="h-2 w-2 rounded-full bg-line-strong" />
                </span>
                <span className="mx-auto flex items-center gap-1.5 rounded-full border border-line bg-bg/60 px-3 py-1 font-mono text-[9px] text-faint">
                  dexa.app/dex
                </span>
                <span className="mono text-[9px] text-faint">live</span>
              </div>

              <div className="p-4">
                <div className="flex items-center gap-2 rounded-full border border-line-strong bg-bg/60 px-3 py-2.5">
                  <Search className="h-3.5 w-3.5 text-faint" />
                  <span className="flex-1 text-[12px] text-faint">Search 1025 species…</span>
                  <kbd className="rounded border border-line bg-surface px-1.5 py-0.5 font-mono text-[9px] text-faint">
                    /
                  </kbd>
                </div>

                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {['fire', 'water', 'grass', 'psychic'].map((type, index) => (
                    <span key={type} className="chip" data-active={index === 0}>
                      {type}
                    </span>
                  ))}
                  <span className="chip">+14</span>
                </div>

                <div className="mt-3 grid grid-cols-3 gap-2">
                  {featured.length > 0
                    ? featured.slice(0, 3).map((item) => (
                        <Link
                          key={item.id}
                          to={`/pokemon/${item.id}`}
                          className="group rounded-xl border border-line bg-bg/40 p-2 text-center transition-colors hover:border-accent/50"
                        >
                          <img
                            src={artworkUrl(item.id)}
                            alt={formatName(item.name)}
                            className="mx-auto h-[72px] w-[72px] object-contain drop-shadow-[0_10px_12px_rgba(0,0,0,0.5)] transition-transform group-hover:-translate-y-1"
                          />
                          <div className="mt-1 truncate font-display text-[12px] font-bold">
                            {formatName(item.name)}
                          </div>
                          <div className="mono text-[8px] text-faint">{formatDexId(item.id)}</div>
                        </Link>
                      ))
                    : Array.from({ length: 3 }).map((_, index) => (
                        <div key={index} className="skeleton h-[118px] rounded-xl" />
                      ))}
                </div>

                <div className="mt-3 rounded-xl border border-line bg-bg/40 p-3">
                  <div className="flex items-center justify-between">
                    <span className="mono text-[9px] uppercase tracking-[0.12em] text-faint">Base stats</span>
                    <span className="mono text-[9px] text-faint">total {previewTotal || '—'}</span>
                  </div>
                  <div className="mt-2.5 space-y-1.5">
                    {(previewStats.length > 0 ? previewStats : [{ base_stat: 60 }]).map((stat, index) => (
                      <div key={index} className="h-1.5 overflow-hidden rounded-full bg-surface2">
                        <div
                          className="stat-fill"
                          data-tone={index === 0 ? 'high' : 'mid'}
                          style={{ width: `${Math.min(100, (stat.base_stat / 180) * 100)}%` }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-line px-4 py-2.5">
                <span className="mono text-[9px] text-faint">1025 species · 18 types · 9 generations</span>
                <span className="mono flex items-center gap-1 text-[9px] text-faint">
                  <span className="h-1 w-1 rounded-full bg-accent" /> live
                </span>
              </div>
            </div>

            <div className="absolute -left-4 top-[38%] hidden sm:block">
              <div className="card !rounded-2xl px-3 py-2 shadow-[0_20px_40px_-24px_rgba(0,0,0,0.9)]">
                <div className="mono text-[8px] uppercase tracking-[0.12em] text-faint">Rarity</div>
                <div className="mt-1">
                  <RarityBadge tier="Legendary" />
                </div>
              </div>
            </div>

            <div className="absolute -right-3 bottom-24 hidden sm:block">
              <div className="card !rounded-2xl px-3 py-2 shadow-[0_20px_40px_-24px_rgba(0,0,0,0.9)]">
                <div className="mono text-[8px] uppercase tracking-[0.12em] text-faint">Indexed</div>
                <div className="font-display text-lg font-extrabold leading-tight">
                  <CountUp value={1025} />
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="border-y border-line bg-surface/40">
        <div className="wrap flex flex-wrap items-center justify-between gap-3 py-4">
          <span className="mono text-faint">Built on the open PokéAPI</span>
          <div className="flex flex-wrap items-center gap-1.5">
            {['PokéAPI', 'Official artwork', 'Cries', 'React 19', 'Vite'].map((item) => (
              <span key={item} className="chip">
                {item}
              </span>
            ))}
          </div>
        </div>
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
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="kicker">The ones in the stories</div>
            <h2 className="mt-3 font-display text-[2rem] font-extrabold tracking-tight">Legendary company</h2>
          </div>
          <Link to="/dex?special=1" className="btn-quiet">
            All legendary & mythical <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="dex-grid">
          {legendaries.length === 0
            ? Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="card overflow-hidden">
                  <div className="skeleton h-[176px] rounded-none" />
                  <div className="space-y-2 p-4">
                    <div className="skeleton h-4 w-2/3" />
                    <div className="skeleton h-3 w-1/3" />
                  </div>
                </div>
              ))
            : legendaries.map((item, index) => (
                <Reveal key={item.id} delay={Math.min(index * 60, 240)}>
                  <PokemonCard
                    id={item.id}
                    name={item.name}
                    types={item.types.map((entry) => entry.type.name)}
                  />
                </Reveal>
              ))}
        </div>
      </section>

      <section className="border-y border-line bg-surface/50">
        <div className="wrap py-14">
          <div className="mb-6">
            <div className="kicker">Nine regions</div>
            <h2 className="mt-3 font-display text-[2rem] font-extrabold tracking-tight">Generation atlas</h2>
            <p className="mt-2 max-w-xl text-[14px] leading-relaxed text-muted">
              From Kanto's 151 to Paldea's 1025 — jump straight into a region and walk the dex from its first entry.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {GENERATIONS.map((generation, index) => (
              <Reveal key={generation.id} delay={Math.min(index * 45, 300)}>
                <Link to={`/dex?gen=${generation.id}`} className="card card-hover group flex items-center gap-4 p-4">
                  <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-line bg-bg/60">
                    <img
                      src={spriteUrl(GEN_ICONS[generation.id] ?? 25)}
                      alt=""
                      loading="lazy"
                      className="h-10 w-10 object-contain [image-rendering:pixelated] transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-110"
                    />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="mono text-faint">Generation {generation.label}</div>
                    <div className="font-display text-lg font-extrabold leading-tight">{generation.region}</div>
                    <div className="mono text-faint">
                      {formatDexId(generation.from)} – {formatDexId(generation.to)}
                    </div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-faint transition-all group-hover:-translate-y-0.5 group-hover:text-accent" />
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Marquee items={SECOND_MARQUEE} reverse />

      <section className="wrap py-14">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="kicker">The full wall</div>
            <h2 className="mt-3 font-display text-[2rem] font-extrabold tracking-tight">All 1025. No exceptions.</h2>
            <p className="mt-2 max-w-xl text-[14px] leading-relaxed text-muted">
              Every sprite, every dex number — the whole archive on one wall. Hover for the number, click for the
              dossier.
            </p>
          </div>
          <span className="mono text-faint">{all.length > 0 ? `${all.length} species` : 'indexing…'}</span>
        </div>
        <div className="grid grid-cols-8 gap-1 sm:grid-cols-12 md:grid-cols-[repeat(16,minmax(0,1fr))]">
          {all.length === 0
            ? Array.from({ length: 64 }).map((_, index) => <div key={index} className="skeleton aspect-square" />)
            : all.map((entry) => (
                <Link
                  key={entry.id}
                  to={`/pokemon/${entry.id}`}
                  title={`${formatDexId(entry.id)} ${formatName(entry.name)}`}
                  className="group relative grid aspect-square place-items-center rounded-lg border border-transparent bg-bg/50 transition-all duration-200 hover:-translate-y-1 hover:border-accent/50 hover:bg-accent/10"
                >
                  <img
                    src={spriteUrl(entry.id)}
                    alt={formatName(entry.name)}
                    loading="lazy"
                    className="h-9 w-9 object-contain [image-rendering:pixelated] transition-transform duration-200 group-hover:scale-125"
                  />
                  <span className="pointer-events-none absolute inset-x-0 bottom-0.5 text-center font-mono text-[7px] text-faint opacity-0 transition-opacity group-hover:opacity-100">
                    {entry.id}
                  </span>
                </Link>
              ))}
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
