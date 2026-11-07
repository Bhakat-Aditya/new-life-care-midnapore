import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import DepartmentsPage from './pages/DepartmentsPage'
import DoctorsPage from './pages/DoctorsPage'
import DiagnosticsPage from './pages/DiagnosticsPage'
import GalleryPage from './pages/GalleryPage'
import BookConsultationPage from './pages/BookConsultationPage'
import BookCollectionPage from './pages/BookCollectionPage'
import ReportsPage from './pages/ReportsPage'
import ContactPage from './pages/ContactPage'
import AdminLoginPage from './pages/AdminLoginPage'
import AdminDashboardPage from './pages/AdminDashboardPage'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  const location = useLocation()

  // Initialize Lenis with GSAP ScrollTrigger sync
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
    })

    lenis.on('scroll', ScrollTrigger.update)

    const tickerCallback = (time) => {
      lenis.raf(time * 1000)
    }

    gsap.ticker.add(tickerCallback)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(tickerCallback)
      lenis.destroy()
    }
  }, [])

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [location.pathname])

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Website with Header & Footer */}
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/departments" element={<DepartmentsPage />} />
          <Route path="/doctors" element={<DoctorsPage />} />
          <Route path="/diagnostics" element={<DiagnosticsPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/book-consultation" element={<BookConsultationPage />} />
          <Route path="/book-collection" element={<BookCollectionPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Route>

        {/* Administrative Portal */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
      </Routes>
    </AnimatePresence>
  )
}
