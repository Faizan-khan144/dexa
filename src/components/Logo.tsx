import { useId } from 'react'
import { Link } from 'react-router-dom'

interface LogoProps {
  size?: number
  withWord?: boolean
}

export default function Logo({ size = 34, withWord = true }: LogoProps) {
  const gradientId = useId()

  return (
    <Link to="/" className="group inline-flex items-center gap-2.5">
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        aria-hidden="true"
        className="drop-shadow-[0_8px_18px_rgba(245,37,63,0.35)] transition-transform duration-500 group-hover:rotate-[-8deg] group-hover:scale-105"
      >
        <defs>
          <linearGradient id={gradientId} x1="4" y1="2" x2="36" y2="38" gradientUnits="userSpaceOnUse">
            <stop stopColor="#ff3350" />
            <stop offset="1" stopColor="#8f0b1e" />
          </linearGradient>
        </defs>
        <rect x="1.5" y="1.5" width="37" height="37" rx="12" fill={`url(#${gradientId})`} />
        <rect x="2.5" y="2.5" width="35" height="35" rx="11" stroke="#ffffff" strokeOpacity="0.22" />
        <circle cx="20" cy="21" r="10" fill="#0a0708" />
        <circle cx="20" cy="21" r="10" stroke="#ffffff" strokeOpacity="0.9" strokeWidth="2" />
        <circle cx="20" cy="21" r="4" fill="#ffffff" />
        <circle cx="20" cy="21" r="1.7" fill="#f5253f" />
        <path d="M8.5 11h5" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
      </svg>
      {withWord && (
        <span className="font-display text-[22px] font-extrabold tracking-[-0.04em] lowercase">
          dexa<span className="text-accent">.</span>
        </span>
      )}
    </Link>
  )
}
