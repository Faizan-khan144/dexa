import { useRef, type MouseEvent, type ReactNode } from 'react'

interface SpotlightCardProps {
  children: ReactNode
  className?: string
  tilt?: number
}

export default function SpotlightCard({ children, className = '', tilt = 2.6 }: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null)

  const handleMove = (event: MouseEvent<HTMLDivElement>) => {
    const node = ref.current
    if (!node) return
    const rect = node.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    node.style.setProperty('--mx', `${x}px`)
    node.style.setProperty('--my', `${y}px`)
    if (tilt > 0) {
      node.style.setProperty('--rx', `${((y / rect.height - 0.5) * -tilt).toFixed(2)}deg`)
      node.style.setProperty('--ry', `${((x / rect.width - 0.5) * tilt).toFixed(2)}deg`)
    }
  }

  const handleLeave = () => {
    const node = ref.current
    if (!node) return
    node.style.setProperty('--rx', '0deg')
    node.style.setProperty('--ry', '0deg')
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={`spotlight-card ${className}`}
      style={{ transform: 'perspective(1400px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg))' }}
    >
      {children}
    </div>
  )
}
