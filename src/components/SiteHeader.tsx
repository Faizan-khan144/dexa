import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import {
  ArrowUpRight,
  BarChart3,
  ChevronDown,
  Github,
  Heart,
  Info,
  Menu,
  Search,
  Shuffle,
  Sparkles,
  Swords,
  X,
} from 'lucide-react'
import Logo from './Logo'
import { getIndex } from '../lib/pokedex'
import { useFavorites } from '../store/favorites'

const LINKS = [
  { to: '/dex', label: 'Dex' },
  { to: '/types', label: 'Types' },
  { to: '/generations', label: 'Generations' },
  { to: '/favorites', label: 'Favourites' },
]

const EXPLORE = [
  { to: '/stats', label: 'Stats', text: 'The dex by the numbers', icon: BarChart3 },
  { to: '/compare', label: 'Compare', text: 'Two species, one table', icon: Swords },
  { to: '/quiz', label: 'Quiz', text: 'Name the silhouette', icon: Sparkles },
  { to: '/about', label: 'About', text: 'How Dexa is built', icon: Info },
]

export default function SiteHeader() {
  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
  const [rolling, setRolling] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const saved = useFavorites((state) => state.favorites.length)
  const moreRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
    setMoreOpen(false)
  }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(event.target as Node)) setMoreOpen(false)
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMoreOpen(false)
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onClick)
    window.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      window.removeEventListener('keydown', onKey)
    }
  }, [])

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

  const exploreActive = EXPLORE.some((item) => location.pathname === item.to)

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
        <div
          className={`mx-auto flex max-w-6xl items-center gap-2 rounded-2xl border px-2.5 py-2 transition-all duration-300 ${
            scrolled
              ? 'border-line-strong bg-bg/90 shadow-[0_18px_50px_-28px_rgba(24,13,16,0.45)] backdrop-blur-2xl'
              : 'border-line/70 bg-surface/60 backdrop-blur-xl'
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
                    isActive ? 'bg-accent/10 text-accent' : 'text-muted hover:bg-surface2 hover:text-ink'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {link.label}
                    <span
                      className={`absolute inset-x-3 -bottom-0.5 h-[2px] origin-center rounded-full bg-accent transition-transform duration-300 ${
                        isActive ? 'scale-x-100' : 'scale-x-0'
                      }`}
                    />
                  </>
                )}
              </NavLink>
            ))}

            <div ref={moreRef} className="relative">
              <button
                type="button"
                onClick={() => setMoreOpen((value) => !value)}
                aria-expanded={moreOpen}
                className={`inline-flex items-center gap-1 rounded-full px-3.5 py-2 font-mono text-[10.5px] uppercase tracking-[0.14em] transition-all ${
                  moreOpen || exploreActive
                    ? 'bg-accent/10 text-accent'
                    : 'text-muted hover:bg-surface2 hover:text-ink'
                }`}
              >
                Explore
                <ChevronDown
                  className={`h-3 w-3 transition-transform duration-300 ${moreOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {moreOpen && (
                <div className="page-enter absolute left-1/2 top-[calc(100%+0.85rem)] w-[360px] -translate-x-1/2 rounded-2xl border border-line bg-surface p-2 shadow-[0_30px_70px_-35px_rgba(24,13,16,0.55)]">
                  <div className="grid gap-1">
                    {EXPLORE.map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        className="group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-surface2"
                      >
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-line bg-surface2 text-accent">
                          <item.icon className="h-4 w-4" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block font-display text-[13.5px] font-extrabold tracking-tight">
                            {item.label}
                          </span>
                          <span className="block text-[11.5px] text-muted">{item.text}</span>
                        </span>
                        <ArrowUpRight className="h-3.5 w-3.5 text-faint transition-all group-hover:-translate-y-0.5 group-hover:text-accent" />
                      </Link>
                    ))}
                  </div>
                  <div className="mt-1 flex items-center justify-between border-t border-line px-3 py-2">
                    <span className="mono text-faint">1025 species · 9 gens</span>
                    <Link
                      to="/dex?special=1"
                      className="mono uppercase tracking-[0.1em] text-accent hover:underline"
                    >
                      legends
                    </Link>
                  </div>
                </div>
              )}
            </div>
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
              aria-label={`Favourites, ${saved} saved`}
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
          <div className="absolute inset-x-3 top-[78px] max-h-[calc(100vh-6rem)] overflow-y-auto">
            <div className="page-enter card overflow-hidden p-2">
              {LINKS.map((link, index) => (
                <Link
                  key={link.label}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className="group flex items-center justify-between rounded-xl px-4 py-3 transition-colors hover:bg-surface2"
                  style={{ animationDelay: `${index * 40}ms` }}
                >
                  <span className="flex items-center gap-3">
                    <span className="font-mono text-[9px] text-faint">{String(index + 1).padStart(2, '0')}</span>
                    <span className="font-display text-[22px] font-extrabold tracking-tight">{link.label}</span>
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-faint transition-all group-hover:-translate-y-0.5 group-hover:text-accent" />
                </Link>
              ))}

              <div className="mt-2 border-t border-line px-2 pt-3">
                <div className="mono px-2 uppercase tracking-[0.16em] text-faint">Explore</div>
                <div className="mt-2 grid grid-cols-2 gap-1.5">
                  {EXPLORE.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setOpen(false)}
                      className="rounded-xl border border-line bg-surface p-3 transition-colors hover:border-accent/40"
                    >
                      <item.icon className="h-4 w-4 text-accent" />
                      <span className="mt-2 block font-display text-[13.5px] font-extrabold tracking-tight">
                        {item.label}
                      </span>
                      <span className="block text-[11px] leading-snug text-muted">{item.text}</span>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="mt-2 flex items-center justify-between border-t border-line px-3 py-3">
                <a
                  href="https://github.com/Faizan-khan144/dexa"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted"
                >
                  <Github className="h-3.5 w-3.5" /> GitHub
                </a>
                <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-faint">
                  <Heart className="h-3 w-3 text-accent" /> {saved} saved
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
