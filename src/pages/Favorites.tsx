import { useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Dices, Heart, Sparkles, Trash2 } from 'lucide-react'
import PokemonCard from '../components/PokemonCard'
import Reveal from '../components/Reveal'
import { useFavorites } from '../store/favorites'
import { TYPE_META, formatName, staticRarity } from '../lib/pokedex'

export default function Favorites() {
  const favorites = useFavorites((state) => state.favorites)
  const clear = useFavorites((state) => state.clear)

  useEffect(() => {
    document.title = 'Favourites · Dexa'
  }, [])

  const typeCounts = useMemo(() => {
    const counts = new Map<string, number>()
    favorites.forEach((entry) => {
      entry.types.forEach((type) => counts.set(type, (counts.get(type) ?? 0) + 1))
    })
    return [...counts.entries()].sort((a, b) => b[1] - a[1])
  }, [favorites])

  const legendaryCount = useMemo(
    () => favorites.filter((entry) => staticRarity(entry.id)).length,
    [favorites],
  )

  const randomFavorite = favorites.length > 0 ? favorites[Math.floor(Math.random() * favorites.length)] : null

  return (
    <div className="pop-in wrap py-9">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="kicker">Your shelf</div>
          <h1 className="mt-3 font-display text-[2.6rem] font-extrabold leading-[0.96] tracking-[-0.045em] sm:text-[3.4rem]">
            Favourites
          </h1>
          <p className="mt-2 max-w-xl text-[14.5px] leading-relaxed text-muted">
            {favorites.length > 0
              ? `${favorites.length} species saved on this device. Hearts live in your browser — no account, no sync.`
              : 'Tap the heart on any species and it lands here — stored locally, no account needed.'}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {randomFavorite && (
            <Link to={`/pokemon/${randomFavorite.id}`} className="btn-quiet">
              <Dices className="h-4 w-4" /> Random saved
            </Link>
          )}
          {favorites.length > 0 && (
            <button type="button" onClick={clear} className="btn-quiet">
              <Trash2 className="h-3.5 w-3.5" /> Clear shelf
            </button>
          )}
        </div>
      </div>

      {favorites.length > 0 && (
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="card px-4 py-3">
            <div className="font-display text-2xl font-extrabold tracking-tight">{favorites.length}</div>
            <div className="mono text-faint">species saved</div>
          </div>
          <div className="card px-4 py-3">
            <div className="font-display text-2xl font-extrabold tracking-tight">{typeCounts.length}</div>
            <div className="mono text-faint">types represented</div>
          </div>
          <div className="card px-4 py-3">
            <div className="font-display text-2xl font-extrabold tracking-tight">{legendaryCount}</div>
            <div className="mono text-faint">legends on the shelf</div>
          </div>
        </div>
      )}

      {typeCounts.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {typeCounts.map(([type, count]) => {
            const tint = TYPE_META[type] ?? TYPE_META.normal
            return (
              <span key={type} className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-2.5 py-1">
                <span className="h-2 w-2 rounded-full" style={{ background: tint.a }} />
                <span className="font-mono text-[9.5px] uppercase tracking-[0.08em] text-muted">{type}</span>
                <span className="font-display text-[10px] font-bold text-ink">{count}</span>
              </span>
            )
          })}
        </div>
      )}

      {favorites.length === 0 ? (
        <div className="card relative mt-8 overflow-hidden px-6 py-16 text-center">
          <span className="pokeball-ring pointer-events-none absolute inset-0 opacity-70" aria-hidden="true" />
          <div className="relative">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-accent/10 text-accent">
              <Heart className="h-5 w-5" />
            </div>
            <h2 className="mt-4 font-display text-xl font-bold">The shelf is empty</h2>
            <p className="mx-auto mt-1.5 max-w-sm text-[13.5px] text-muted">
              Nine generations of starters and a few legends are waiting. Pick a favourite and it stays here.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <Link to="/dex" className="btn-ink">
                <Sparkles className="h-4 w-4" /> Browse the dex
              </Link>
              <Link to="/dex?special=1" className="btn-accent">
                Legendary shelf
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap justify-center gap-1.5">
              {['pikachu', 'gengar', 'lucario', 'umbreon', 'dragapult'].map((name) => (
                <Link key={name} to={`/dex?q=${name}`} className="chip">
                  {formatName(name)}
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="dex-grid mt-7">
          {favorites.map((entry, index) => (
            <Reveal key={entry.id} delay={Math.min(index * 30, 240)}>
              <PokemonCard id={entry.id} name={entry.name} types={entry.types} />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  )
}
