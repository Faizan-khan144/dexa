import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, Sparkles, Star } from 'lucide-react'
import CountUp from '../components/CountUp'
import GenTimeline from '../components/GenTimeline'
import LegendarySpotlight from '../components/LegendarySpotlight'
import Marquee from '../components/Marquee'
import RarityBadge from '../components/RarityBadge'
import Reveal from '../components/Reveal'
import SearchDock from '../components/SearchDock'
import StatBar from '../components/StatBar'
import TypeBadge from '../components/TypeBadge'
import TypeExplorer from '../components/TypeExplorer'
import {
  GENERATIONS,
  LEGENDARY_IDS,
  MYTHICAL_IDS,
  TYPE_META,
  artworkUrl,
  formatDexId,
  formatName,
  getIndex,
  getMany,
  spriteUrl,
  staticRarity,
  type PokemonDetail,
  type PokemonEntry,
} from '../lib/pokedex'

const FEATURED_IDS = [25, 94, 448, 6, 150, 133]

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

export default function Landing() {
  const [featured, setFeatured] = useState<PokemonDetail[]>([])
  const [all, setAll] = useState<PokemonEntry[]>([])
  const [active, setActive] = useState(0)
  const [scrollOffset, setScrollOffset] = useState(0)

  useEffect(() => {
    document.title = 'Dexa — every Pokémon, one clean dex'
    let alive = true
    getMany(FEATURED_IDS)
      .then((list) => {
        if (alive) setFeatured(list)
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

  useEffect(() => {
    if (featured.length < 2) return
    const timer = window.setInterval(() => setActive((value) => (value + 1) % featured.length), 5200)
    return () => window.clearInterval(timer)
  }, [featured.length])

  const specimen = featured[active]
  const specimenMeta = TYPE_META[specimen?.types[0]?.type.name ?? 'electric'] ?? TYPE_META.normal
  const specialCount = LEGENDARY_IDS.size + MYTHICAL_IDS.size
  const rarity = specimen ? staticRarity(specimen.id) : null

  return (
    <div className="pop-in">
      <section className="relative overflow-hidden pb-14 pt-6 sm:pb-20 sm:pt-10">
        <div className="hero-grid pointer-events-none absolute inset-0" aria-hidden="true" />
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[560px]"
          style={{ background: 'radial-gradient(58% 70% at 50% 0%, rgba(225,29,60,0.14), transparent 72%)' }}
          aria-hidden="true"
        />

        <img
          src={artworkUrl(25)}
          alt=""
          aria-hidden="true"
          className="sprite-float pointer-events-none absolute left-[4%] top-[26%] hidden h-24 w-24 object-contain opacity-25 lg:block"
          style={{ transform: `translateY(${-scrollOffset * 0.04}px)` }}
        />
        <img
          src={artworkUrl(94)}
          alt=""
          aria-hidden="true"
          className="sprite-float pointer-events-none absolute right-[5%] top-[18%] hidden h-28 w-28 object-contain opacity-20 lg:block"
          style={{ animationDelay: '-2s', transform: `translateY(${-scrollOffset * 0.06}px)` }}
        />
        <img
          src={artworkUrl(6)}
          alt=""
          aria-hidden="true"
          className="sprite-float pointer-events-none absolute bottom-[16%] left-[7%] hidden h-24 w-24 object-contain opacity-15 xl:block"
          style={{ animationDelay: '-4s' }}
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

          <Reveal delay={240} variant="scale" className="mt-12 w-full max-w-4xl">
            <div className="card overflow-hidden text-left">
              <div className="grid md:grid-cols-[1.02fr_0.98fr]">
                <div
                  className="relative flex min-h-[320px] items-center justify-center overflow-hidden"
                  style={{
                    background: `radial-gradient(110% 100% at 50% 10%, ${specimenMeta.a}2e, var(--color-surface) 66%)`,
                  }}
                >
                  <span className="dex-number pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 select-none text-[9rem] sm:text-[11rem]">
                    {specimen ? String(specimen.id).padStart(3, '0') : '000'}
                  </span>
                  <span className="orbit pointer-events-none" aria-hidden="true" />
                  {specimen ? (
                    <img
                      key={specimen.id}
                      src={artworkUrl(specimen.id)}
                      alt={formatName(specimen.name)}
                      className="sprite-float relative h-[240px] w-[240px] object-contain drop-shadow-[0_26px_28px_rgba(24,13,16,0.28)] sm:h-[270px] sm:w-[270px]"
                    />
                  ) : (
                    <div className="skeleton relative h-52 w-52 rounded-full" />
                  )}

                  <div className="absolute left-4 top-4 flex flex-col items-start gap-1.5">
                    {rarity && <RarityBadge tier={rarity} />}
                    <span className="mono text-faint">{specimen ? formatDexId(specimen.id) : '#—'}</span>
                  </div>
                </div>

                <div className="flex flex-col p-6 sm:p-7">
                  <div className="flex items-center justify-between gap-2">
                    <div className="kicker">Featured specimen</div>
                    <div className="flex gap-1">
                      {featured.map((item, index) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setActive(index)}
                          className={`h-1.5 w-1.5 rounded-full transition-all ${
                            index === active ? 'w-4 bg-accent' : 'bg-line-strong hover:bg-faint'
                          }`}
                          aria-label={`Show ${formatName(item.name)}`}
                        />
                      ))}
                    </div>
                  </div>

                  <h2 className="mt-3 font-display text-[2.2rem] font-extrabold leading-none tracking-[-0.045em] sm:text-[2.8rem]">
                    {specimen ? formatName(specimen.name) : 'Loading…'}
                  </h2>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {specimen?.types.map((entry) => (
                      <TypeBadge key={entry.type.name} type={entry.type.name} />
                    ))}
                  </div>

                  <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1">
                    <span className="mono text-faint">
                      height <span className="text-ink">{specimen ? `${(specimen.height / 10).toFixed(1)}m` : '—'}</span>
                    </span>
                    <span className="mono text-faint">
                      weight <span className="text-ink">{specimen ? `${(specimen.weight / 10).toFixed(1)}kg` : '—'}</span>
                    </span>
                    <span className="mono text-faint">
                      base exp <span className="text-ink">{specimen?.base_experience ?? '—'}</span>
                    </span>
                  </div>

                  <div key={specimen?.id} className="mt-5 space-y-2.5">
                    {specimen?.stats.slice(0, 3).map((stat) => (
                      <StatBar key={stat.stat.name} label={stat.stat.name.replace('special-', 'sp. ')} value={stat.base_stat} />
                    ))}
                  </div>

                  <div className="mt-auto flex flex-wrap items-center gap-2 pt-5">
                    <Link to={specimen ? `/pokemon/${specimen.id}` : '/dex'} className="btn-ink !px-4 !py-2 !text-[12px]">
                      Open dossier <ArrowRight className="h-3 w-3" />
                    </Link>
                    <Link
                      to="/dex"
                      className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted hover:text-accent"
                    >
                      See all 1025
                    </Link>
                  </div>
                </div>
              </div>
            </div>
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
              href="#types"
              className="mono mt-8 inline-flex items-center gap-1.5 text-faint transition-colors hover:text-accent"
            >
              Scroll the dex <span className="inline-block animate-bounce">↓</span>
            </a>
          </Reveal>
        </div>
      </section>

      <Marquee items={ROLLING_NAMES} />

      <section id="types" className="wrap py-16">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="kicker">18 types</div>
            <h2 className="mt-3 font-display text-[2rem] font-extrabold tracking-tight sm:text-[2.5rem]">
              Types are the language
            </h2>
            <p className="mt-2 max-w-lg text-[14px] leading-relaxed text-muted">
              Pick a type and the chart, the featured species and the way in all change together.
            </p>
          </div>
          <Link to="/types" className="btn-quiet">
            Type atlas <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <TypeExplorer />
      </section>

      <section className="border-y border-line bg-surface/50">
        <div className="wrap py-16">
          <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
            <div>
              <div className="kicker">Nine chapters</div>
              <h2 className="mt-3 font-display text-[2rem] font-extrabold tracking-tight sm:text-[2.5rem]">
                A region at a time
              </h2>
              <p className="mt-2 max-w-lg text-[14px] leading-relaxed text-muted">
                Scroll sideways through the timeline, then open any generation at its first dex entry.
              </p>
            </div>
            <Link to="/generations" className="btn-quiet">
              Full timeline <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <GenTimeline />
        </div>
      </section>

      <section className="wrap py-16">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="kicker">Rarity on display</div>
            <h2 className="mt-3 font-display text-[2rem] font-extrabold tracking-tight sm:text-[2.5rem]">
              Legends, up close
            </h2>
            <p className="mt-2 max-w-lg text-[14px] leading-relaxed text-muted">
              Six headline species, their tiers and their stat spread — no scrolling required.
            </p>
          </div>
          <Link to="/dex?special=1" className="btn-quiet">
            Legendary & mythical <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <LegendarySpotlight />
      </section>

      <section className="border-y border-line">
        <div className="wrap grid divide-y divide-line md:grid-cols-3 md:divide-x md:divide-y-0">
          {[
            {
              n: '01',
              title: 'Local-first index',
              text: 'The 1025-name index is cached for a day, so repeat searches skip the network entirely.',
            },
            {
              n: '02',
              title: 'No accounts, ever',
              text: 'Favourites live in your browser. Nothing to sign up for, nothing to leak.',
            },
            {
              n: '03',
              title: 'One public API',
              text: 'PokéAPI for data, its sprite repo for artwork. No keys, no proxies, no hidden limits.',
            },
          ].map((item) => (
            <div key={item.n} className="px-1 py-8 md:px-7">
              <div className="mono text-accent">{item.n}</div>
              <h3 className="mt-3 font-display text-lg font-extrabold tracking-tight">{item.title}</h3>
              <p className="mt-1.5 text-[13px] leading-relaxed text-muted">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="wrap py-16">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="kicker">The full wall</div>
            <h2 className="mt-3 font-display text-[2rem] font-extrabold tracking-tight sm:text-[2.5rem]">
              All 1025. No exceptions.
            </h2>
            <p className="mt-2 max-w-xl text-[14px] leading-relaxed text-muted">
              Every sprite, every dex number. Hover for the number, click for the dossier.
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

      <Marquee items={SECOND_MARQUEE} reverse />

      <section className="wrap py-16">
        <Reveal>
          <div className="card relative overflow-hidden px-6 py-12 text-center sm:px-12">
            <div className="pokeball-ring pointer-events-none absolute inset-0 opacity-70" />
            <div className="relative">
              <div className="kicker justify-center">Nine generations, one shelf</div>
              <h2 className="mx-auto mt-3 max-w-2xl font-display text-[2.1rem] font-extrabold leading-[1.02] tracking-tight sm:text-[3rem]">
                Know the dex. Keep the <span className="text-gradient">favourites.</span>
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
              <Link
                to="/about"
                className="mono mt-6 inline-flex items-center gap-1 text-faint hover:text-accent"
              >
                How Dexa is built <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  )
}
