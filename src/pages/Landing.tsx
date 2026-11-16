import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, Sparkles, Star } from 'lucide-react'
import CountUp from '../components/CountUp'
import HeroPreview from '../components/HeroPreview'
import Marquee from '../components/Marquee'
import PokemonCard from '../components/PokemonCard'
import RarityBadge from '../components/RarityBadge'
import Reveal from '../components/Reveal'
import SearchDock from '../components/SearchDock'
import {
  GENERATIONS,
  LEGENDARY_IDS,
  MYTHICAL_IDS,
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
  const [legendaries, setLegendaries] = useState<PokemonDetail[]>([])
  const [all, setAll] = useState<PokemonEntry[]>([])
  const [scrollOffset, setScrollOffset] = useState(0)

  useEffect(() => {
    document.title = 'Dexa — every Pokémon, one clean dex'
    let alive = true
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

  const specialCount = LEGENDARY_IDS.size + MYTHICAL_IDS.size

  return (
    <div className="pop-in">
      <section className="relative overflow-hidden pb-14 pt-6 sm:pb-20 sm:pt-10">
        <div className="hero-grid pointer-events-none absolute inset-0" aria-hidden="true" />
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[560px]"
          style={{ background: 'radial-gradient(58% 70% at 50% 0%, rgba(245,37,63,0.22), transparent 72%)' }}
          aria-hidden="true"
        />

        <img
          src={artworkUrl(25)}
          alt=""
          aria-hidden="true"
          className="sprite-float pointer-events-none absolute left-[4%] top-[24%] hidden h-24 w-24 object-contain opacity-40 lg:block"
          style={{ transform: `translateY(${-scrollOffset * 0.04}px)` }}
        />
        <img
          src={artworkUrl(94)}
          alt=""
          aria-hidden="true"
          className="sprite-float pointer-events-none absolute right-[5%] top-[16%] hidden h-28 w-28 object-contain opacity-35 lg:block"
          style={{ animationDelay: '-2s', transform: `translateY(${-scrollOffset * 0.06}px)` }}
        />
        <img
          src={artworkUrl(6)}
          alt=""
          aria-hidden="true"
          className="sprite-float pointer-events-none absolute bottom-[18%] left-[8%] hidden h-24 w-24 object-contain opacity-25 xl:block"
          style={{ animationDelay: '-4s' }}
        />
        <img
          src={artworkUrl(150)}
          alt=""
          aria-hidden="true"
          className="sprite-float pointer-events-none absolute bottom-[24%] right-[9%] hidden h-24 w-24 object-contain opacity-25 xl:block"
          style={{ animationDelay: '-1s' }}
        />

        <div className="wrap relative flex flex-col items-center text-center">
          <Reveal>
            <div className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/70 px-3.5 py-1.5 backdrop-blur">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                1025 species · no account · free
              </span>
            </div>
            <h1 className="mx-auto mt-6 max-w-4xl font-display text-[3.1rem] font-extrabold leading-[0.92] tracking-[-0.055em] sm:text-[4.6rem] lg:text-[5.4rem]">
              The whole Pokédex.
              <br />
              <span className="text-gradient">One quiet tab.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-[15.5px] leading-relaxed text-muted">
              Every species, every stat, every evolution — searchable by name or number and indexed locally, so it
              opens before you finish typing.
            </p>
          </Reveal>

          <Reveal delay={110} className="mt-8 w-full max-w-xl">
            <SearchDock size="hero" placeholder="Try “gengar”, “151”, “dragapult”…" />
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
              <span className="mono text-faint">Popular</span>
              {['pikachu', 'gengar', 'lucario', 'umbreon'].map((name) => (
                <Link key={name} to={`/dex?q=${name}`} className="chip">
                  {formatName(name)}
                </Link>
              ))}
            </div>
          </Reveal>

          <Reveal delay={180} className="mt-7">
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link to="/dex" className="btn-accent">
                Open the dex <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link to="/random" className="btn-quiet">
                Roll a random species
              </Link>
            </div>
            <p className="mono mt-4 text-faint">Free · fan-made · data from PokéAPI · no sign-up</p>
          </Reveal>

          <Reveal delay={240} variant="scale" className="mt-12 w-full max-w-3xl">
            <HeroPreview />
          </Reveal>

          <Reveal delay={320} className="mt-10 w-full">
            <div className="mx-auto grid max-w-2xl grid-cols-2 gap-y-5 border-y border-line py-5 sm:grid-cols-4">
              {[
                { value: 1025, label: 'species' },
                { value: 18, label: 'types' },
                { value: 9, label: 'generations' },
                { value: specialCount, label: 'legendary + mythical' },
              ].map((stat) => (
                <div key={stat.label} className="px-2">
                  <div className="font-display text-2xl font-extrabold tracking-tight">
                    <CountUp value={stat.value} />
                  </div>
                  <div className="mono mt-0.5 text-[9px] uppercase tracking-[0.1em] text-faint">{stat.label}</div>
                </div>
              ))}
            </div>
            <a
              href="#starters"
              className="mono mt-8 inline-flex items-center gap-1.5 text-faint transition-colors hover:text-accent"
            >
              Scroll the dex <span className="inline-block animate-bounce">↓</span>
            </a>
          </Reveal>
        </div>
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

      <section id="starters" className="wrap py-14">
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
