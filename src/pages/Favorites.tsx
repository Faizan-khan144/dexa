import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Sparkles, Trash2 } from 'lucide-react'
import PokemonCard from '../components/PokemonCard'
import Reveal from '../components/Reveal'
import { useFavorites } from '../store/favorites'

export default function Favorites() {
  const favorites = useFavorites((state) => state.favorites)
  const clear = useFavorites((state) => state.clear)

  useEffect(() => {
    document.title = 'Favourites · Dexa'
  }, [])

  return (
    <div className="pop-in wrap py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="kicker">Your shelf</div>
          <h1 className="mt-3 font-display text-[2.5rem] font-extrabold leading-[0.98] tracking-[-0.04em] sm:text-[3.2rem]">
            Favourites
          </h1>
          <p className="mt-2 max-w-xl text-[14.5px] leading-relaxed text-muted">
            {favorites.length > 0
              ? `${favorites.length} species saved on this device. Hearts sync to your browser, no account needed.`
              : 'Tap the heart on any species and it lands here — stored locally, no account needed.'}
          </p>
        </div>
        {favorites.length > 0 && (
          <button type="button" onClick={clear} className="btn-quiet">
            <Trash2 className="h-3.5 w-3.5" /> Clear shelf
          </button>
        )}
      </div>

      {favorites.length === 0 ? (
        <div className="card mt-8 flex flex-col items-center px-6 py-16 text-center">
          <div className="grid h-12 w-12 place-items-center rounded-full bg-surface2 text-accent">
            <Heart className="h-5 w-5" />
          </div>
          <h2 className="mt-4 font-display text-xl font-bold">The shelf is empty</h2>
          <p className="mt-1.5 max-w-sm text-[13.5px] text-muted">
            Six generations of starters and a few legendaries are waiting. Pick a favourite and it stays here.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/dex" className="btn-ink">
              <Sparkles className="h-4 w-4" /> Browse the dex
            </Link>
            <Link to="/dex?special=1" className="btn-accent">
              Legendary shelf
            </Link>
          </div>
        </div>
      ) : (
        <div className="dex-grid mt-8">
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
