import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowRight, Sparkles, Swords } from 'lucide-react'
import Reveal from '../components/Reveal'
import SpotlightCard from '../components/SpotlightCard'
import TypeBadge from '../components/TypeBadge'
import {
  STAT_LABELS,
  TYPE_META,
  artworkUrl,
  formatDexId,
  formatName,
  getIndex,
  getPokemon,
  type PokemonDetail,
  type PokemonEntry,
} from '../lib/pokedex'

const STAT_ORDER = ['hp', 'attack', 'defense', 'special-attack', 'special-defense', 'speed']
const MAX_ID = 1025

const clampId = (value: string | null, fallback: number) => {
  const numeric = Number(value)
  return Number.isFinite(numeric) && numeric >= 1 && numeric <= MAX_ID ? Math.floor(numeric) : fallback
}

const statValue = (detail: PokemonDetail | null, key: string) =>
  detail?.stats.find((stat) => stat.stat.name === key)?.base_stat ?? 0

const totalOf = (detail: PokemonDetail | null) =>
  detail?.stats.reduce((sum, stat) => sum + stat.base_stat, 0) ?? 0

export default function Compare() {
  const [params, setParams] = useSearchParams()
  const leftId = clampId(params.get('a'), 6)
  const rightId = clampId(params.get('b'), 9)
  const [index, setIndex] = useState<PokemonEntry[]>([])
  const [left, setLeft] = useState<PokemonDetail | null>(null)
  const [right, setRight] = useState<PokemonDetail | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    document.title = 'Compare · Dexa'
    let alive = true
    getIndex()
      .then((entries) => {
        if (alive) setIndex(entries)
      })
      .catch(() => {
        if (alive) setError('The index could not load.')
      })
    return () => {
      alive = false
    }
  }, [])

  useEffect(() => {
    let alive = true
    setLeft(null)
    getPokemon(leftId)
      .then((detail) => {
        if (alive) setLeft(detail)
      })
      .catch(() => {
        if (alive) setLeft(null)
      })
    return () => {
      alive = false
    }
  }, [leftId])

  useEffect(() => {
    let alive = true
    setRight(null)
    getPokemon(rightId)
      .then((detail) => {
        if (alive) setRight(detail)
      })
      .catch(() => {
        if (alive) setRight(null)
      })
    return () => {
      alive = false
    }
  }, [rightId])

  const setSide = (side: 'a' | 'b', value: number) => {
    const next = new URLSearchParams(params)
    next.set(side, String(value))
    setParams(next, { replace: true })
  }

  const leftMeta = TYPE_META[left?.types[0]?.type.name ?? 'normal'] ?? TYPE_META.normal
  const rightMeta = TYPE_META[right?.types[0]?.type.name ?? 'normal'] ?? TYPE_META.normal

  const wins = useMemo(() => {
    let leftWins = 0
    let rightWins = 0
    STAT_ORDER.forEach((key) => {
      const lv = statValue(left, key)
      const rv = statValue(right, key)
      if (lv > rv) leftWins += 1
      if (rv > lv) rightWins += 1
    })
    return { leftWins, rightWins }
  }, [left, right])

  const metaRows = [
    { label: 'Height', left: left ? `${(left.height / 10).toFixed(1)} m` : '—', right: right ? `${(right.height / 10).toFixed(1)} m` : '—' },
    { label: 'Weight', left: left ? `${(left.weight / 10).toFixed(1)} kg` : '—', right: right ? `${(right.weight / 10).toFixed(1)} kg` : '—' },
    { label: 'Base exp', left: left?.base_experience ? String(left.base_experience) : '—', right: right?.base_experience ? String(right.base_experience) : '—' },
    { label: 'Abilities', left: left ? String(left.abilities.length) : '—', right: right ? String(right.abilities.length) : '—' },
    { label: 'Total', left: String(totalOf(left)), right: String(totalOf(right)) },
  ]

  return (
    <div className="pop-in wrap py-9">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <div className="kicker">Head to head</div>
          <h1 className="mt-3 max-w-3xl font-display text-[2.7rem] font-extrabold leading-[0.94] tracking-[-0.05em] sm:text-[3.7rem]">
            Two species. <span className="text-gradient">One table.</span>
          </h1>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted">
            Pick any two dex numbers and compare base stats row by row. The winner of each stat is highlighted.
          </p>
        </div>
        <Link to="/stats" className="btn-quiet">
          <Sparkles className="h-4 w-4" /> Dex records
        </Link>
      </div>

      {error && (
        <p className="mt-5 rounded-xl border border-accent/30 bg-accent/5 px-4 py-3 text-[13px] text-accent">{error}</p>
      )}

      <div className="mt-7 grid gap-3 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
        <SpotlightCard className="card overflow-hidden" tilt={1.6}>
          <div
            className="relative overflow-hidden px-4 pb-4 pt-3"
            style={{ background: `linear-gradient(155deg, ${leftMeta.a}2e, var(--color-surface) 62%)` }}
          >
            <div className="relative flex items-center justify-between">
              <span className="mono text-faint">{formatDexId(leftId)}</span>
              <select
                value={leftId}
                onChange={(event) => setSide('a', Number(event.target.value))}
                className="max-w-[62%] cursor-pointer rounded-full border border-line bg-surface/85 px-3 py-1.5 text-[11.5px] font-medium text-ink outline-none backdrop-blur"
                aria-label="Choose first species"
              >
                {index.map((entry) => (
                  <option key={entry.id} value={entry.id}>
                    {formatDexId(entry.id)} · {formatName(entry.name)}
                  </option>
                ))}
              </select>
            </div>
            <div className="relative grid min-h-[190px] place-items-center">
              {left ? (
                <img
                  src={artworkUrl(left.id)}
                  alt={formatName(left.name)}
                  className="sprite-float h-40 w-40 object-contain drop-shadow-[0_20px_20px_rgba(24,13,16,0.26)]"
                />
              ) : (
                <div className="skeleton h-32 w-32 rounded-full" />
              )}
            </div>
            <div className="relative">
              <div className="font-display text-2xl font-extrabold tracking-tight">
                {left ? formatName(left.name) : 'Loading…'}
              </div>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {left?.types.map((entry) => <TypeBadge key={entry.type.name} type={entry.type.name} />)}
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="font-display text-2xl font-extrabold">{totalOf(left)}</span>
                <span className="mono text-faint">total</span>
              </div>
            </div>
          </div>
        </SpotlightCard>

        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full border border-line bg-surface shadow-sm lg:h-14 lg:w-14">
          <Swords className="h-4.5 w-4.5 text-accent" />
        </div>

        <SpotlightCard className="card overflow-hidden" tilt={1.6}>
          <div
            className="relative overflow-hidden px-4 pb-4 pt-3"
            style={{ background: `linear-gradient(205deg, ${rightMeta.a}2e, var(--color-surface) 62%)` }}
          >
            <div className="relative flex items-center justify-between">
              <span className="mono text-faint">{formatDexId(rightId)}</span>
              <select
                value={rightId}
                onChange={(event) => setSide('b', Number(event.target.value))}
                className="max-w-[62%] cursor-pointer rounded-full border border-line bg-surface/85 px-3 py-1.5 text-[11.5px] font-medium text-ink outline-none backdrop-blur"
                aria-label="Choose second species"
              >
                {index.map((entry) => (
                  <option key={entry.id} value={entry.id}>
                    {formatDexId(entry.id)} · {formatName(entry.name)}
                  </option>
                ))}
              </select>
            </div>
            <div className="relative grid min-h-[190px] place-items-center">
              {right ? (
                <img
                  src={artworkUrl(right.id)}
                  alt={formatName(right.name)}
                  className="sprite-float h-40 w-40 object-contain drop-shadow-[0_20px_20px_rgba(24,13,16,0.26)]"
                />
              ) : (
                <div className="skeleton h-32 w-32 rounded-full" />
              )}
            </div>
            <div className="relative">
              <div className="font-display text-2xl font-extrabold tracking-tight">
                {right ? formatName(right.name) : 'Loading…'}
              </div>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {right?.types.map((entry) => <TypeBadge key={entry.type.name} type={entry.type.name} />)}
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="font-display text-2xl font-extrabold">{totalOf(right)}</span>
                <span className="mono text-faint">total</span>
              </div>
            </div>
          </div>
        </SpotlightCard>
      </div>

      <Reveal>
        <div className="card mt-5 p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-display text-lg font-extrabold tracking-tight">Stat comparison</h2>
            <span className="chip !py-1">
              {wins.leftWins} – {wins.rightWins}
            </span>
          </div>

          <div className="mt-4">
            {STAT_ORDER.map((key) => {
              const lv = statValue(left, key)
              const rv = statValue(right, key)
              const leftBetter = lv > rv
              const rightBetter = rv > lv
              return (
                <div key={key} className="grid grid-cols-[1fr_5.5rem_1fr] items-center gap-2 border-b border-line/60 py-2.5 last:border-0 sm:grid-cols-[1fr_7rem_1fr]">
                  <div className="flex items-center justify-end gap-2">
                    <span className={`font-display text-[13.5px] ${leftBetter ? 'font-extrabold text-ink' : 'font-semibold text-muted'}`}>
                      {lv}
                    </span>
                    <div className="h-2 w-full max-w-[150px] overflow-hidden rounded-full bg-line">
                      <div
                        className="ml-auto h-full rounded-full transition-[width] duration-500"
                        style={{
                          width: `${Math.round((lv / 255) * 100)}%`,
                          background: leftBetter ? leftMeta.a : `${leftMeta.a}66`,
                        }}
                      />
                    </div>
                  </div>
                  <span className="text-center font-mono text-[9px] uppercase tracking-[0.1em] text-faint">
                    {STAT_LABELS[key] ?? key}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-full max-w-[150px] overflow-hidden rounded-full bg-line">
                      <div
                        className="h-full rounded-full transition-[width] duration-500"
                        style={{
                          width: `${Math.round((rv / 255) * 100)}%`,
                          background: rightBetter ? rightMeta.a : `${rightMeta.a}66`,
                        }}
                      />
                    </div>
                    <span className={`font-display text-[13.5px] ${rightBetter ? 'font-extrabold text-ink' : 'font-semibold text-muted'}`}>
                      {rv}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </Reveal>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {metaRows.map((row) => (
          <div key={row.label} className="card flex items-center justify-between px-4 py-3">
            <span className="font-display text-[13px] font-bold">{row.left}</span>
            <span className="mono uppercase tracking-[0.1em] text-faint">{row.label}</span>
            <span className="font-display text-[13px] font-bold">{row.right}</span>
          </div>
        ))}
      </div>

      <Reveal>
        <div className="card mt-6 flex flex-col items-center gap-4 px-6 py-8 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <h2 className="font-display text-lg font-extrabold tracking-tight">
              {left && right
                ? `${wins.leftWins > wins.rightWins ? formatName(left.name) : wins.rightWins > wins.leftWins ? formatName(right.name) : 'Nobody'} takes the stat sheet`
                : 'Loading the matchup…'}
            </h2>
            <p className="mt-1 text-[13px] text-muted">Ties happen. Typing and moves still decide real battles.</p>
          </div>
          <Link to={left ? `/pokemon/${left.id}` : '/dex'} className="btn-ink">
            Open dossier <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </Reveal>
    </div>
  )
}
