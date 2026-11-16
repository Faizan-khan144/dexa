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
  4: 'Sinnoh split physical and special for good — and introduced online trading.',
  5: 'Unova rebuilt the dex from scratch with 156 brand new species.',
  6: 'Kalos brought Fairy, mega evolutions and the first fully 3D region.',
  7: 'Alola traded gyms for trials and regional forms for the whole roster.',
  8: 'Galar went big: wild areas, Dynamax and 96 new species.',
  9: 'Paldea opened the world up with co-op, terastallising and 120 new species.',
}

const YEARS: Record<number, string> = {
  1: '1996',
  2: '1999',
  3: '2002',
  4: '2006',
  5: '2010',
  6: '2013',
  7: '2016',
  8: '2019',
  9: '2022',
}

const TINTS: Record<number, string> = {
  1: '#e11d3c',
  2: '#c47f2a',
  3: '#1f8a7a',
  4: '#3b5ba5',
  5: '#5b6470',
  6: '#b03e7d',
  7: '#a05c2c',
  8: '#7c3aed',
  9: '#2f7d3a',
}

export default function Generations() {
  useEffect(() => {
    document.title = 'Generations · Dexa'
  }, [])

  const totalSpecies = GENERATIONS.reduce((sum, entry) => sum + (entry.to - entry.from + 1), 0)

  return (
    <div className="pop-in wrap py-9">
      <div className="kicker">Timeline · 1996 → 2022</div>
      <h1 className="mt-3 max-w-3xl font-display text-[2.7rem] font-extrabold leading-[0.94] tracking-[-0.05em] sm:text-[3.7rem]">
        Nine generations, <span className="text-gradient">one wall.</span>
      </h1>
      <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted">
        Every region in release order, with its starters and its slice of the dex. Jump into any generation and walk it
        from the first entry.
      </p>

      <div className="mt-7 grid max-w-2xl grid-cols-3 gap-3">
        {[
          { value: '9', label: 'generations' },
          { value: String(totalSpecies), label: 'species' },
          { value: '27', label: 'starters' },
        ].map((stat) => (
          <div key={stat.label} className="card px-4 py-3">
            <div className="font-display text-2xl font-extrabold tracking-tight">{stat.value}</div>
            <div className="mono text-faint">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="relative mt-10 space-y-4 before:absolute before:bottom-6 before:left-[18px] before:top-6 before:hidden before:w-px before:bg-line sm:before:block">
        {GENERATIONS.map((generation, index) => {
          const tint = TINTS[generation.id] ?? '#e11d3c'
          const count = generation.to - generation.from + 1
          return (
            <Reveal key={generation.id} delay={Math.min(index * 45, 260)}>
              <div className="relative flex gap-4">
                <div className="relative z-10 hidden w-9 shrink-0 justify-center pt-6 sm:flex">
                  <span
                    className="grid h-9 w-9 place-items-center rounded-full border-2 bg-bg font-display text-[11px] font-extrabold"
                    style={{ borderColor: tint, color: tint }}
                  >
                    {generation.label}
                  </span>
                </div>

                <Link
                  to={`/dex?gen=${generation.id}`}
                  className="card card-hover group relative flex-1 overflow-hidden p-5 sm:p-6"
                >
                  <span
                    className="pointer-events-none absolute -right-10 -top-14 h-52 w-52 rounded-full opacity-[0.08] blur-2xl transition-opacity duration-500 group-hover:opacity-[0.16]"
                    style={{ background: tint }}
                    aria-hidden="true"
                  />
                  <span
                    className="dex-number pointer-events-none absolute -bottom-8 -right-2 select-none text-[7rem] opacity-60"
                    aria-hidden="true"
                  >
                    {generation.label}
                  </span>

                  <div className="relative grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className="chip !py-0.5 !text-[9px]"
                          style={{ color: tint, borderColor: `${tint}55`, background: `${tint}0d` }}
                        >
                          {YEARS[generation.id]}
                        </span>
                        <span className="mono text-faint">Gen {generation.label}</span>
                        <span className="mono text-faint">
                          {formatDexId(generation.from)} – {formatDexId(generation.to)}
                        </span>
                      </div>
                      <h2 className="mt-2 font-display text-2xl font-extrabold tracking-tight">{generation.region}</h2>
                      <p className="mt-1.5 max-w-xl text-[13.5px] leading-relaxed text-muted">{NOTES[generation.id]}</p>

                      <div className="mt-3 flex items-center gap-2">
                        <div className="h-1 w-32 overflow-hidden rounded-full bg-line">
                          <div
                            className="h-full rounded-full transition-[width] duration-500"
                            style={{ width: `${Math.round((count / 156) * 100)}%`, background: tint }}
                          />
                        </div>
                        <span className="mono text-faint">{count} species</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex -space-x-1">
                        {(STARTERS[generation.id] ?? []).map((id) => (
                          <img
                            key={id}
                            src={spriteUrl(id)}
                            alt=""
                            loading="lazy"
                            className="h-12 w-12 object-contain [image-rendering:pixelated] drop-shadow-[0_6px_6px_rgba(24,13,16,0.15)] transition-transform duration-300 group-hover:-translate-y-1"
                          />
                        ))}
                      </div>
                      <ArrowUpRight className="h-4 w-4 text-faint transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
                    </div>
                  </div>
                </Link>
              </div>
            </Reveal>
          )
        })}
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
