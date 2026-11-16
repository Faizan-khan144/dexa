import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react'
import PokemonCard from '../components/PokemonCard'
import Reveal from '../components/Reveal'
import SpotlightCard from '../components/SpotlightCard'
import TypeBadge from '../components/TypeBadge'
import {
  TYPE_META,
  TYPE_ORDER,
  artworkUrl,
  formatName,
  getIndex,
  getMany,
  getType,
  type PokemonDetail,
  type TypeInfo,
} from '../lib/pokedex'

export default function TypeDetail() {
  const { name = '' } = useParams()
  const valid = TYPE_ORDER.includes(name)
  const meta = TYPE_META[name] ?? TYPE_META.normal
  const [info, setInfo] = useState<TypeInfo | null>(null)
  const [mons, setMons] = useState<PokemonDetail[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!valid) {
      setLoading(false)
      return
    }
    document.title = `${formatName(name)} type · Dexa`
    let alive = true
    setLoading(true)
    setInfo(null)
    setMons([])

    Promise.all([getType(name), getIndex()])
      .then(async ([typeInfo, index]) => {
        if (!alive) return
        setInfo(typeInfo)
        const ids = index
          .filter((entry) => typeInfo.pokemon.includes(entry.name))
          .map((entry) => entry.id)
          .slice(0, 24)
        const details = await getMany(ids)
        if (alive) {
          setMons(details)
          setLoading(false)
        }
      })
      .catch(() => {
        if (alive) setLoading(false)
      })

    return () => {
      alive = false
    }
  }, [name, valid])

  if (!valid) {
    return (
      <div className="wrap py-16">
        <div className="card mx-auto max-w-lg px-6 py-14 text-center">
          <h1 className="font-display text-2xl font-extrabold">That type is not in the chart</h1>
          <p className="mt-2 text-[13.5px] text-muted">There are exactly eighteen, and this is not one of them.</p>
          <Link to="/types" className="btn-ink mt-6">
            Back to the atlas
          </Link>
        </div>
      </div>
    )
  }

  const groups = [
    { label: 'Weak to', tone: 'text-accent', items: info?.doubleFrom ?? [] },
    { label: 'Resists', tone: 'text-ink', items: info?.halfFrom ?? [] },
    { label: 'Immune to', tone: 'text-faint', items: info?.noneFrom ?? [] },
  ]

  const samples = mons.slice(0, 4)

  return (
    <div className="pop-in wrap py-8">
      <div className="mb-4 flex items-center justify-between gap-3">
        <Link to="/types" className="btn-quiet">
          <ArrowLeft className="h-3.5 w-3.5" /> Type atlas
        </Link>
        <span className="mono text-faint">defensive chart</span>
      </div>

      <Reveal>
        <SpotlightCard className="card overflow-hidden" tilt={1.4}>
          <div
            className="relative overflow-hidden px-6 py-10 sm:px-10 sm:py-12"
            style={{ background: `radial-gradient(120% 130% at 0% 0%, ${meta.a}4d, var(--color-surface) 64%)` }}
          >
            <span className="pokeball-ring pointer-events-none absolute inset-0 opacity-70" aria-hidden="true" />
            <span
              className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full opacity-30 blur-3xl"
              style={{ background: meta.a }}
              aria-hidden="true"
            />

            <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <div className="kicker" style={{ color: meta.a }}>
                  Type dossier
                </div>
                <h1
                  className="mt-3 font-display text-[3.4rem] font-extrabold leading-[0.86] tracking-[-0.055em] sm:text-[5.4rem]"
                  style={{ color: meta.a }}
                >
                  {formatName(name)}
                </h1>
                <p className="mt-4 max-w-xl text-[14.5px] leading-relaxed text-muted">
                  Defensive profile and a first look at the species that carry the {formatName(name).toLowerCase()}{' '}
                  type. Combining types stacks these multipliers, so check a species dossier for the final chart.
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  <Link to={`/dex?type=${name}`} className="btn-ink">
                    Browse every {formatName(name).toLowerCase()} species <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                  <Link to="/types" className="btn-quiet">
                    All types
                  </Link>
                </div>
              </div>

              <div className="relative flex items-center justify-end">
                {samples.length === 0 ? (
                  <div className="skeleton h-40 w-40 rounded-full" />
                ) : (
                  samples.map((item, index) => (
                    <img
                      key={item.id}
                      src={artworkUrl(item.id)}
                      alt=""
                      className="sprite-float h-24 w-24 object-contain drop-shadow-[0_18px_20px_rgba(24,13,16,0.26)] sm:h-28 sm:w-28"
                      style={{ marginLeft: index === 0 ? 0 : '-1.5rem', animationDelay: `${index * -1.2}s`, zIndex: samples.length - index }}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </SpotlightCard>
      </Reveal>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {groups.map((group, index) => (
          <Reveal key={group.label} delay={index * 70}>
            <div className="card h-full overflow-hidden">
              <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${meta.a}, ${meta.b})` }} />
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <div className={`mono text-[9px] uppercase tracking-[0.14em] ${group.tone}`}>{group.label}</div>
                  <span className="font-display text-sm font-extrabold">{group.items.length}</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {group.items.length === 0 ? (
                    <span className="font-mono text-[10px] text-faint">none</span>
                  ) : (
                    group.items.map((type) => <TypeBadge key={type} type={type} />)
                  )}
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="mt-10">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="kicker">Who carries it</div>
            <h2 className="mt-2 font-display text-xl font-extrabold tracking-tight">
              First 24 {formatName(name).toLowerCase()} species
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="chip !py-1">{info ? `${info.pokemon.length} total` : 'loading…'}</span>
            <Link to={`/dex?type=${name}`} className="btn-quiet">
              See all
            </Link>
          </div>
        </div>
        {loading ? (
          <div className="dex-grid">
            {Array.from({ length: 12 }).map((_, index) => (
              <div key={index} className="card overflow-hidden">
                <div className="skeleton h-[176px] rounded-none" />
                <div className="space-y-2 p-4">
                  <div className="skeleton h-4 w-2/3" />
                  <div className="skeleton h-3 w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="dex-grid">
            {mons.map((item, index) => (
              <Reveal key={item.id} delay={Math.min(index * 24, 220)}>
                <PokemonCard
                  id={item.id}
                  name={item.name}
                  types={item.types.map((entry) => entry.type.name)}
                  stats={item.stats}
                />
              </Reveal>
            ))}
          </div>
        )}
      </div>

      <section className="mt-12">
        <div className="mb-3 flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-accent" />
          <h2 className="font-display text-sm font-extrabold uppercase tracking-[0.12em] text-muted">Other types</h2>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {TYPE_ORDER.filter((type) => type !== name).map((type) => {
            const tint = TYPE_META[type]
            return (
              <Link
                key={type}
                to={`/types/${type}`}
                className="group inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 transition-all hover:-translate-y-0.5 hover:border-line-strong"
              >
                <span className="h-2 w-2 rounded-full" style={{ background: tint.a }} />
                <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted group-hover:text-ink">
                  {type}
                </span>
              </Link>
            )
          })}
        </div>
      </section>
    </div>
  )
}
