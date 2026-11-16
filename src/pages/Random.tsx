import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getIndex } from '../lib/pokedex'

export default function Random() {
  const navigate = useNavigate()

  useEffect(() => {
    let alive = true
    getIndex()
      .then((index) => {
        if (!alive || index.length === 0) return
        const entry = index[Math.floor(Math.random() * index.length)]
        navigate(`/pokemon/${entry.id}`, { replace: true })
      })
      .catch(() => navigate('/dex', { replace: true }))
    return () => {
      alive = false
    }
  }, [navigate])

  return (
    <div className="wrap grid min-h-[50vh] place-items-center py-16">
      <div className="text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-line border-t-accent" />
        <p className="mono mt-4 text-faint">Rolling the dice…</p>
      </div>
    </div>
  )
}
