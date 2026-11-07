import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Images,
  Video,
  Play,
  Maximize2,
  X,
  Layers,
  Sparkles,
  Building2,
  Microscope,
  Stethoscope,
  HeartHandshake,
} from 'lucide-react'
import PageTransition from '../components/PageTransition'
import PageHero from '../components/PageHero'
import { getGallery } from '../services/api'

const CATEGORIES = [
  { id: 'All', label: 'All Photos & Media', icon: Layers },
  { id: 'Facilities', label: 'Centres & Lounge', icon: Building2 },
  { id: 'Equipment', label: 'Lab & Diagnostics', icon: Microscope },
  { id: 'Doctors', label: 'Specialists & Staff', icon: Stethoscope },
  { id: 'Events & Camps', label: 'Health Camps', icon: HeartHandshake },
]

// Convert YouTube watch URL or share URL to embed URL
const getYouTubeEmbedUrl = (url) => {
  if (!url) return null
  try {
    if (url.includes('embed/')) return url
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
    const match = url.match(regExp)
    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}?autoplay=1`
    }
  } catch (_) {}
  return url
}

export default function GalleryPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('All')
  const [activeModal, setActiveModal] = useState(null) // { type: 'image' | 'video', url, title, desc }

  useEffect(() => {
    const fetchGallery = async () => {
      setLoading(true)
      try {
        const data = await getGallery(activeCategory === 'All' ? null : activeCategory)
        setItems(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error('Error fetching gallery:', err)
        setItems([])
      } finally {
        setLoading(false)
      }
    }
    fetchGallery()
  }, [activeCategory])

  const filteredItems = items

  return (
    <PageTransition>
      <Helmet>
        <title>Hospital & Lab Gallery | New Life Care Diagnostic Centre - Midnapore</title>
        <meta
          name="description"
          content="Explore photos and video tours of New Life Care Diagnostic Centre in Midnapore. View our advanced pathology lab, digital X-Ray equipment, USG rooms, and specialist doctors."
        />
      </Helmet>

      <PageHero
        badge="Visual Tour"
        title="Our Infrastructure, Equipment & Dedicated Team"
        subtitle="Take a look inside Midnapore's premier NABL-certified diagnostic centre and nursing care facility."
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Category Filter Tabs */}
        <section aria-label="Media Category Filters" className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon
            const isActive = activeCategory === cat.id
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-sky-300 hover:bg-sky-50/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {cat.label}
              </button>
            )
          })}
        </section>

        {/* Gallery Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-white rounded-2xl border border-slate-100 p-4 space-y-3 animate-pulse">
                <div className="h-56 bg-slate-200 rounded-xl" />
                <div className="h-4 bg-slate-200 rounded w-2/3" />
                <div className="h-3 bg-slate-100 rounded w-full" />
              </div>
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 p-8">
            <Images className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-700">No media available in this category</h3>
            <p className="text-slate-400 text-sm mt-1">Please select another category or check back soon.</p>
          </div>
        ) : (
          <motion.section
            aria-label="Gallery Media Grid"
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredItems.map((item, idx) => {
              const hasVideo = Boolean(item.youtubeUrl)
              return (
                <motion.article
                  key={item._id || item.id || idx}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
                >
                  {/* Media Visual Container */}
                  <div className="relative h-60 w-full overflow-hidden bg-slate-100">
                    <img
                      src={item.imageUrl || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800'}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                    {/* Category Pill */}
                    <span className="absolute top-4 left-4 text-[11px] font-bold uppercase tracking-wider bg-white/90 backdrop-blur-md text-sky-800 px-3 py-1 rounded-full shadow-sm">
                      {item.category || 'Hospital'}
                    </span>

                    {/* Play or Inspect Button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      {hasVideo ? (
                        <button
                          onClick={() =>
                            setActiveModal({
                              type: 'video',
                              url: item.youtubeUrl,
                              title: item.title,
                              desc: item.description,
                            })
                          }
                          aria-label={`Play video: ${item.title}`}
                          className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform cursor-pointer"
                        >
                          <Play className="w-6 h-6 fill-white ml-0.5" />
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            setActiveModal({
                              type: 'image',
                              url: item.imageUrl,
                              title: item.title,
                              desc: item.description,
                            })
                          }
                          aria-label={`Enlarge photo: ${item.title}`}
                          className="w-12 h-12 rounded-full bg-white/80 hover:bg-white text-slate-800 flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transform group-hover:scale-105 transition-all cursor-pointer"
                        >
                          <Maximize2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>

                    {hasVideo && (
                      <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 bg-red-600/90 text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
                        <Video className="w-3 h-3" /> Video Tour
                      </span>
                    )}
                  </div>

                  {/* Caption */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h2 className="font-bold text-slate-800 text-lg mb-2 leading-snug group-hover:text-sky-600 transition-colors">
                        {item.title}
                      </h2>
                      {item.description && (
                        <p className="text-slate-500 text-sm leading-relaxed line-clamp-3">
                          {item.description}
                        </p>
                      )}
                    </div>

                    {hasVideo && (
                      <button
                        onClick={() =>
                          setActiveModal({
                            type: 'video',
                            url: item.youtubeUrl,
                            title: item.title,
                            desc: item.description,
                          })
                        }
                        className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 hover:text-sky-700 cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5 fill-sky-600" /> Watch YouTube Video &rarr;
                      </button>
                    )}
                  </div>
                </motion.article>
              )
            })}
          </motion.section>
        )}

        {/* Lightbox / Video Modal */}
        <AnimatePresence>
          {activeModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModal(null)}
              className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm p-4 sm:p-8 flex items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-3xl overflow-hidden max-w-4xl w-full shadow-2xl relative"
              >
                <button
                  onClick={() => setActiveModal(null)}
                  className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>

                {activeModal.type === 'video' ? (
                  <div className="relative pt-[56.25%] bg-black">
                    <iframe
                      src={getYouTubeEmbedUrl(activeModal.url)}
                      title={activeModal.title}
                      className="absolute inset-0 w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div className="max-h-[70vh] bg-slate-950 flex items-center justify-center overflow-hidden">
                    <img
                      src={activeModal.url}
                      alt={activeModal.title}
                      className="max-h-[70vh] w-auto object-contain"
                    />
                  </div>
                )}

                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-800">{activeModal.title}</h3>
                  {activeModal.desc && (
                    <p className="text-sm text-slate-600 mt-2 leading-relaxed">{activeModal.desc}</p>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </PageTransition>
  )
}

