import { Link } from 'react-router-dom'
import { ArrowLeft, Dices } from 'lucide-react'
import SearchDock from '../components/SearchDock'
import { artworkUrl } from '../lib/pokedex'

const FLOATERS = [
  { id: 132, className: 'left-[6%] top-[18%] h-24 w-24', delay: '0s' },
  { id: 94, className: 'right-[8%] top-[12%] h-28 w-28', delay: '-1.6s' },
  { id: 25, className: 'bottom-[14%] left-[14%] h-20 w-20', delay: '-3.2s' },
]

export default function NotFound() {
  return (
    <div className="pop-in wrap py-16">
      <div className="card grain relative mx-auto max-w-2xl overflow-hidden px-6 py-16 text-center sm:px-10">
        <span className="pokeball-ring pointer-events-none absolute inset-0 opacity-70" aria-hidden="true" />
        <div className="aurora aurora-a -left-16 top-0 h-56 w-56 bg-accent/15" aria-hidden="true" />

        {FLOATERS.map((floater) => (
          <img
            key={floater.id}
            src={artworkUrl(floater.id)}
            alt=""
            aria-hidden="true"
            className={`sprite-float pointer-events-none absolute hidden object-contain opacity-20 sm:block ${floater.className}`}
            style={{ animationDelay: floater.delay }}
          />
        ))}

        <div className="relative">
          <div className="mono text-accent">404 · tall grass</div>
          <div className="mt-2 font-display text-[5rem] font-extrabold leading-none tracking-[-0.06em] text-gradient sm:text-[6.5rem]">
            404
          </div>
          <h1 className="mt-1 font-display text-[1.9rem] font-extrabold leading-[1] tracking-[-0.04em] sm:text-[2.4rem]">
            A wild page did not appear
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-[14px] leading-relaxed text-muted">
            This route is not in the dex. Search a species instead — or roll something random.
          </p>

          <div className="mx-auto mt-6 max-w-sm text-left">
            <SearchDock placeholder="Search a Pokémon…" />
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <Link to="/" className="btn-ink">
              <ArrowLeft className="h-4 w-4" /> Back home
            </Link>
            <Link to="/random" className="btn-quiet">
              <Dices className="h-4 w-4" /> Random species
            </Link>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-1.5">
            {[
              { id: 6, name: 'Charizard' },
              { id: 94, name: 'Gengar' },
              { id: 448, name: 'Lucario' },
              { id: 1008, name: 'Miraidon' },
            ].map((entry) => (
              <Link key={entry.id} to={`/pokemon/${entry.id}`} className="chip">
                {entry.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
