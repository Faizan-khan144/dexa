import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, BarChart3, Dices, Shield, Sparkles, Trophy, Zap } from 'lucide-react'
import Reveal from '../components/Reveal'
import TypeBadge from '../components/TypeBadge'
import {
  GENERATIONS,
  LEGENDARY_IDS,
  MYTHICAL_IDS,
  TYPE_ORDER,
  formatDexId,
  formatName,
  getIndex,
  getMany,
  spriteUrl,
  type PokemonDetail,
  type PokemonEntry,
} from '../lib/pokedex'

const RECORD_IDS = [150, 113, 242, 130, 94, 445, 384, 249, 483, 888, 6, 9, 448, 143]

const statValue = (detail: PokemonDetail, key: string) =>
  detail.stats.find((stat) => stat.stat.name === key)?.base_stat ?? 0

const totalOf = (detail: PokemonDetail) => detail.stats.reduce((sum, stat) => sum + stat.base_stat, 0)

export default function Stats() {
  const [index, setIndex] = useState<PokemonEntry[]>([])
  const [records, setRecords] = useState<PokemonDetail[]>([])

  useEffect(() => {
    document.title = 'Stats · Dexa'
    let alive = true
    getIndex()
      .then((entries) => {
        if (alive) setIndex(entries)
      })
      .catch(() => undefined)
    getMany(RECORD_IDS)
      .then((list) => {
        if (alive) setRecords(list)
      })
      .catch(() => undefined)
    return () => {
      alive = false
    }
  }, [])

  const genCounts = useMemo(() => {
    return GENERATIONS.map((generation) => ({
      ...generation,
      count: index.filter((entry) => entry.id >= generation.from && entry.id <= generation.to).length,
    }))
  }, [index])

  const maxGen = Math.max(1, ...genCounts.map((entry) => entry.count))
  const legendCount = LEGENDARY_IDS.size
  const mythCount = MYTHICAL_IDS.size

  const recordCards = useMemo(() => {
    const bestOf = (fn: (detail: PokemonDetail) => number) =>
      records.reduce<PokemonDetail | null>(
        (top, item) => (!top || fn(item) > fn(top) ? item : top),
        null,
      )
    const defs = [
      { label: 'Highest total', icon: Trophy, get: totalOf },
      { label: 'Highest HP', icon: Shield, get: (detail: PokemonDetail) => statValue(detail, 'hp') },
      { label: 'Highest attack', icon: Zap, get: (detail: PokemonDetail) => statValue(detail, 'attack') },
      { label: 'Highest speed', icon: BarChart3, get: (detail: PokemonDetail) => statValue(detail, 'speed') },
    ]
    const cards: { label: string; icon: typeof Trophy; detail: PokemonDetail; value: string }[] = []
    defs.forEach((definition) => {
      const detail = bestOf(definition.get)
      if (detail) {
        cards.push({
          label: definition.label,
          icon: definition.icon,
          detail,
          value: String(definition.get(detail)),
        })
      }
    })
    return cards
  }, [records])

  return (
    <div className="pop-in wrap py-9">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <div className="kicker">Numbers</div>
          <h1 className="mt-3 max-w-3xl font-display text-[2.7rem] font-extrabold leading-[0.94] tracking-[-0.05em] sm:text-[3.7rem]">
            The dex, <span className="text-gradient">by the numbers.</span>
          </h1>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted">
            How the 1025 species spread across nine generations — plus the records worth memorising.
          </p>
        </div>
        <Link to="/compare" className="btn-quiet">
          <Dices className="h-4 w-4" /> Compare two
        </Link>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { value: index.length || 1025, label: 'species indexed' },
          { value: TYPE_ORDER.length, label: 'types' },
          { value: legendCount, label: 'legendary' },
          { value: mythCount, label: 'mythical' },
        ].map((stat, position) => (
          <Reveal key={stat.label} delay={position * 60}>
            <div className="card px-5 py-4">
              <div className="font-display text-3xl font-extrabold tracking-tight">{stat.value}</div>
              <div className="mono mt-1 text-faint">{stat.label}</div>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <div className="card mt-5 p-5 sm:p-6">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div>
              <h2 className="font-display text-lg font-extrabold tracking-tight">Species per generation</h2>
              <p className="mt-1 text-[12.5px] text-muted">New dex numbers added with each region.</p>
            </div>
            <span className="mono text-faint">{index.length} total</span>
          </div>

          <div className="mt-5 space-y-2.5">
            {genCounts.map((generation, position) => (
              <div key={generation.id} className="grid grid-cols-[3.5rem_1fr_3rem] items-center gap-3">
                <span className="mono text-faint">
                  {generation.label} · {generation.region.slice(0, 3)}
                </span>
                <div className="h-2.5 overflow-hidden rounded-full bg-line">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-accent to-accent/50 transition-[width] duration-700"
                    style={{ width: `${Math.round((generation.count / maxGen) * 100)}%`, transitionDelay: `${position * 60}ms` }}
                  />
                </div>
                <span className="text-right font-display text-[12px] font-bold">{generation.count}</span>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      <section className="mt-10">
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <div className="kicker">Records</div>
            <h2 className="mt-2 font-display text-xl font-extrabold tracking-tight">Who holds the belt</h2>
          </div>
          <span className="mono text-faint">sampled across the dex</span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {recordCards.length === 0
            ? Array.from({ length: 4 }).map((_, position) => (
                <div key={position} className="card p-4">
                  <div className="skeleton h-3 w-20" />
                  <div className="skeleton mt-4 h-16 w-16 rounded-full" />
                  <div className="skeleton mt-3 h-4 w-2/3" />
                </div>
              ))
            : recordCards.map((record, position) => (
                <Reveal key={record.label} delay={position * 60}>
                  <Link to={`/pokemon/${record.detail.id}`} className="card card-hover group block h-full p-4">
                    <div className="flex items-center justify-between">
                      <span className="mono text-faint">{record.label}</span>
                      <record.icon className="h-3.5 w-3.5 text-accent" />
                    </div>
                    <div className="mt-3 flex items-end justify-between">
                      <img
                        src={spriteUrl(record.detail.id)}
                        alt=""
                        loading="lazy"
                        className="h-16 w-16 object-contain [image-rendering:pixelated] transition-transform group-hover:-translate-y-1 group-hover:scale-110"
                      />
                      <span className="font-display text-3xl font-extrabold tracking-tight">{record.value}</span>
                    </div>
                    <div className="mt-2 font-display text-[14px] font-extrabold tracking-tight">
                      {formatName(record.detail.name)}
                    </div>
                    <div className="mono text-faint">{formatDexId(record.detail.id)}</div>
                    <div className="mt-2 flex gap-1">
                      {record.detail.types.map((entry) => (
                        <TypeBadge key={entry.type.name} type={entry.type.name} />
                      ))}
                    </div>
                  </Link>
                </Reveal>
              ))}
        </div>
      </section>

      <Reveal>
        <div className="card mt-10 flex flex-col items-center gap-4 px-6 py-10 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <h2 className="font-display text-xl font-extrabold tracking-tight">Put two species head to head</h2>
            <p className="mt-1 text-[13.5px] text-muted">Stat-for-stat comparison with a winner on every row.</p>
          </div>
          <Link to="/compare" className="btn-ink">
            <Sparkles className="h-4 w-4" /> Open compare <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </Reveal>
    </div>
  )
}
