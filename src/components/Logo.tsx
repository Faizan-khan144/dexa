import { Link } from 'react-router-dom'

interface LogoProps {
  size?: number
  withWord?: boolean
}

export default function Logo({ size = 34, withWord = true }: LogoProps) {
  return (
    <Link to="/" className="group inline-flex items-center gap-2.5">
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden="true" className="transition-transform duration-500 group-hover:rotate-[18deg]">
        <circle cx="20" cy="20" r="18" fill="#fffdf8" stroke="#14121a" strokeWidth="2.5" />
        <path d="M2 20h36" stroke="#14121a" strokeWidth="2.5" />
        <circle cx="20" cy="20" r="7" fill="#fffdf8" stroke="#14121a" strokeWidth="2.5" />
        <circle cx="20" cy="20" r="3" fill="#e3354d" />
        <path
          d="M4.4 13.2A18 18 0 0 1 35.6 13.2Z"
          fill="#e3354d"
          stroke="#14121a"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path d="M2 20h11M27 20h11" stroke="#14121a" strokeWidth="2.5" />
        <circle cx="20" cy="20" r="7" fill="#fffdf8" stroke="#14121a" strokeWidth="2.5" />
        <circle cx="20" cy="20" r="3" fill="#e3354d" />
      </svg>
      {withWord && (
        <span className="font-display text-[22px] font-extrabold tracking-[-0.04em] lowercase">
          dexa<span className="text-accent">.</span>
        </span>
      )}
    </Link>
  )
}
