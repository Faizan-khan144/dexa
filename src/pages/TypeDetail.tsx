import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import PokemonCard from '../components/PokemonCard'
import Reveal from '../components/Reveal'
import TypeBadge from '../components/TypeBadge'
import {
  TYPE_META,
  TYPE_ORDER,
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
    { label: 'Weak to', items: info?.doubleFrom ?? [] },
    { label: 'Resists', items: info?.halfFrom ?? [] },
    { label: 'Immune to', items: info?.noneFrom ?? [] },
  ]

  return (
    <div className="pop-in wrap py-8">
      <div className="mb-5 flex items-center justify-between gap-3">
        <Link to="/types" className="btn-quiet">
          <ArrowLeft className="h-3.5 w-3.5" /> Type atlas
        </Link>
        <span className="mono text-faint">type chart</span>
      </div>

      <Reveal>
        <div
          className="card pokeball-ring relative overflow-hidden px-6 py-10 sm:px-10 sm:py-14"
          style={{ background: `radial-gradient(120% 120% at 0% 0%, ${meta.a}66, var(--color-surface) 68%)` }}
        >
          <div className="relative">
            <div className="kicker" style={{ color: meta.a }}>
              Type dossier
            </div>
            <h1 className="mt-3 font-display text-[3.4rem] font-extrabold leading-[0.9] tracking-[-0.05em] sm:text-[5rem]">
              {formatName(name)}
            </h1>
            <p className="mt-4 max-w-xl text-[14.5px] leading-relaxed text-muted">
              Defensive profile and a first look at the species that carry the {formatName(name).toLowerCase()} type.
              Combining types stacks these multipliers, so check the species dossier for the final chart.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Link to={`/dex?type=${name}`} className="btn-ink">
                Browse every {formatName(name).toLowerCase()} species <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link to="/dex" className="btn-quiet">
                Full dex
              </Link>
            </div>
          </div>
        </div>
      </Reveal>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {groups.map((group, index) => (
          <Reveal key={group.label} delay={index * 80}>
            <div className="card h-full p-5">
              <div className="mono text-[9px] uppercase tracking-[0.14em] text-faint">{group.label}</div>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {group.items.length === 0 ? (
                  <span className="font-mono text-[10px] text-faint">none</span>
                ) : (
                  group.items.map((type) => <TypeBadge key={type} type={type} />)
                )}
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="mt-10">
        <div className="mb-4 flex items-end justify-between gap-3">
          <h2 className="font-display text-xl font-extrabold tracking-tight">
            First 24 {formatName(name).toLowerCase()} species
          </h2>
          <Link to={`/dex?type=${name}`} className="btn-quiet">
            See all
          </Link>
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
              <Reveal key={item.id} delay={Math.min(index * 30, 240)}>
                <PokemonCard id={item.id} name={item.name} types={item.types.map((entry) => entry.type.name)} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
