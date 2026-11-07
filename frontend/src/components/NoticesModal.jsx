import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  X,
  Megaphone,
  AlertTriangle,
  Calendar,
  ArrowRight,
  ShieldAlert,
  Info,
  ExternalLink,
} from 'lucide-react'

export default function NoticesModal({ isOpen, onClose, notices = [] }) {
  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm p-4 flex items-center justify-center overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-8 max-h-[85vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
                <Megaphone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800">
                  Hospital Notices & Patient Alerts
                </h3>
                <p className="text-xs text-slate-500">
                  Active announcements from New Life Care Diagnostic Centre
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              aria-label="Close alerts"
              className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List of Notices */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-1">
            {notices.length === 0 ? (
              <div className="text-center py-10 text-slate-400">
                <Info className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                <p className="text-sm">No active announcements at this time.</p>
              </div>
            ) : (
              notices.map((n, idx) => {
                const isAlert = n.type === 'alert'
                return (
                  <div
                    key={n._id || idx}
                    className={`p-5 rounded-2xl border transition-all ${
                      isAlert
                        ? 'bg-rose-50/70 border-rose-200'
                        : n.type === 'camp'
                        ? 'bg-emerald-50/60 border-emerald-200'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        {isAlert ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-rose-600 text-white">
                            <AlertTriangle className="w-3 h-3" />
                            Urgent Alert
                          </span>
                        ) : (
                          <span
                            className={`text-[11px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                              n.type === 'camp'
                                ? 'bg-emerald-600 text-white'
                                : 'bg-sky-600 text-white'
                            }`}
                          >
                            {n.type || 'Notice'}
                          </span>
                        )}
                        <h4 className="font-bold text-slate-800 text-base leading-snug">
                          {n.title}
                        </h4>
                      </div>
                      <span className="text-[11px] text-slate-400 whitespace-nowrap">
                        {n.createdAt
                          ? new Date(n.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                            })
                          : 'Live'}
                      </span>
                    </div>

                    <p className="text-slate-600 text-sm leading-relaxed mb-3">
                      {n.content}
                    </p>

                    {n.link && (
                      <Link
                        to={n.link}
                        onClick={onClose}
                        className="inline-flex items-center gap-1 text-xs font-bold text-sky-600 hover:text-sky-700 underline"
                      >
                        <span>Take Action / More Info</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    )}
                  </div>
                )
              })
            )}
          </div>

          {/* Footer note */}
          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <span>Helpline: 097335 25031</span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

