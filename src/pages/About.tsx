import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Database, Gauge, Heart, Keyboard, Layers, Search, Sparkles } from 'lucide-react'
import RarityBadge from '../components/RarityBadge'
import Reveal from '../components/Reveal'
import SpotlightCard from '../components/SpotlightCard'
import { RARITY_META, TYPE_ORDER, type RarityTier } from '../lib/pokedex'

const TIERS: RarityTier[] = ['Mythical', 'Legendary', 'Rare', 'Uncommon', 'Common']

const FEATURES = [
  {
    icon: Search,
    title: 'Search first, browse second',
    text: 'The whole index loads once and lives in localStorage. Typing filters 1025 names instantly, by name or number.',
  },
  {
    icon: Gauge,
    title: 'Stats that animate',
    text: 'Base stats, catch rate and the full defensive chart, rendered as bars and chips instead of raw JSON.',
  },
  {
    icon: Layers,
    title: 'Every evolution stage',
    text: 'Evolution lines are flattened into generations of sprites so you can walk the whole family in one click.',
  },
  {
    icon: Heart,
    title: 'Favourites without accounts',
    text: 'A heart writes to a zustand store that persists locally. No login, no sync, no server to go down.',
  },
]

const STEPS = [
  { n: '01', title: 'Search', text: 'Press / anywhere in the dex and type a name or dex number. The index is local, so it answers instantly.' },
  { n: '02', title: 'Filter', text: 'Type, generation and rarity all write to the URL. Share a filtered dex and the link opens exactly there.' },
  { n: '03', title: 'Open', text: 'One click lands on a full dossier: artwork, cry, stats, defences and the whole evolution family.' },
]

export default function About() {
  useEffect(() => {
    document.title = 'About · Dexa'
  }, [])

  return (
    <div className="pop-in wrap py-9">
      <section className="grain relative overflow-hidden rounded-3xl border border-line bg-surface px-6 py-12 sm:px-10 sm:py-16">
        <div className="hero-grid pointer-events-none absolute inset-0 opacity-70" aria-hidden="true" />
        <div className="aurora aurora-a -left-20 -top-24 h-72 w-72 bg-accent/15" aria-hidden="true" />
        <div className="aurora aurora-b -right-16 top-10 h-80 w-80 bg-[#f7c948]/20" aria-hidden="true" />
        <div className="relative">
          <div className="kicker">About the project</div>
          <h1 className="mt-3 max-w-4xl font-display text-[2.7rem] font-extrabold leading-[0.93] tracking-[-0.05em] sm:text-[3.9rem]">
            A dex built for people who <span className="text-gradient">actually look things up.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-[15.5px] leading-relaxed text-muted">
            Dexa is a small, fast, unofficial Pokédex. No ads, no account wall, no twelve-tab wiki. One search field,
            1025 species, and every stat, cry and evolution you would actually want mid-conversation.
          </p>
          <div className="mt-7 flex flex-wrap gap-2">
            <Link to="/dex" className="btn-accent">
              <Sparkles className="h-4 w-4" /> Open the dex
            </Link>
            <a
              href="https://github.com/Faizan-khan144/dexa"
              target="_blank"
              rel="noreferrer"
              className="btn-quiet"
            >
              Star it on GitHub <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </section>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {FEATURES.map((feature, index) => (
          <Reveal key={feature.title} delay={index * 70}>
            <SpotlightCard className="card h-full p-5" tilt={2.4}>
              <span className="grid h-10 w-10 place-items-center rounded-xl border border-line bg-surface2 text-accent">
                <feature.icon className="h-4 w-4" />
              </span>
              <h2 className="mt-4 font-display text-lg font-extrabold tracking-tight">{feature.title}</h2>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted">{feature.text}</p>
            </SpotlightCard>
          </Reveal>
        ))}
      </div>

      <section className="mt-12">
        <div className="kicker">Three moves</div>
        <h2 className="mt-2 font-display text-2xl font-extrabold tracking-tight">How the dex works</h2>
        <div className="mt-4 grid divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface md:grid-cols-3 md:divide-x md:divide-y-0">
          {STEPS.map((step) => (
            <div key={step.n} className="p-5 sm:p-6">
              <div className="mono text-accent">{step.n}</div>
              <h3 className="mt-2 font-display text-lg font-extrabold tracking-tight">{step.title}</h3>
              <p className="mt-1.5 text-[13px] leading-relaxed text-muted">{step.text}</p>
            </div>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          <span className="chip">
            <Keyboard className="h-3 w-3" /> / focus search
          </span>
          <span className="chip">
            <Keyboard className="h-3 w-3" /> esc reset filters
          </span>
          <span className="chip">hearts persist locally</span>
        </div>
      </section>

      <section className="mt-12">
        <Reveal>
          <div className="card overflow-hidden">
            <div className="border-b border-line px-5 py-4">
              <div className="kicker">Rarity</div>
              <h2 className="mt-2 font-display text-xl font-extrabold tracking-tight">Five tiers, one rule each</h2>
            </div>
            <div className="divide-y divide-line">
              {TIERS.map((tier) => (
                <div key={tier} className="flex flex-wrap items-center gap-3 px-5 py-3.5 transition-colors hover:bg-surface2/40">
                  <RarityBadge tier={tier} size="md" />
                  <span className="text-[13.5px] text-muted">{RARITY_META[tier].note}</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      <section className="mt-12 grid gap-4 md:grid-cols-2">
        <Reveal>
          <div className="card h-full p-5">
            <div className="kicker">Stack</div>
            <h2 className="mt-2 font-display text-lg font-extrabold tracking-tight">Small, boring on purpose</h2>
            <p className="mt-2 text-[13.5px] leading-relaxed text-muted">
              React 19, TypeScript, Vite, Tailwind 4, React Router and zustand. Motion is CSS and IntersectionObserver —
              no animation dependency, no state library beyond favourites.
            </p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {['React 19', 'TypeScript', 'Vite', 'Tailwind 4', 'zustand', 'PokéAPI'].map((item) => (
                <span key={item} className="chip">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
        <Reveal delay={80}>
          <div className="card h-full p-5">
            <div className="kicker">Coverage</div>
            <h2 className="mt-2 font-display text-lg font-extrabold tracking-tight">The numbers</h2>
            <div className="mt-3 grid grid-cols-2 gap-3">
              {[
                { value: '1025', label: 'species' },
                { value: String(TYPE_ORDER.length), label: 'types' },
                { value: '9', label: 'generations' },
                { value: '0', label: 'accounts required' },
              ].map((stat) => (
                <div key={stat.label} className="rounded-xl border border-line bg-surface2/60 px-3 py-2.5">
                  <div className="font-display text-xl font-extrabold tracking-tight">{stat.value}</div>
                  <div className="mono text-faint">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      <Reveal>
        <div className="card mt-12 flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <Database className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
            <p className="max-w-xl text-[13px] leading-relaxed text-muted">
              Data comes from <span className="text-ink">PokéAPI</span>; artwork and sprites from the PokeAPI sprites
              repository. Dexa is an unofficial fan project, not affiliated with Nintendo, Creatures Inc. or GAME FREAK.
            </p>
          </div>
          <p className="shrink-0 text-[13px] text-muted">
            Built by <span className="font-semibold text-ink">Faizan Khan</span>.
          </p>
        </div>
      </Reveal>
    </div>
  )
}
