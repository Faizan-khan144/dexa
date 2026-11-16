import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import ScrollProgress from './components/ScrollProgress'
import SiteFooter from './components/SiteFooter'
import SiteHeader from './components/SiteHeader'
import About from './pages/About'
import Detail from './pages/Detail'
import Dex from './pages/Dex'
import Favorites from './pages/Favorites'
import Generations from './pages/Generations'
import Landing from './pages/Landing'
import NotFound from './pages/NotFound'
import Random from './pages/Random'
import TypeDetail from './pages/TypeDetail'
import Types from './pages/Types'

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])

  return null
}

export default function App() {
  const location = useLocation()

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-clip">
      <div className="glow-orb glow-orb-a" aria-hidden="true" />
      <div className="glow-orb glow-orb-b" aria-hidden="true" />
      <ScrollProgress />
      <ScrollToTop />
      <SiteHeader />
      <main key={location.pathname} className="page-enter relative z-10 flex-1 pt-[84px] sm:pt-[88px]">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dex" element={<Dex />} />
          <Route path="/pokemon/:id" element={<Detail />} />
          <Route path="/types" element={<Types />} />
          <Route path="/types/:name" element={<TypeDetail />} />
          <Route path="/generations" element={<Generations />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/about" element={<About />} />
          <Route path="/random" element={<Random />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <SiteFooter />
    </div>
  )
}
