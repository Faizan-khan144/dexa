interface MarqueeProps {
  items: string[]
}

export default function Marquee({ items }: MarqueeProps) {
  if (items.length === 0) return null
  const track = (
    <div className="marquee-track" aria-hidden="true">
      {items.map((item) => (
        <span
          key={item}
          className="whitespace-nowrap font-display text-2xl font-extrabold tracking-tight text-ink/15"
        >
          {item}
          <span className="ml-9 text-accent/30">●</span>
        </span>
      ))}
    </div>
  )

  return (
    <div className="marquee border-y border-line bg-surface/60 py-4">
      {track}
      {track}
    </div>
  )
}
