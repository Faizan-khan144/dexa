import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Heart, Menu, Shuffle, X } from 'lucide-react'
import Logo from './Logo'
import { getIndex } from '../lib/pokedex'
import { useFavorites } from '../store/favorites'

const LINKS = [
  { to: '/dex', label: 'The dex' },
  { to: '/dex?type=fire', label: 'Types' },
  { to: '/favorites', label: 'Favourites' },
]

export default function SiteHeader() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [rolling, setRolling] = useState(false)
  const saved = useFavorites((state) => state.favorites.length)

  const surprise = async () => {
    if (rolling) return
    setRolling(true)
    try {
      const index = await getIndex()
      const entry = index[Math.floor(Math.random() * index.length)]
      navigate(`/pokemon/${entry.id}`)
    } catch {
      navigate('/dex')
    } finally {
      setRolling(false)
      setOpen(false)
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg/80 backdrop-blur-xl">
      <div className="wrap flex h-[68px] items-center justify-between gap-4">
        <Logo />

        <nav className="hidden items-center gap-7 md:flex">
          {LINKS.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              className={({ isActive }) =>
                `font-mono text-[11px] uppercase tracking-[0.16em] transition-colors ${
                  isActive ? 'text-accent' : 'text-muted hover:text-ink'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/favorites"
            className="hidden items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.1em] text-muted transition-colors hover:border-line-strong hover:text-ink sm:flex"
          >
            <Heart className="h-3 w-3 text-accent" /> {saved}
          </Link>
          <button type="button" onClick={surprise} disabled={rolling} className="btn-ink !px-4 !py-2 !text-[12px]">
            <Shuffle className="h-3.5 w-3.5" />
            {rolling ? 'Flipping' : 'Surprise me'}
          </button>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="btn-quiet !h-9 !w-9 !p-0 md:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-line bg-bg md:hidden">
          <div className="wrap flex flex-col py-2">
            {LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                onClick={() => setOpen(false)}
                className="border-b border-line/70 py-3 font-display text-lg font-semibold last:border-0"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
