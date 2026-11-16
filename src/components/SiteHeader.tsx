import { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { ArrowUpRight, Heart, Menu, Search, Shuffle, X } from 'lucide-react'
import Logo from './Logo'
import { getIndex } from '../lib/pokedex'
import { useFavorites } from '../store/favorites'

const LINKS = [
  { to: '/dex', label: 'Dex' },
  { to: '/types', label: 'Types' },
  { to: '/generations', label: 'Generations' },
  { to: '/favorites', label: 'Favourites' },
]

const MOBILE_LINKS = [...LINKS, { to: '/about', label: 'About' }]

export default function SiteHeader() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [rolling, setRolling] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const saved = useFavorites((state) => state.favorites.length)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

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
    <>
      <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
        <div
          className={`mx-auto flex max-w-6xl items-center gap-2 rounded-2xl border px-2.5 py-2 transition-all duration-300 ${
            scrolled
              ? 'border-line-strong bg-bg/90 shadow-[0_18px_50px_-28px_rgba(0,0,0,0.9)] backdrop-blur-2xl'
              : 'border-line/70 bg-surface/55 backdrop-blur-xl'
          }`}
        >
          <div className="pl-1.5">
            <Logo size={scrolled ? 28 : 32} />
          </div>

          <nav className="mx-auto hidden items-center gap-1 md:flex">
            {LINKS.map((link) => (
              <NavLink
                key={link.label}
                to={link.to}
                className={({ isActive }) =>
                  `relative rounded-full px-3.5 py-2 font-mono text-[10.5px] uppercase tracking-[0.14em] transition-all ${
                    isActive
                      ? 'bg-accent/10 text-accent'
                      : 'text-muted hover:bg-surface2 hover:text-ink'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-1.5 md:ml-0">
            <Link
              to="/dex"
              className="grid h-9 w-9 place-items-center rounded-full border border-line text-muted transition-colors hover:border-accent hover:text-accent"
              aria-label="Search the dex"
            >
              <Search className="h-3.5 w-3.5" />
            </Link>
            <Link
              to="/favorites"
              className="hidden items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-2 font-mono text-[10px] uppercase tracking-[0.1em] text-muted transition-colors hover:border-accent hover:text-accent sm:flex"
            >
              <Heart className="h-3 w-3" /> {saved}
            </Link>
            <button
              type="button"
              onClick={surprise}
              disabled={rolling}
              className="btn-accent !px-3.5 !py-2 !text-[11.5px]"
            >
              <Shuffle className={`h-3.5 w-3.5 ${rolling ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{rolling ? 'Flipping' : 'Surprise me'}</span>
            </button>
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              className="grid h-9 w-9 place-items-center rounded-full border border-line text-muted transition-colors hover:border-accent hover:text-accent md:hidden"
              aria-label="Toggle menu"
              aria-expanded={open}
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-bg/70 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="absolute inset-x-3 top-[78px]">
            <div className="page-enter card overflow-hidden p-2">
              {MOBILE_LINKS.map((link, index) => (
                <Link
                  key={link.label}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className="group flex items-center justify-between rounded-xl px-4 py-3.5 transition-colors hover:bg-surface2"
                  style={{ animationDelay: `${index * 40}ms` }}
                >
                  <span className="font-display text-[22px] font-extrabold tracking-tight">{link.label}</span>
                  <ArrowUpRight className="h-4 w-4 text-faint transition-all group-hover:-translate-y-0.5 group-hover:text-accent" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
