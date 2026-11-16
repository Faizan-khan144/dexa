import { Github, Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import Logo from './Logo'

export default function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-line bg-surface text-ink">
      <div className="wrap py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1.6fr]">
          <div>
            <div className="flex items-center gap-3">
              <Logo size={32} />
            </div>
            <p className="mt-4 max-w-sm text-[13.5px] leading-relaxed text-muted">
              Every species, every stat, every evolution — one clean dex. Built for quick lookups and long detours.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-full border border-line-strong px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-faint">
                1025 species
              </span>
              <span className="rounded-full border border-line-strong px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-faint">
                no account
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-faint">The dex</div>
              <div className="mt-3 flex flex-col gap-2 text-[13.5px]">
                <Link to="/dex" className="text-muted transition-colors hover:text-white">
                  Browse all
                </Link>
                <Link to="/types" className="text-muted transition-colors hover:text-white">
                  Types
                </Link>
                <Link to="/generations" className="text-muted transition-colors hover:text-white">
                  Generations
                </Link>
                <Link to="/favorites" className="text-muted transition-colors hover:text-white">
                  Favourites
                </Link>
                <Link to="/about" className="text-muted transition-colors hover:text-white">
                  About
                </Link>
              </div>
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-faint">Sources</div>
              <div className="mt-3 flex flex-col gap-2 text-[13.5px]">
                <a
                  href="https://pokeapi.co"
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted transition-colors hover:text-white"
                >
                  PokéAPI
                </a>
                <a
                  href="https://github.com/PokeAPI/sprites"
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted transition-colors hover:text-white"
                >
                  Sprites
                </a>
                <a
                  href="https://www.pokemon.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted transition-colors hover:text-white"
                >
                  Pokémon.com
                </a>
              </div>
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-faint">Built by</div>
              <div className="mt-3 flex flex-col gap-2 text-[13.5px]">
                <a
                  href="https://github.com/Faizan-khan144"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-muted transition-colors hover:text-white"
                >
                  <Github className="h-3.5 w-3.5" /> Faizan Khan
                </a>
                <span className="flex items-center gap-1.5 text-muted">
                  <Heart className="h-3.5 w-3.5 text-accent" /> React + Vite
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-5 text-[11.5px] text-faint sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Dexa. A fan project, not affiliated with Nintendo or Game Freak.</span>
          <span className="font-mono text-[10px] uppercase tracking-[0.16em]">data from PokéAPI</span>
        </div>
      </div>
    </footer>
  )
}
