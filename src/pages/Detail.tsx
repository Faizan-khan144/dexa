import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowRight, ChevronLeft, ChevronRight, Heart, Sparkles, Sun, Volume2 } from 'lucide-react'
import PokemonCard from '../components/PokemonCard'
import RarityBadge from '../components/RarityBadge'
import Reveal from '../components/Reveal'
import SpotlightCard from '../components/SpotlightCard'
import StatBar from '../components/StatBar'
import TypeBadge from '../components/TypeBadge'
import { useFavorites } from '../store/favorites'
import {
  STAT_LABELS,
  TYPE_META,
  artworkUrl,
  evolutions,
  flavorText,
  formatDexId,
  formatName,
  genus,
  getEvolution,
  getIndex,
  getMany,
  getPokemon,
  getSpecies,
  getType,
  rarityFromSpecies,
  spriteUrl,
  typeMultipliers,
  type EvolutionNode,
  type PokemonDetail,
  type Species,
  type TypeInfo,
} from '../lib/pokedex'

const MULTIPLIER_LABEL: Record<number, string> = {
  4: '×4',
  2: '×2',
  1: '×1',
  0.5: '½',
  0.25: '¼',
  0: '0',
}

const MAX_ID = 1025

export default function Detail() {
  const { id } = useParams()
  const numericId = Number(id)
  const [pokemon, setPokemon] = useState<PokemonDetail | null>(null)
  const [species, setSpecies] = useState<Species | null>(null)
  const [chain, setChain] = useState<EvolutionNode | null>(null)
  const [typeInfo, setTypeInfo] = useState<TypeInfo[]>([])
  const [more, setMore] = useState<PokemonDetail[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [playing, setPlaying] = useState(false)

  const favorites = useFavorites((state) => state.favorites)
  const toggle = useFavorites((state) => state.toggle)

  useEffect(() => {
    if (!Number.isFinite(numericId) || numericId < 1 || numericId > MAX_ID) {
      setError('That dex number does not exist.')
      setLoading(false)
      return
    }
    let alive = true
    setLoading(true)
    setError('')
    setPokemon(null)
    setSpecies(null)
    setChain(null)
    setTypeInfo([])
    setMore([])
    setPlaying(false)

    async function load() {
      try {
        const [mon, spec] = await Promise.all([getPokemon(numericId), getSpecies(numericId)])
        if (!alive) return
        setPokemon(mon)
        setSpecies(spec)
        document.title = `${formatName(mon.name)} · Dexa`
        setLoading(false)

        const [evo, ...types] = await Promise.all([
          spec.evolution_chain ? getEvolution(spec.evolution_chain.url).catch(() => null) : Promise.resolve(null),
          ...mon.types.map((entry) => getType(entry.type.name).catch(() => null)),
        ])
        if (!alive) return
        if (evo) setChain(evo)
        const resolved = types.filter((entry): entry is TypeInfo => Boolean(entry))
        setTypeInfo(resolved)

        const first = resolved[0]
        if (first) {
          const index = await getIndex()
          if (!alive) return
          const byName = new Map(index.map((entry) => [entry.name, entry.id] as const))
          const pool = first.pokemon
            .map((name) => byName.get(name))
            .filter((value): value is number => Boolean(value) && value !== numericId)
          const picks = Array.from(new Set(pool)).slice(numericId % 5, numericId % 5 + 8)
          const relatives = await getMany(picks.length > 0 ? picks : pool.slice(0, 8))
          if (alive) setMore(relatives.slice(0, 8))
        }
      } catch {
        if (!alive) return
        setError('This species could not be loaded. The dex may be offline.')
        setLoading(false)
      }
    }

    load()
    return () => {
      alive = false
    }
  }, [numericId])

  if (loading) {
    return (
      <div className="pop-in wrap py-8">
        <div className="card overflow-hidden">
          <div className="grid lg:grid-cols-[1.02fr_1.08fr]">
            <div className="skeleton min-h-[420px] rounded-none" />
            <div className="space-y-4 p-7">
              <div className="skeleton h-3 w-24" />
              <div className="skeleton h-12 w-2/3" />
              <div className="skeleton h-4 w-full" />
              <div className="skeleton h-4 w-5/6" />
              <div className="skeleton h-24 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !pokemon || !species) {
    return (
      <div className="wrap py-16">
        <div className="card mx-auto max-w-lg px-6 py-14 text-center">
          <h1 className="font-display text-2xl font-extrabold">Lost in the tall grass</h1>
          <p className="mt-2 text-[13.5px] text-muted">{error || 'No species found for this dex number.'}</p>
          <div className="mt-6 flex justify-center gap-2">
            <Link to="/dex" className="btn-ink">
              Back to the dex
            </Link>
            <Link to="/random" className="btn-quiet">
              Try a random species
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const primary = pokemon.types[0]?.type.name ?? 'normal'
  const meta = TYPE_META[primary] ?? TYPE_META.normal
  const rarity = rarityFromSpecies(species)
  const isFavorite = favorites.some((entry) => entry.id === pokemon.id)
  const image = pokemon.sprites.other?.['official-artwork']?.front_default ?? artworkUrl(pokemon.id)
  const cry = pokemon.cries?.latest ?? pokemon.cries?.legacy
  const genderFemale = species.gender_rate < 0 ? null : Math.round((species.gender_rate / 8) * 100)
  const previousId = Math.max(1, pokemon.id - 1)
  const nextId = Math.min(MAX_ID, pokemon.id + 1)

  const multipliers = typeMultipliers(typeInfo)
  const weaknesses = multipliers.filter((entry) => entry.multiplier > 1)
  const resistances = multipliers.filter((entry) => entry.multiplier < 1 && entry.multiplier > 0)
  const immunities = multipliers.filter((entry) => entry.multiplier === 0)

  const evolutionLine = chain ? evolutions(chain) : []
  const evolutionDepths = [...new Set(evolutionLine.map((entry) => entry.depth))].sort((a, b) => a - b)
  const statTotal = pokemon.stats.reduce((total, stat) => total + stat.base_stat, 0)

  const playCry = () => {
    if (!cry) return
    const audio = new Audio(cry)
    audio.volume = 0.5
    audio.onended = () => setPlaying(false)
    setPlaying(true)
    audio.play().catch(() => setPlaying(false))
  }

  const infoRows = [
    { label: 'Height', value: `${(pokemon.height / 10).toFixed(1)} m` },
    { label: 'Weight', value: `${(pokemon.weight / 10).toFixed(1)} kg` },
    { label: 'Base exp', value: pokemon.base_experience ? String(pokemon.base_experience) : '—' },
    { label: 'Habitat', value: species.habitat ? formatName(species.habitat.name) : 'Unknown' },
    { label: 'Growth', value: species.growth_rate ? formatName(species.growth_rate.name) : '—' },
    { label: 'Egg groups', value: species.egg_groups.map((entry) => formatName(entry.name)).join(', ') || '—' },
    { label: 'Gender', value: genderFemale === null ? 'Genderless' : `${100 - genderFemale}% ♂ · ${genderFemale}% ♀` },
    { label: 'Generation', value: species.generation ? formatName(species.generation.name) : '—' },
  ]

  const defenseGroups = [
    { label: 'Weak to', tone: 'text-accent', items: weaknesses },
    { label: 'Resists', tone: 'text-ink', items: resistances },
    { label: 'Immune to', tone: 'text-faint', items: immunities },
  ].filter((group) => group.items.length > 0)

  return (
    <div className="pop-in wrap py-7">
      <div className="mb-4 flex items-center justify-between gap-3">
        <Link to="/dex" className="btn-quiet">
          <ChevronLeft className="h-3.5 w-3.5" /> The dex
        </Link>
        <div className="flex items-center gap-2">
          <span className="mono hidden text-faint sm:block">{formatDexId(pokemon.id)}</span>
          <Link
            to={`/pokemon/${previousId}`}
            aria-label="Previous species"
            className={`grid h-8 w-8 place-items-center rounded-full border border-line bg-surface text-muted transition hover:border-accent hover:text-accent ${
              pokemon.id === 1 ? 'pointer-events-none opacity-40' : ''
            }`}
          >
            <ChevronLeft className="h-4 w-4" />
          </Link>
          <Link
            to={`/pokemon/${nextId}`}
            aria-label="Next species"
            className={`grid h-8 w-8 place-items-center rounded-full border border-line bg-surface text-muted transition hover:border-accent hover:text-accent ${
              pokemon.id === MAX_ID ? 'pointer-events-none opacity-40' : ''
            }`}
          >
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <SpotlightCard className="card overflow-hidden" tilt={1.4}>
        <div className="grid lg:grid-cols-[1.02fr_1.08fr]">
          <div
            className="relative flex min-h-[420px] items-center justify-center overflow-hidden"
            style={{ background: `radial-gradient(120% 95% at 50% 8%, ${meta.a}3a, var(--color-surface) 62%)` }}
          >
            <div className="hero-grid pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
            <span className="dex-number pointer-events-none absolute left-1/2 top-1 -translate-x-1/2 select-none text-[10rem] sm:text-[13rem]">
              {String(pokemon.id).padStart(3, '0')}
            </span>
            <span className="orbit pointer-events-none" aria-hidden="true" />
            <div className="aurora aurora-a left-1/4 top-10 h-40 w-40" style={{ background: `${meta.a}33` }} />
            <img
              src={image}
              alt={formatName(pokemon.name)}
              className="sprite-float relative h-[270px] w-[270px] object-contain drop-shadow-[0_32px_34px_rgba(24,13,16,0.32)] sm:h-[320px] sm:w-[320px]"
            />

            <div className="absolute inset-x-4 bottom-4 flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap gap-1.5">
                {pokemon.types.map((entry) => (
                  <TypeBadge key={entry.type.name} type={entry.type.name} size="md" />
                ))}
                <RarityBadge tier={rarity} size="md" />
              </div>
              <button
                type="button"
                onClick={playCry}
                disabled={!cry}
                className="btn-quiet !bg-surface/80 backdrop-blur disabled:opacity-40"
                title={cry ? 'Play cry' : 'No cry available'}
              >
                <Volume2 className={`h-3.5 w-3.5 ${playing ? 'text-accent' : ''}`} />
                {playing ? 'Playing…' : 'Cry'}
                {playing && (
                  <span className="ml-0.5 flex items-end gap-[2px]">
                    {[0, 1, 2].map((bar) => (
                      <span
                        key={bar}
                        className="w-[2px] animate-pulse rounded-full bg-accent"
                        style={{ height: `${5 + bar * 3}px`, animationDelay: `${bar * 120}ms` }}
                      />
                    ))}
                  </span>
                )}
              </button>
            </div>
          </div>

          <div className="flex flex-col p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="kicker" style={{ color: meta.a }}>
                {genus(species) || 'Species'}
              </div>
              <span className="mono text-faint">{formatDexId(pokemon.id)}</span>
            </div>

            <h1 className="mt-3 font-display text-[2.8rem] font-extrabold leading-[0.92] tracking-[-0.05em] sm:text-[3.6rem]">
              {formatName(pokemon.name)}
            </h1>

            <p className="mt-4 border-l-2 pl-4 text-[14.5px] leading-relaxed text-muted" style={{ borderColor: `${meta.a}80` }}>
              {flavorText(species) || 'No flavour text recorded for this species yet.'}
            </p>

            <div className="mt-5 flex flex-wrap gap-1.5">
              {pokemon.abilities.map((entry) => (
                <span key={entry.ability.name} className="chip">
                  {formatName(entry.ability.name)}
                  {entry.is_hidden && <span className="text-faint">· hidden</span>}
                </span>
              ))}
              <span className="chip">
                <Sun className="h-3 w-3" /> {species.base_happiness ?? '—'} happiness
              </span>
              <span className="chip">catch rate {species.capture_rate}</span>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-2.5 rounded-2xl border border-line bg-surface2/40 p-4 sm:grid-cols-4">
              {infoRows.map((row) => (
                <div key={row.label}>
                  <div className="mono text-[8.5px] uppercase tracking-[0.1em] text-faint">{row.label}</div>
                  <div className="mt-0.5 truncate font-display text-[13px] font-bold" title={row.value}>
                    {row.value}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-auto flex flex-wrap items-center gap-2 pt-5">
              <button
                type="button"
                onClick={() => toggle({ id: pokemon.id, name: pokemon.name, types: pokemon.types.map((entry) => entry.type.name) })}
                className={isFavorite ? 'btn-accent' : 'btn-ink'}
              >
                <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
                {isFavorite ? 'Saved to shelf' : 'Add to favourites'}
              </button>
              <Link to={`/types/${primary}`} className="btn-quiet">
                {formatName(primary)} type <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </SpotlightCard>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
        <Reveal>
          <div className="card h-full p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-extrabold tracking-tight">Base stats</h2>
              <span className="chip !py-1">
                total <span className="font-display font-extrabold text-ink">{statTotal}</span>
              </span>
            </div>
            <div className="mt-5 space-y-3.5">
              {pokemon.stats.map((stat) => (
                <StatBar
                  key={stat.stat.name}
                  label={STAT_LABELS[stat.stat.name] ?? formatName(stat.stat.name)}
                  value={stat.base_stat}
                />
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div className="card flex h-full flex-col p-5 sm:p-6">
            <h2 className="font-display text-lg font-extrabold tracking-tight">Defensive profile</h2>
            <p className="mt-1 text-[12.5px] text-muted">How incoming damage lands on this typing.</p>

            {defenseGroups.length === 0 && <p className="mono mt-5 text-faint">Loading type chart…</p>}

            <div className="mt-4 space-y-4">
              {defenseGroups.map((group) => (
                <div key={group.label}>
                  <div className={`mono text-[9px] uppercase tracking-[0.14em] ${group.tone}`}>
                    {group.label} · {group.items.length}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {group.items.map((entry) => (
                      <span key={entry.name} className="inline-flex items-center gap-1 rounded-full border border-line bg-surface px-2 py-0.5">
                        <TypeBadge type={entry.name} />
                        <span className="font-mono text-[9px] font-semibold text-muted">
                          {MULTIPLIER_LABEL[entry.multiplier]}
                        </span>
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-auto flex flex-wrap gap-2 pt-5">
              <span className="chip">
                <Sparkles className="h-3 w-3" /> {rarity} tier
              </span>
              <Link to={`/dex?type=${primary}`} className="chip hover:text-accent">
                more {formatName(primary).toLowerCase()}
              </Link>
            </div>
          </div>
        </Reveal>
      </div>

      {evolutionDepths.length > 1 && (
        <Reveal>
          <div className="card mt-6 p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-extrabold tracking-tight">Evolution line</h2>
              <span className="mono text-faint">{evolutionLine.length} stages</span>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2 sm:gap-4">
              {evolutionDepths.map((depth, index) => (
                <div key={depth} className="flex items-center gap-2 sm:gap-4">
                  <div className="flex flex-wrap gap-2">
                    {evolutionLine
                      .filter((entry) => entry.depth === depth)
                      .map((entry) => (
                        <Link
                          key={entry.id}
                          to={`/pokemon/${entry.id}`}
                          className={`group flex w-[104px] flex-col items-center rounded-xl border p-2 transition-all hover:-translate-y-1 ${
                            entry.id === pokemon.id
                              ? 'border-accent/50 bg-accent/5'
                              : 'border-transparent hover:border-line-strong'
                          }`}
                        >
                          <img
                            src={spriteUrl(entry.id)}
                            alt={formatName(entry.name)}
                            className="h-16 w-16 object-contain [image-rendering:pixelated] transition-transform group-hover:scale-110"
                          />
                          <span className="mt-1 text-center font-display text-[12px] font-bold leading-tight">
                            {formatName(entry.name)}
                          </span>
                          <span className="mono text-[9px] text-faint">{formatDexId(entry.id)}</span>
                        </Link>
                      ))}
                  </div>
                  {index < evolutionDepths.length - 1 && (
                    <ArrowRight className="h-4 w-4 shrink-0 text-faint" aria-hidden="true" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      )}

      {more.length > 0 && (
        <section className="mt-10">
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <div className="kicker">Same type</div>
              <h2 className="mt-2 font-display text-xl font-extrabold tracking-tight">
                More {formatName(primary).toLowerCase()} species
              </h2>
            </div>
            <Link to={`/dex?type=${primary}`} className="btn-quiet">
              See all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="dex-grid">
            {more.map((item, index) => (
              <Reveal key={item.id} delay={Math.min(index * 30, 180)}>
                <PokemonCard
                  id={item.id}
                  name={item.name}
                  types={item.types.map((entry) => entry.type.name)}
                  stats={item.stats}
                />
              </Reveal>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
