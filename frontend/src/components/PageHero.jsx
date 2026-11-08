import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'

export default function PageHero({
  title,
  subtitle,
  breadcrumb = [],
  breadcrumbs,
  badge,
}) {
  const rawCrumbs = breadcrumbs && breadcrumbs.length > 0 ? breadcrumbs : breadcrumb
  // Filter out duplicate leading 'Home' crumb if page provided it
  const crumbs = rawCrumbs.filter(
    (c, idx) => !(idx === 0 && (c.label === 'Home' || c.to === '/' || c.href === '/'))
  )

  return (
    <section className="relative bg-gradient-to-br from-sky-600 via-sky-500 to-sky-700 text-white pt-32 sm:pt-36 md:pt-40 lg:pt-44 pb-16 md:pb-20 overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 translate-y-1/2 pointer-events-none" />
      <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-white/5 rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Optional Badge */}
        {badge && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/15 text-white backdrop-blur-md border border-white/20 mb-3.5 shadow-sm"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
            {badge}
          </motion.div>
        )}

        {/* Breadcrumb */}
        {crumbs.length > 0 && (
          <motion.nav
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-1 text-sky-200 text-sm mb-4"
            aria-label="Breadcrumb"
          >
            <Link to="/" className="flex items-center gap-1 hover:text-white transition-colors">
              <Home size={14} />
              Home
            </Link>
            {crumbs.map((crumb, i) => {
              const target = crumb.to || crumb.href
              return (
                <span key={i} className="flex items-center gap-1">
                  <ChevronRight size={14} />
                  {target ? (
                    <Link to={target} className="hover:text-white transition-colors">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-white font-medium">{crumb.label}</span>
                  )}
                </span>
              )
            })}
          </motion.nav>
        )}

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-3xl sm:text-4xl md:text-5xl font-bold font-nunito mb-3 sm:mb-4 tracking-tight"
        >
          {title}
        </motion.h1>

        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-sky-100 text-base sm:text-lg max-w-2xl leading-relaxed"
          >
            {subtitle}
          </motion.p>
        )}
      </div>

      {/* Wave bottom separator */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none">
        <svg
          viewBox="0 0 1440 48"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
          preserveAspectRatio="none"
        >
          <path
            d="M0,48 C360,0 1080,0 1440,48 L1440,48 L0,48 Z"
            fill="#f8fafc"
          />
        </svg>
      </div>
    </section>
  )
}
