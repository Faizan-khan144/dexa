import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import { artworkUrl, formatDexId, formatName, getIndex, type PokemonEntry } from '../lib/pokedex'

interface SearchDockProps {
  size?: 'hero' | 'compact'
  placeholder?: string
  defaultValue?: string
}

export default function SearchDock({
  size = 'compact',
  placeholder = 'Search a Pokémon by name…',
  defaultValue = '',
}: SearchDockProps) {
  const navigate = useNavigate()
  const [index, setIndex] = useState<PokemonEntry[]>([])
  const [query, setQuery] = useState(defaultValue)
  const [open, setOpen] = useState(false)
  const boxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let alive = true
    getIndex()
      .then((entries) => {
        if (alive) setIndex(entries)
      })
      .catch(() => undefined)
    return () => {
      alive = false
    }
  }, [])

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const matches = useMemo(() => {
    const value = query.trim().toLowerCase()
    if (!value) return []
    return index
      .filter((entry) => entry.name.includes(value) || String(entry.id) === value)
      .sort((a, b) => Number(b.name.startsWith(value)) - Number(a.name.startsWith(value)) || a.name.localeCompare(b.name))
      .slice(0, 6)
  }, [index, query])

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const value = query.trim()
    if (!value) return
    if (matches.length === 1) {
      navigate(`/pokemon/${matches[0].id}`)
      return
    }
    navigate(`/dex?q=${encodeURIComponent(value)}`)
    setOpen(false)
  }

  return (
    <div ref={boxRef} className="relative w-full">
      <form onSubmit={submit} role="search" className={size === 'hero' ? 'search-pill !py-2 !pl-5' : 'search-pill'}>
        <Search className={size === 'hero' ? 'h-5 w-5 text-faint' : 'h-4 w-4 text-faint'} />
        <input
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          aria-label="Search Pokémon"
          className={size === 'hero' ? '!py-1.5 !text-base' : undefined}
        />
        <button type="submit" className="btn-accent !px-4 !py-2 !text-[12px]">
          Search
        </button>
      </form>

      {open && matches.length > 0 && (
        <div className="absolute inset-x-0 top-[calc(100%+0.5rem)] z-40 overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_30px_60px_-30px_rgba(20,18,26,0.5)]">
          {matches.map((entry) => (
            <button
              key={entry.id}
              type="button"
              onClick={() => {
                navigate(`/pokemon/${entry.id}`)
                setOpen(false)
                setQuery('')
              }}
              className="flex w-full items-center gap-3 border-b border-line/70 px-3 py-2.5 text-left transition-colors last:border-0 hover:bg-surface2/70"
            >
              <img src={artworkUrl(entry.id)} alt="" className="h-9 w-9 object-contain" loading="lazy" />
              <span className="font-display text-[15px] font-semibold">{formatName(entry.name)}</span>
              <span className="ml-auto font-mono text-[10px] text-faint">{formatDexId(entry.id)}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
