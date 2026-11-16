import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Heart, Moon, Sparkles, Sun, Volume2 } from 'lucide-react'
import RarityBadge from '../components/RarityBadge'
import Reveal from '../components/Reveal'
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

export default function Detail() {
  const { id } = useParams()
  const numericId = Number(id)
  const [pokemon, setPokemon] = useState<PokemonDetail | null>(null)
  const [species, setSpecies] = useState<Species | null>(null)
  const [chain, setChain] = useState<EvolutionNode | null>(null)
  const [typeInfo, setTypeInfo] = useState<TypeInfo[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [audioReady, setAudioReady] = useState(false)

  const favorites = useFavorites((state) => state.favorites)
  const toggle = useFavorites((state) => state.toggle)

  useEffect(() => {
    if (!Number.isFinite(numericId) || numericId < 1) {
      setError('That dex number does not exist.')
      setLoading(false)
      return
    }
    let alive = true
    setLoading(true)
    setError('')

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
        setTypeInfo(types.filter((entry): entry is TypeInfo => Boolean(entry)))
        setAudioReady(Boolean(mon.cries?.latest || mon.cries?.legacy))
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
      <div className="wrap py-10">
        <div className="card p-6">
          <div className="skeleton h-[380px] rounded-2xl" />
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
          <Link to="/dex" className="btn-ink mt-6">
            Back to the dex
          </Link>
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
    audio.play().catch(() => undefined)
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

  return (
    <div className="pop-in wrap py-8">
      <div className="mb-5 flex items-center justify-between gap-3">
        <Link to="/dex" className="btn-quiet">
          <ArrowLeft className="h-3.5 w-3.5" /> The dex
        </Link>
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-faint">{formatDexId(pokemon.id)}</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
        <Reveal>
          <div
            className="card pokeball-ring relative overflow-hidden p-6"
            style={{ background: `radial-gradient(120% 90% at 50% 0%, ${meta.a}26, var(--color-surface) 60%)` }}
          >
            <span className="dex-number pointer-events-none absolute -top-2 left-1/2 -translate-x-1/2 select-none text-[8.5rem] sm:text-[11rem]">
              {String(pokemon.id).padStart(3, '0')}
            </span>
            <div className="relative grid min-h-[340px] place-items-center">
              <img
                src={image}
                alt={formatName(pokemon.name)}
                className="sprite-float h-[280px] w-[280px] object-contain drop-shadow-[0_30px_34px_rgba(20,18,26,0.28)] sm:h-[320px] sm:w-[320px]"
              />
            </div>
            <div className="relative mt-2 flex items-center justify-between gap-2">
              <div className="flex flex-wrap gap-1.5">
                {pokemon.types.map((entry) => (
                  <TypeBadge key={entry.type.name} type={entry.type.name} />
                ))}
                <RarityBadge tier={rarity} />
              </div>
              <button
                type="button"
                onClick={playCry}
                disabled={!audioReady}
                className="btn-quiet disabled:opacity-40"
                title={audioReady ? 'Play cry' : 'No cry available'}
              >
                <Volume2 className="h-3.5 w-3.5" /> Cry
              </button>
            </div>
          </div>
        </Reveal>

        <Reveal variant="right" delay={90}>
          <div className="flex h-full flex-col">
            <div className="kicker">{genus(species)}</div>
            <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
              <h1 className="font-display text-[2.9rem] font-extrabold leading-[0.94] tracking-[-0.045em] sm:text-[3.6rem]">
                {formatName(pokemon.name)}
              </h1>
              <button
                type="button"
                onClick={() => toggle({ id: pokemon.id, name: pokemon.name, types: pokemon.types.map((entry) => entry.type.name) })}
                className={isFavorite ? 'btn-accent' : 'btn-ink'}
              >
                <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
                {isFavorite ? 'Saved' : 'Favourite'}
              </button>
            </div>

            <p className="mt-4 border-l-2 border-accent/60 pl-4 text-[15px] leading-relaxed text-muted">
              {flavorText(species)}
            </p>

            <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-2.5 rounded-2xl border border-line bg-surface p-4 sm:grid-cols-4">
              {infoRows.map((row) => (
                <div key={row.label}>
                  <div className="mono text-[9px] uppercase tracking-[0.1em] text-faint">{row.label}</div>
                  <div className="mt-0.5 truncate font-display text-[13.5px] font-bold" title={row.value}>
                    {row.value}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap gap-1.5">
              {pokemon.abilities.map((entry) => (
                <span key={entry.ability.name} className="chip">
                  {formatName(entry.ability.name)}
                  {entry.is_hidden && <span className="ml-1 text-faint">hidden</span>}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
        <Reveal>
          <div className="card p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-extrabold tracking-tight">Base stats</h2>
              <span className="mono text-faint">total {statTotal}</span>
            </div>
            <div className="mt-4 space-y-3.5">
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
          <div className="card flex h-full flex-col p-5">
            <h2 className="font-display text-lg font-extrabold tracking-tight">Defensive profile</h2>
            <p className="mt-1 text-[12.5px] text-muted">How incoming damage lands on this typing.</p>

            {weaknesses.length === 0 && resistances.length === 0 && (
              <p className="mono mt-5 text-faint">Loading type chart…</p>
            )}

            {weaknesses.length > 0 && (
              <div className="mt-4">
                <div className="mono text-[9px] uppercase tracking-[0.12em] text-accent">Weak to</div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {weaknesses.map((entry) => (
                    <span key={entry.name} className="chip">
                      {formatName(entry.name)} <span className="text-accent">{MULTIPLIER_LABEL[entry.multiplier]}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {(resistances.length > 0 || immunities.length > 0) && (
              <div className="mt-4">
                <div className="mono text-[9px] uppercase tracking-[0.12em] text-muted">Resists</div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {[...resistances, ...immunities].map((entry) => (
                    <span key={entry.name} className="chip">
                      {formatName(entry.name)} <span className="text-faint">{MULTIPLIER_LABEL[entry.multiplier]}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-auto flex flex-wrap gap-2 pt-5">
              <span className="chip">
                <Sun className="h-3 w-3" /> {species.base_happiness ?? '—'} happiness
              </span>
              <span className="chip">
                <Sparkles className="h-3 w-3" /> catch rate {species.capture_rate}
              </span>
              <span className="chip">
                <Moon className="h-3 w-3" /> {RARITY_META_NOTE(rarity)}
              </span>
            </div>
          </div>
        </Reveal>
      </div>

      {evolutionDepths.length > 1 && (
        <Reveal>
          <div className="card mt-6 p-5">
            <h2 className="font-display text-lg font-extrabold tracking-tight">Evolution line</h2>
            <div className="mt-4 flex flex-wrap items-end gap-4">
              {evolutionDepths.map((depth, index) => (
                <div key={depth} className="flex items-end gap-4">
                  <div className="flex flex-wrap gap-3">
                    {evolutionLine
                      .filter((entry) => entry.depth === depth)
                      .map((entry) => (
                        <Link
                          key={entry.id}
                          to={`/pokemon/${entry.id}`}
                          className={`group flex w-[104px] flex-col items-center rounded-xl border p-2 transition-colors ${
                            entry.id === pokemon.id
                              ? 'border-accent/50 bg-accent/5'
                              : 'border-transparent hover:border-line-strong'
                          }`}
                        >
                          <img
                            src={spriteUrl(entry.id)}
                            alt={formatName(entry.name)}
                            className="h-16 w-16 object-contain transition-transform group-hover:-translate-y-1"
                          />
                          <span className="mt-1 text-center font-display text-[12px] font-bold leading-tight">
                            {formatName(entry.name)}
                          </span>
                          <span className="mono text-[9px] text-faint">{formatDexId(entry.id)}</span>
                        </Link>
                      ))}
                  </div>
                  {index < evolutionDepths.length - 1 && <span className="pb-8 text-2xl text-faint">→</span>}
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      )}
    </div>
  )
}

function RARITY_META_NOTE(tier: string) {
  return `${tier.toLowerCase()} tier`
}
