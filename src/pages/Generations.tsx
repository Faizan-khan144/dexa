import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import Reveal from '../components/Reveal'
import { GENERATIONS, formatDexId, spriteUrl } from '../lib/pokedex'

const STARTERS: Record<number, number[]> = {
  1: [1, 4, 7],
  2: [152, 155, 158],
  3: [252, 255, 258],
  4: [387, 390, 393],
  5: [495, 498, 501],
  6: [650, 653, 656],
  7: [722, 725, 728],
  8: [810, 813, 816],
  9: [906, 909, 912],
}

const NOTES: Record<number, string> = {
  1: 'The original 151. Routes, badges and a legendary at the bottom of a cave.',
  2: 'Johto doubled the map, added day and night, and gave us 100 more dex numbers.',
  3: 'Hoenn pushed the sea, abilities and double battles onto the table.',
  4: 'Sinnoh split the physical and special split for good — and introduced online trading.',
  5: 'Unova rebuilt the dex from scratch with 156 brand new species.',
  6: 'Kalos brought Fairy, mega evolutions and the first fully 3D region.',
  7: 'Alola traded gyms for trials and regional forms for the whole roster.',
  8: 'Galar went big: wild areas, Dynamax and a Pokedex of 96 new species.',
  9: 'Paldea opened the world up with co-op, terastallising and 120 new species.',
}

export default function Generations() {
  useEffect(() => {
    document.title = 'Generations · Dexa'
  }, [])

  return (
    <div className="pop-in wrap py-10">
      <div className="kicker">Timeline</div>
      <h1 className="mt-3 max-w-3xl font-display text-[2.6rem] font-extrabold leading-[0.96] tracking-[-0.045em] sm:text-[3.5rem]">
        Nine generations, <span className="text-gradient">one wall.</span>
      </h1>
      <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted">
        Every region in release order, with its starters and its slice of the dex. Jump into any generation and walk it
        from the first entry.
      </p>

      <div className="mt-10 space-y-4">
        {GENERATIONS.map((generation, index) => (
          <Reveal key={generation.id} delay={Math.min(index * 45, 260)}>
            <Link
              to={`/dex?gen=${generation.id}`}
              className="card card-hover group grid gap-4 p-5 sm:grid-cols-[92px_1fr_auto] sm:items-center sm:p-6"
            >
              <div className="flex items-baseline gap-2 sm:flex-col sm:gap-0">
                <span className="font-display text-[3rem] font-extrabold leading-none tracking-[-0.06em] text-accent">
                  {generation.label}
                </span>
                <span className="mono text-faint">GEN</span>
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-display text-xl font-extrabold tracking-tight">{generation.region}</h2>
                  <span className="mono text-faint">
                    {formatDexId(generation.from)} – {formatDexId(generation.to)} · {generation.to - generation.from + 1}{' '}
                    species
                  </span>
                </div>
                <p className="mt-1.5 max-w-xl text-[13.5px] leading-relaxed text-muted">{NOTES[generation.id]}</p>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex -space-x-1">
                  {(STARTERS[generation.id] ?? []).map((id) => (
                    <img
                      key={id}
                      src={spriteUrl(id)}
                      alt=""
                      loading="lazy"
                      className="h-11 w-11 object-contain [image-rendering:pixelated] transition-transform duration-300 group-hover:-translate-y-1"
                    />
                  ))}
                </div>
                <ArrowUpRight className="h-4 w-4 text-faint transition-all group-hover:-translate-y-0.5 group-hover:text-accent" />
              </div>
            </Link>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <div className="card mt-10 flex flex-col items-center gap-4 px-6 py-10 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <h2 className="font-display text-xl font-extrabold tracking-tight">Or skip the history lesson</h2>
            <p className="mt-1 text-[13.5px] text-muted">Search a name and land on the dossier in one keystroke.</p>
          </div>
          <Link to="/dex" className="btn-accent">
            Search the dex <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </Reveal>
    </div>
  )
}
