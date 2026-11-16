import { useRef, type PointerEvent } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
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
  1: 'Where it all started.',
  2: 'Day, night and 100 more.',
  3: 'Abilities and double battles.',
  4: 'The physical / special split.',
  5: '156 new species, clean slate.',
  6: 'Fairy types and megas.',
  7: 'Trials and regional forms.',
  8: 'Wild areas and Dynamax.',
  9: 'Open world and terastallising.',
}

export default function GenTimeline() {
  const scroller = useRef<HTMLDivElement>(null)
  const drag = useRef({ down: false, startX: 0, startLeft: 0, moved: false })

  const handleDown = (event: PointerEvent<HTMLDivElement>) => {
    const node = scroller.current
    if (!node) return
    if (event.pointerType === 'mouse' && event.button !== 0) return
    drag.current = { down: true, startX: event.clientX, startLeft: node.scrollLeft, moved: false }
    node.dataset.dragging = 'true'
    node.setPointerCapture(event.pointerId)
  }

  const handleMove = (event: PointerEvent<HTMLDivElement>) => {
    const node = scroller.current
    if (!node || !drag.current.down) return
    const delta = event.clientX - drag.current.startX
    if (Math.abs(delta) > 5) drag.current.moved = true
    node.scrollLeft = drag.current.startLeft - delta
  }

  const handleUp = (event: PointerEvent<HTMLDivElement>) => {
    const node = scroller.current
    if (!node) return
    drag.current.down = false
    delete node.dataset.dragging
    if (node.hasPointerCapture(event.pointerId)) node.releasePointerCapture(event.pointerId)
  }

  return (
    <div
      ref={scroller}
      onPointerDown={handleDown}
      onPointerMove={handleMove}
      onPointerUp={handleUp}
      onPointerCancel={handleUp}
      onClickCapture={(event) => {
        if (drag.current.moved) {
          event.preventDefault()
          event.stopPropagation()
          drag.current.moved = false
        }
      }}
      className="drag-scroll edge-fade -mx-6 overflow-x-auto px-6 pb-2"
    >
      <div className="flex snap-x snap-mandatory gap-3.5">
        {GENERATIONS.map((generation) => (
          <Link
            key={generation.id}
            to={`/dex?gen=${generation.id}`}
            className="card card-hover group relative w-[260px] shrink-0 snap-start overflow-hidden p-5"
          >
            <span className="dex-number pointer-events-none absolute -right-3 -top-5 select-none text-[6.5rem]">
              {generation.label}
            </span>
            <div className="relative">
              <div className="mono text-faint">Gen {generation.label}</div>
              <h3 className="mt-1 font-display text-2xl font-extrabold tracking-tight">{generation.region}</h3>
              <p className="mt-1 text-[12px] leading-relaxed text-muted">{NOTES[generation.id]}</p>
              <div className="mt-4 flex items-end gap-1">
                {(STARTERS[generation.id] ?? []).map((id) => (
                  <img
                    key={id}
                    src={spriteUrl(id)}
                    alt=""
                    loading="lazy"
                    className="h-12 w-12 object-contain [image-rendering:pixelated] transition-transform duration-300 group-hover:-translate-y-1"
                  />
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-line pt-3">
                <span className="mono text-faint">
                  {formatDexId(generation.from)} – {formatDexId(generation.to)}
                </span>
                <ArrowUpRight className="h-3.5 w-3.5 text-faint transition-all group-hover:-translate-y-0.5 group-hover:text-accent" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
