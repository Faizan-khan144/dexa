import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { SearchX, Sparkles } from 'lucide-react'
import PokemonCard from '../components/PokemonCard'
import Reveal from '../components/Reveal'
import SearchDock from '../components/SearchDock'
import {
  GENERATIONS,
  LEGENDARY_IDS,
  MYTHICAL_IDS,
  TYPE_ORDER,
  getIndex,
  getMany,
  getType,
  type PokemonDetail,
  type PokemonEntry,
} from '../lib/pokedex'

const PAGE = 16

export default function Dex() {
  const [params, setParams] = useSearchParams()
  const query = params.get('q') ?? ''
  const type = params.get('type') ?? ''
  const gen = Number(params.get('gen') ?? 0)
  const special = params.get('special') === '1'

  const [index, setIndex] = useState<PokemonEntry[]>([])
  const [typeNames, setTypeNames] = useState<Set<string> | null>(null)
  const [details, setDetails] = useState<Record<number, PokemonDetail>>({})
  const [visible, setVisible] = useState(PAGE)
  const [error, setError] = useState('')

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
  }, [query, type, gen, special])

  useEffect(() => {
    if (!type) {
      setTypeNames(null)
      return
    }
    let alive = true
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

  const ids = useMemo(() => {
    const value = query.trim().toLowerCase()
    return index
      .filter((entry) => {
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
      .map((entry) => entry.id)
  }, [index, query, type, gen, special, typeNames])

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

  const update = (key: string, value?: string) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next, { replace: true })
  }

  const activeFilters = Boolean(query || type || gen || special)

  return (
    <div className="pop-in wrap py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="kicker">The dex</div>
          <h1 className="mt-3 font-display text-[2.5rem] font-extrabold leading-[0.98] tracking-[-0.04em] sm:text-[3.2rem]">
            Every species, indexed
          </h1>
          <p className="mt-2 max-w-xl text-[14.5px] leading-relaxed text-muted">
            Filter by type, generation or rarity. Search by name or dex number — the whole archive is local after the
            first load.
          </p>
        </div>
        <div className="mono text-faint">
          {ids.length} {ids.length === 1 ? 'result' : 'results'}
        </div>
      </div>

      <div className="mt-6 max-w-2xl">
        <SearchDock key={query} defaultValue={query} placeholder="Search by name or number…" />
      </div>

      <div className="mt-6 space-y-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="mono shrink-0 text-faint">Type</span>
          <button type="button" onClick={() => update('type')} className="chip shrink-0" data-active={!type}>
            All
          </button>
          {TYPE_ORDER.map((entry) => (
            <button
              key={entry}
              type="button"
              onClick={() => update('type', entry)}
              className="chip shrink-0"
              data-active={type === entry}
            >
              {entry}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="mono text-faint">Gen</span>
          <button type="button" onClick={() => update('gen')} className="chip" data-active={!gen}>
            All
          </button>
          {GENERATIONS.map((entry) => (
            <button
              key={entry.id}
              type="button"
              onClick={() => update('gen', String(entry.id))}
              className="chip"
              data-active={gen === entry.id}
            >
              {entry.label}
            </button>
          ))}
          <span className="mx-1 hidden h-4 w-px bg-line-strong sm:block" />
          <button
            type="button"
            onClick={() => update('special', special ? undefined : '1')}
            className="chip"
            data-active={special}
          >
            <Sparkles className="h-3 w-3" /> Legendary & mythical
          </button>
          {activeFilters && (
            <button type="button" onClick={() => setParams(new URLSearchParams(), { replace: true })} className="chip">
              Clear all
            </button>
          )}
        </div>
      </div>

      {error && <p className="mt-5 rounded-xl border border-accent/30 bg-accent/5 px-4 py-3 text-[13px] text-accent">{error}</p>}

      <div className="mt-8">
        {visibleIds.length === 0 ? (
          <div className="card flex flex-col items-center px-6 py-16 text-center">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-surface2 text-faint">
              <SearchX className="h-5 w-5" />
            </div>
            <h2 className="mt-4 font-display text-xl font-bold">No species under that filter</h2>
            <p className="mt-1.5 max-w-sm text-[13.5px] text-muted">
              Try a different type or generation, or clear the filters and walk the dex from the start.
            </p>
            <Link to="/dex" className="btn-ink mt-5">
              Reset the dex
            </Link>
          </div>
        ) : (
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
                <Reveal key={id} delay={Math.min(position * 25, 200)}>
                  <PokemonCard
                    id={detail.id}
                    name={detail.name}
                    types={detail.types.map((entry) => entry.type.name)}
                  />
                </Reveal>
              )
            })}
          </div>
        )}

        {visible < ids.length && (
          <div className="mt-8 flex justify-center">
            <button type="button" onClick={() => setVisible((value) => value + PAGE)} className="btn-ink">
              Load {Math.min(PAGE, ids.length - visible)} more
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
