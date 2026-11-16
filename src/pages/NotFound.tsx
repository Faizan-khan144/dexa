import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="wrap py-20">
      <div className="card mx-auto max-w-lg px-6 py-16 text-center">
        <div className="mono text-accent">404 · tall grass</div>
        <h1 className="mt-3 font-display text-[2.6rem] font-extrabold leading-[0.98] tracking-[-0.04em]">
          A wild page did not appear
        </h1>
        <p className="mx-auto mt-3 max-w-sm text-[14px] leading-relaxed text-muted">
          This route is not in the dex. Head back and search by name or number instead.
        </p>
        <Link to="/" className="btn-ink mt-7">
          <ArrowLeft className="h-4 w-4" /> Back home
        </Link>
      </div>
    </div>
  )
}
