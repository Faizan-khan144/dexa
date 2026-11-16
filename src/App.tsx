import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import ScrollProgress from './components/ScrollProgress'
import SiteFooter from './components/SiteFooter'
import SiteHeader from './components/SiteHeader'
import Detail from './pages/Detail'
import Dex from './pages/Dex'
import Favorites from './pages/Favorites'
import Landing from './pages/Landing'
import NotFound from './pages/NotFound'

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])

  return null
}

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollProgress />
      <ScrollToTop />
      <SiteHeader />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dex" element={<Dex />} />
          <Route path="/pokemon/:id" element={<Detail />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <SiteFooter />
    </div>
  )
}
