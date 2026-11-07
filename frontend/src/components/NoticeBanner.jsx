import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Megaphone,
  X,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Bell,
} from 'lucide-react'
import { getActiveNotices } from '../services/api'

export default function NoticeBanner({ onOpenModal }) {
  const [notices, setNotices] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [dismissed, setDismissed] = useState(false)

  const fetchNotices = async () => {
    try {
      const data = await getActiveNotices()
      if (Array.isArray(data) && data.length > 0) {
        // Sort: alerts first, then newest first
        const sorted = [...data].sort((a, b) => {
          if (a.type === 'alert' && b.type !== 'alert') return -1
          if (b.type === 'alert' && a.type !== 'alert') return 1
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        })
        setNotices(sorted)
      }
    } catch (_) {}
  }

  useEffect(() => {
    fetchNotices()
    // Poll every 30 seconds so new alerts posted by admin show up automatically
    const interval = setInterval(fetchNotices, 30000)
    return () => clearInterval(interval)
  }, [])

  // Auto-rotate if multiple notices
  useEffect(() => {
    if (notices.length <= 1) return
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % notices.length)
    }, 7000)
    return () => clearInterval(timer)
  }, [notices.length])

  if (dismissed || notices.length === 0) return null

  const notice = notices[currentIndex]
  const isAlert = notice.type === 'alert'

  return (
    <aside
      aria-label="Important Patient Notice"
      className={`text-white text-xs sm:text-sm py-2 px-3 sm:px-6 relative z-50 transition-colors shadow-sm ${
        isAlert
          ? 'bg-gradient-to-r from-rose-600 via-red-600 to-amber-700 animate-pulse-slow'
          : notice.type === 'camp'
          ? 'bg-gradient-to-r from-emerald-700 via-teal-700 to-sky-800'
          : 'bg-gradient-to-r from-sky-700 via-sky-800 to-indigo-900'
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Left Notice Text */}
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <span className="shrink-0 p-1 bg-white/20 rounded-lg flex items-center justify-center">
            {isAlert ? (
              <AlertTriangle className="w-3.5 h-3.5 text-amber-200 animate-bounce" />
            ) : (
              <Megaphone className="w-3.5 h-3.5 text-emerald-200" />
            )}
          </span>

          <div className="flex items-center gap-2 truncate">
            <span
              className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded shadow-sm shrink-0 ${
                isAlert ? 'bg-white text-rose-700' : 'bg-white/20 text-white'
              }`}
            >
              {notice.type === 'alert' ? 'URGENT ALERT' : notice.type || 'Notice'}
            </span>
            <strong className="font-bold text-white truncate text-xs sm:text-sm">
              {notice.title}:
            </strong>
            <span className="text-white/90 truncate text-xs sm:text-sm hidden sm:inline">
              {notice.content}
            </span>
          </div>

          {notice.link && (
            <Link
              to={notice.link}
              className="inline-flex items-center gap-1 text-xs font-bold text-white underline hover:text-amber-200 shrink-0 ml-1"
            >
              Details <ArrowRight className="w-3 h-3" />
            </Link>
          )}
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Quick open all modal button */}
          {onOpenModal && (
            <button
              onClick={onOpenModal}
              className="text-[11px] font-bold bg-white/20 hover:bg-white/30 text-white px-2.5 py-0.5 rounded-lg transition-colors cursor-pointer hidden md:inline-flex items-center gap-1"
            >
              <Bell className="w-3 h-3" />
              All Alerts ({notices.length})
            </button>
          )}

          {/* Prev / Next buttons */}
          {notices.length > 1 && (
            <div className="flex items-center gap-0.5 bg-black/20 rounded-lg p-0.5">
              <button
                onClick={() =>
                  setCurrentIndex((prev) => (prev === 0 ? notices.length - 1 : prev - 1))
                }
                aria-label="Previous alert"
                className="p-1 hover:bg-white/20 rounded text-white cursor-pointer"
              >
                <ChevronLeft className="w-3 h-3" />
              </button>
              <span className="text-[10px] px-1 text-white/90 font-mono">
                {currentIndex + 1}/{notices.length}
              </span>
              <button
                onClick={() => setCurrentIndex((prev) => (prev + 1) % notices.length)}
                aria-label="Next alert"
                className="p-1 hover:bg-white/20 rounded text-white cursor-pointer"
              >
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Dismiss button */}
          <button
            onClick={() => setDismissed(true)}
            aria-label="Dismiss alert banner"
            className="p-1 hover:bg-white/20 rounded-md text-white/80 hover:text-white transition-colors cursor-pointer ml-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  )
}
