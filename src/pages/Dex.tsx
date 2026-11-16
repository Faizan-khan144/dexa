import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  ArrowUpDown,
  ArrowUpRight,
  Check,
  Dices,
  Filter,
  Grid2X2,
  LayoutList,
  RotateCcw,
  SearchX,
  Sparkles,
} from 'lucide-react'
import PokemonCard from '../components/PokemonCard'
import Reveal from '../components/Reveal'
import SearchDock from '../components/SearchDock'
import TypeBadge from '../components/TypeBadge'
import {
  GENERATIONS,
  LEGENDARY_IDS,
  MYTHICAL_IDS,
  TYPE_META,
  TYPE_ORDER,
  formatDexId,
  formatName,
  getIndex,
  getMany,
  getType,
  type PokemonDetail,
  type PokemonEntry,
} from '../lib/pokedex'

const PAGE = 36

type SortKey = 'dex' | 'name' | 'name-desc' | 'newest'

const SORTS: { value: SortKey; label: string }[] = [
  { value: 'dex', label: 'Dex order' },
  { value: 'newest', label: 'Newest first' },
  { value: 'name', label: 'A to Z' },
  { value: 'name-desc', label: 'Z to A' },
]

export default function Dex() {
  const [params, setParams] = useSearchParams()
  const query = params.get('q') ?? ''
  const type = params.get('type') ?? ''
  const gen = Number(params.get('gen') ?? 0)
  const special = params.get('special') === '1'
  const rawSort = params.get('sort')
  const sort: SortKey = SORTS.some((entry) => entry.value === rawSort) ? (rawSort as SortKey) : 'dex'
  const view = params.get('view') === 'list' ? 'list' : 'grid'

  const [index, setIndex] = useState<PokemonEntry[]>([])
  const [typeNames, setTypeNames] = useState<Set<string> | null>(null)
  const [details, setDetails] = useState<Record<number, PokemonDetail>>({})
  const [visible, setVisible] = useState(PAGE)
  const [error, setError] = useState('')
  const sentinel = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    document.title = 'The dex · Dexa'
    let alive = true
    getIndex()
      .then((entries) => {
        if (alive) setIndex(entries)
      })
      .catch(() => {
        if (alive) setError('The dex could not load. Check your connection and refresh.')
      })
    return () => {
      alive = false
    }
  }, [])

  useEffect(() => {
    setVisible(PAGE)
  }, [query, type, gen, special, sort])

  useEffect(() => {
    if (!type) {
      setTypeNames(null)
      return
    }
    let alive = true
    setTypeNames(null)
    getType(type)
      .then((info) => {
        if (alive) setTypeNames(new Set(info.pokemon))
      })
      .catch(() => {
        if (alive) setTypeNames(new Set())
      })
    return () => {
      alive = false
    }
  }, [type])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      if (event.key === '/' && target?.tagName !== 'INPUT' && target?.tagName !== 'TEXTAREA') {
        event.preventDefault()
        document.querySelector<HTMLInputElement>('.dex-search input')?.focus()
      }
      if (event.key === 'Escape' && params.toString() && target?.tagName !== 'INPUT') {
        setParams(new URLSearchParams(), { replace: true })
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [params, setParams])

  const ids = useMemo(() => {
    const value = query.trim().toLowerCase()
    const rows = index.filter((entry) => {
      if (type) {
        if (!typeNames || !typeNames.has(entry.name)) return false
      }
      if (gen) {
        const range = GENERATIONS.find((item) => item.id === gen)
        if (!range || entry.id < range.from || entry.id > range.to) return false
      }
      if (special && !LEGENDARY_IDS.has(entry.id) && !MYTHICAL_IDS.has(entry.id)) return false
      if (value && !entry.name.includes(value) && String(entry.id) !== value) return false
      return true
    })

    rows.sort((a, b) => a.id - b.id)
    if (value) rows.sort((a, b) => Number(b.name.startsWith(value)) - Number(a.name.startsWith(value)))
    if (sort === 'newest') rows.sort((a, b) => b.id - a.id)
    if (sort === 'name') rows.sort((a, b) => a.name.localeCompare(b.name))
    if (sort === 'name-desc') rows.sort((a, b) => b.name.localeCompare(a.name))

    return rows.map((entry) => entry.id)
  }, [index, query, type, gen, special, typeNames, sort])

  const genCounts = useMemo(() => {
    const counts = new Map<number, number>()
    GENERATIONS.forEach((entry) => counts.set(entry.id, 0))
    index.forEach((entry) => {
      const match = GENERATIONS.find((item) => entry.id >= item.from && entry.id <= item.to)
      if (match) counts.set(match.id, (counts.get(match.id) ?? 0) + 1)
    })
    return counts
  }, [index])

  const visibleIds = useMemo(() => ids.slice(0, visible), [ids, visible])
  const missingKey = useMemo(
    () => visibleIds.filter((id) => !details[id]).join(','),
    [visibleIds, details],
  )

  useEffect(() => {
    if (!missingKey) return
    const missing = missingKey.split(',').map(Number)
    let alive = true
    getMany(missing)
      .then((list) => {
        if (!alive) return
        setDetails((previous) => {
          const next = { ...previous }
          list.forEach((item) => {
            next[item.id] = item
          })
          return next
        })
      })
      .catch(() => {
        if (alive) setError('Some entries failed to load. Scroll a little and they will retry.')
      })
    return () => {
      alive = false
    }
  }, [missingKey])

  useEffect(() => {
    const node = sentinel.current
    if (!node || visible >= ids.length) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) setVisible((value) => value + PAGE)
      },
      { rootMargin: '800px 0px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [visible, ids.length])

  const update = (key: string, value?: string) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next, { replace: true })
  }

  const activeFilters = Boolean(query || type || gen || special)
  const specialCount = LEGENDARY_IDS.size + MYTHICAL_IDS.size
  const loadingType = Boolean(type) && typeNames === null
  const loadingIndex = index.length === 0 && !error

  const pills = [
    query ? { key: 'q', label: `“${query}”` } : null,
    type ? { key: 'type', label: formatName(type) } : null,
    gen ? { key: 'gen', label: `Gen ${GENERATIONS.find((entry) => entry.id === gen)?.label ?? gen}` } : null,
    special ? { key: 'special', label: 'Legends only' } : null,
  ].filter(Boolean) as { key: string; label: string }[]

  const filters = (
    <>
      <div>
        <div className="mono uppercase tracking-[0.16em] text-faint">Types</div>
        <div className="mt-2.5 grid grid-cols-2 gap-1">
          <button
            type="button"
            onClick={() => update('type')}
            className={`col-span-2 flex items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-[12px] transition ${
              type ? 'text-muted hover:bg-surface2 hover:text-ink' : 'bg-accent/10 font-semibold text-ink'
            }`}
          >
            All types
            {!type && <Check className="h-3 w-3 text-accent" />}
          </button>
          {TYPE_ORDER.map((entry) => {
            const meta = TYPE_META[entry]
            const active = type === entry
            return (
              <button
                key={entry}
                type="button"
                onClick={() => update('type', active ? undefined : entry)}
                className={`flex items-center gap-2 rounded-lg px-2 py-[5px] text-left text-[12px] transition ${
                  active ? 'bg-accent/10 font-semibold text-ink' : 'text-muted hover:bg-surface2 hover:text-ink'
                }`}
              >
                <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: meta.a }} />
                <span className="truncate capitalize">{entry}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="border-t border-line pt-4">
        <div className="mono uppercase tracking-[0.16em] text-faint">Generation</div>
        <div className="mt-2.5 grid grid-cols-3 gap-1">
          <button
            type="button"
            onClick={() => update('gen')}
            className={`col-span-3 flex items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-[12px] transition ${
              gen ? 'text-muted hover:bg-surface2 hover:text-ink' : 'bg-accent/10 font-semibold text-ink'
            }`}
          >
            All generations
            {!gen && <Check className="h-3 w-3 text-accent" />}
          </button>
          {GENERATIONS.map((entry) => (
            <button
              key={entry.id}
              type="button"
              onClick={() => update('gen', gen === entry.id ? undefined : String(entry.id))}
              className={`rounded-lg px-1 py-1.5 text-center text-[12px] transition ${
                gen === entry.id
                  ? 'bg-accent text-white'
                  : 'bg-surface2/50 text-muted hover:bg-surface2 hover:text-ink'
              }`}
              title={entry.region}
            >
              {entry.label}
              <span className={`block font-mono text-[8px] ${gen === entry.id ? 'text-white/70' : 'text-faint'}`}>
                {genCounts.get(entry.id) ?? 0}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-line pt-4">
        <button
          type="button"
          onClick={() => update('special', special ? undefined : '1')}
          className={`flex w-full items-center justify-between rounded-lg border px-2.5 py-2 text-left text-[12px] transition ${
            special ? 'border-accent/40 bg-accent/10 font-semibold text-ink' : 'border-line text-muted hover:text-ink'
          }`}
        >
          <span className="inline-flex items-center gap-2">
            <Sparkles className={`h-3.5 w-3.5 ${special ? 'text-accent' : ''}`} />
            Legends only
          </span>
          <span className="mono text-faint">{specialCount}</span>
        </button>
      </div>
    </>
  )

  return (
    <div className="pop-in wrap py-8 sm:py-10">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <div className="kicker">The archive</div>
          <h1 className="mt-3 font-display text-[2.6rem] font-extrabold leading-[0.95] tracking-[-0.045em] sm:text-[3.5rem]">
            Every species,
            <br />
            <span className="text-gradient">indexed.</span>
          </h1>
          <p className="mt-3 max-w-xl text-[14.5px] leading-relaxed text-muted">
            All 1025 entries with stats, typing and rarity. Filter it down or search by name and number — the index is
            local after the first load.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <div className="font-display text-4xl font-extrabold leading-none tracking-tight">{ids.length}</div>
            <div className="mono mt-1 text-faint">species in view</div>
          </div>
          <Link to="/random" className="btn-quiet">
            <Dices className="h-4 w-4" /> Surprise me
          </Link>
        </div>
      </div>

      <div className="mt-7 max-w-2xl">
        <div className="dex-search">
          <SearchDock
            key={query}
            defaultValue={query}
            size="hero"
            placeholder="Search a name or number — “lucario”, “448”…"
          />
        </div>
        <div className="mono mt-2 flex items-center gap-2 text-faint">
          <kbd className="rounded border border-line bg-surface px-1.5 py-0.5">/</kbd> to search
          <span className="text-line-strong">·</span>
          <kbd className="rounded border border-line bg-surface px-1.5 py-0.5">esc</kbd> to reset
        </div>
      </div>

      <div className="mt-7 grid gap-6 lg:grid-cols-[236px_minmax(0,1fr)]">
        <aside className="hidden lg:block">
          <div className="card sticky top-[96px] p-4">
            <div className="flex items-center justify-between">
              <span className="kicker">Filters</span>
              {activeFilters && (
                <button
                  type="button"
                  onClick={() => setParams(new URLSearchParams(), { replace: true })}
                  className="inline-flex items-center gap-1 font-mono text-[9px] uppercase tracking-[0.1em] text-accent hover:underline"
                >
                  <RotateCcw className="h-3 w-3" /> Reset
                </button>
              )}
            </div>
            <div className="mt-4 space-y-4">{filters}</div>
          </div>
        </aside>

        <div className="min-w-0">
          <details className="card mb-4 p-3 lg:hidden">
            <summary className="flex cursor-pointer list-none items-center justify-between">
              <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                <Filter className="h-3.5 w-3.5" /> Filters
              </span>
              <span className="chip !py-0.5 !text-[10px]" data-active={activeFilters}>
                {activeFilters ? 'active' : 'none'}
              </span>
            </summary>
            <div className="mt-4 space-y-4">{filters}</div>
          </details>

          <div className="sticky top-[80px] z-30 mb-4 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-line bg-bg/85 px-2.5 py-2 backdrop-blur-md">
            <div className="flex items-center gap-2 pl-1">
              <span className="font-display text-sm font-bold">{ids.length}</span>
              <span className="mono text-faint">{ids.length === 1 ? 'species' : 'species'}</span>
              {loadingType && <span className="mono animate-pulse text-accent">filtering…</span>}
            </div>

            <div className="flex items-center gap-2">
              <label className="flex items-center gap-1.5 rounded-full border border-line bg-surface px-2.5 py-1.5">
                <ArrowUpDown className="h-3.5 w-3.5 text-faint" />
                <select
                  value={sort}
                  onChange={(event) => update('sort', event.target.value === 'dex' ? undefined : event.target.value)}
                  className="cursor-pointer bg-transparent pr-1 text-[11.5px] font-medium text-ink outline-none"
                  aria-label="Sort species"
                >
                  {SORTS.map((entry) => (
                    <option key={entry.value} value={entry.value}>
                      {entry.label}
                    </option>
                  ))}
                </select>
              </label>

              <div className="flex rounded-full border border-line bg-surface p-0.5">
                <button
                  type="button"
                  onClick={() => update('view')}
                  className={`grid h-7 w-7 place-items-center rounded-full transition ${
                    view === 'grid' ? 'bg-ink text-bg' : 'text-faint hover:text-ink'
                  }`}
                  aria-label="Grid view"
                >
                  <Grid2X2 className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => update('view', 'list')}
                  className={`grid h-7 w-7 place-items-center rounded-full transition ${
                    view === 'list' ? 'bg-ink text-bg' : 'text-faint hover:text-ink'
                  }`}
                  aria-label="List view"
                >
                  <LayoutList className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>

          {pills.length > 0 && (
            <div className="mb-4 flex flex-wrap items-center gap-1.5">
              {pills.map((pill) => (
                <button
                  key={pill.key}
                  type="button"
                  onClick={() => update(pill.key)}
                  className="chip !py-1 !text-[11px]"
                  data-active="true"
                >
                  {pill.label} <span className="text-white/70">×</span>
                </button>
              ))}
              <button
                type="button"
                onClick={() => setParams(new URLSearchParams(), { replace: true })}
                className="mono ml-1 text-faint underline-offset-2 hover:text-accent hover:underline"
              >
                clear all
              </button>
            </div>
          )}

          {error && (
            <p className="mb-4 rounded-xl border border-accent/30 bg-accent/5 px-4 py-3 text-[13px] text-accent">
              {error}
            </p>
          )}

          {(loadingIndex || loadingType) && (
            <div className={view === 'list' ? 'space-y-2' : 'dex-grid'}>
              {Array.from({ length: view === 'list' ? 8 : 12 }).map((_, position) => (
                <div key={position} className="card overflow-hidden">
                  <div className="skeleton h-[176px] rounded-none" />
                  <div className="space-y-2 p-4">
                    <div className="skeleton h-4 w-2/3" />
                    <div className="skeleton h-3 w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loadingIndex && !loadingType && ids.length === 0 && (
            <div className="card flex flex-col items-center px-6 py-16 text-center">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-surface2 text-faint">
                <SearchX className="h-5 w-5" />
              </div>
              <h2 className="mt-4 font-display text-xl font-bold">No species under that filter</h2>
              <p className="mt-1.5 max-w-sm text-[13.5px] text-muted">
                Try a different type or generation, or reset and walk the archive from the start.
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                {['fire', 'water', 'dragon'].map((entry) => (
                  <button
                    key={entry}
                    type="button"
                    onClick={() => {
                      const next = new URLSearchParams()
                      next.set('type', entry)
                      setParams(next, { replace: true })
                    }}
                    className="chip"
                  >
                    {formatName(entry)}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setParams(new URLSearchParams(), { replace: true })}
                  className="btn-ink !py-2 !text-[12px]"
                >
                  Reset the dex
                </button>
              </div>
            </div>
          )}

          {!loadingIndex && !loadingType && ids.length > 0 && view === 'grid' && (
            <div className="dex-grid">
              {visibleIds.map((id, position) => {
                const detail = details[id]
                if (!detail) {
                  return (
                    <div key={id} className="card overflow-hidden">
                      <div className="skeleton h-[176px] rounded-none" />
                      <div className="space-y-2 p-4">
                        <div className="skeleton h-4 w-2/3" />
                        <div className="skeleton h-3 w-1/3" />
                      </div>
                    </div>
                  )
                }
                return (
                  <Reveal key={id} delay={Math.min(position * 22, 180)}>
                    <PokemonCard
                      id={detail.id}
                      name={detail.name}
                      types={detail.types.map((entry) => entry.type.name)}
                      stats={detail.stats}
                    />
                  </Reveal>
                )
              })}
            </div>
          )}

          {!loadingIndex && !loadingType && ids.length > 0 && view === 'list' && (
            <div className="space-y-2">
              {visibleIds.map((id) => {
                const detail = details[id]
                if (!detail) {
                  return <div key={id} className="skeleton h-[68px] rounded-xl" />
                }
                const meta = TYPE_META[detail.types[0]?.type.name ?? 'normal'] ?? TYPE_META.normal
                const total = detail.stats.reduce((sum, stat) => sum + stat.base_stat, 0)
                return (
                  <Link
                    key={id}
                    to={`/pokemon/${id}`}
                    className="group flex items-center gap-3 rounded-xl border border-line bg-surface px-3 py-2.5 transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:bg-accent/5"
                  >
                    <span className="mono w-10 shrink-0 text-faint">{String(id).padStart(3, '0')}</span>
                    <div
                      className="grid h-12 w-12 shrink-0 place-items-center rounded-lg"
                      style={{ background: `linear-gradient(150deg, ${meta.a}26, transparent)` }}
                    >
                      <img
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`}
                        alt=""
                        loading="lazy"
                        className="h-11 w-11 object-contain drop-shadow-[0_8px_8px_rgba(24,13,16,0.2)] transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline gap-2">
                        <h3 className="truncate font-display text-[14.5px] font-bold tracking-tight">
                          {formatName(detail.name)}
                        </h3>
                        <span className="mono shrink-0 text-faint">{formatDexId(id)}</span>
                      </div>
                      <div className="mt-1 flex gap-1">
                        {detail.types.map((entry) => (
                          <TypeBadge key={entry.type.name} type={entry.type.name} />
                        ))}
                      </div>
                    </div>
                    <div className="hidden w-32 shrink-0 sm:block">
                      <div className="flex items-baseline justify-between">
                        <span className="mono text-faint">total</span>
                        <span className="font-display text-[13px] font-bold">{total}</span>
                      </div>
                      <div className="mt-1 h-1 overflow-hidden rounded-full bg-line">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${Math.min(100, Math.round((total / 720) * 100))}%`,
                            background: `linear-gradient(90deg, ${meta.a}, ${meta.b})`,
                          }}
                        />
                      </div>
                    </div>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-faint transition-all group-hover:-translate-y-0.5 group-hover:text-accent" />
                  </Link>
                )
              })}
            </div>
          )}

          <div ref={sentinel} className="mt-9 flex flex-col items-center gap-3">
            {visible < ids.length ? (
              <>
                <div className="h-1 w-44 overflow-hidden rounded-full bg-line">
                  <div
                    className="h-full rounded-full bg-accent transition-[width] duration-500"
                    style={{ width: `${Math.round((visible / ids.length) * 100)}%` }}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setVisible((value) => value + PAGE)}
                  className="mono text-faint transition-colors hover:text-accent"
                >
                  loading more · {visible} of {ids.length}
                </button>
              </>
            ) : (
              ids.length > 0 && (
                <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
                  End of the archive · {ids.length} shown
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
