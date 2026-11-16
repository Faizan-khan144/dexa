import { useEffect, useState } from 'react'

interface StatBarProps {
  label: string
  value: number
  max?: number
}

export default function StatBar({ label, value, max = 255 }: StatBarProps) {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setWidth(Math.min(100, Math.round((value / max) * 100))))
    return () => window.cancelAnimationFrame(frame)
  }, [value, max])

  const tone = value >= 110 ? 'high' : value <= 45 ? 'low' : 'mid'

  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-faint">{label}</span>
        <span className="font-display text-[13.5px] font-bold">{value}</span>
      </div>
      <div className="stat-track mt-1.5">
        <div className="stat-fill" data-tone={tone} style={{ width: `${width}%` }} />
      </div>
    </div>
  )
}
