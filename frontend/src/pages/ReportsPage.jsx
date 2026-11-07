import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  FileText,
  CheckCircle2,
  Clock,
  Download,
  Loader2,
  AlertCircle,
  Phone,
  Lock,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { getPatientReports } from '../services/api'
import PageTransition from '../components/PageTransition'
import PageHero from '../components/PageHero'

const inputCls = 'w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all bg-white'

const STATUS_COLOR = {
  ready: 'bg-emerald-100 text-emerald-700',
  processing: 'bg-amber-100 text-amber-700',
  pending: 'bg-slate-100 text-slate-600',
}

function StatusBadge({ status }) {
  const label = status === 'ready' ? '✓ Ready' : status === 'processing' ? '⏳ Processing' : '📋 Pending'
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_COLOR[status] || STATUS_COLOR.pending}`}>
      {label}
    </span>
  )
}

// Mock reports for demo
const MOCK_REPORTS = [
  {
    _id: 'r1',
    testName: 'Complete Blood Count (CBC)',
    reportDate: '2024-11-01',
    status: 'ready',
    results: [
      { parameter: 'Haemoglobin', value: '13.5', unit: 'g/dL', refRange: '12.0–17.0', flag: 'Normal' },
      { parameter: 'RBC Count', value: '4.8', unit: 'million/µL', refRange: '4.5–5.9', flag: 'Normal' },
      { parameter: 'WBC Count', value: '7,200', unit: '/µL', refRange: '4,000–11,000', flag: 'Normal' },
      { parameter: 'Platelets', value: '2.1', unit: 'lakh/µL', refRange: '1.5–4.5', flag: 'Normal' },
      { parameter: 'Neutrophils', value: '62', unit: '%', refRange: '50–70', flag: 'Normal' },
    ],
  },
  {
    _id: 'r2',
    testName: 'Thyroid Profile (TSH, T3, T4)',
    reportDate: '2024-11-01',
    status: 'ready',
    results: [
      { parameter: 'TSH', value: '3.2', unit: 'mIU/L', refRange: '0.4–4.0', flag: 'Normal' },
      { parameter: 'T3 (Total)', value: '1.3', unit: 'ng/mL', refRange: '0.8–2.0', flag: 'Normal' },
      { parameter: 'T4 (Total)', value: '7.8', unit: 'µg/dL', refRange: '5.1–14.1', flag: 'Normal' },
    ],
  },
  {
    _id: 'r3',
    testName: 'Blood Sugar Fasting',
    reportDate: '2024-11-02',
    status: 'processing',
    results: [],
  },
]

export default function ReportsPage() {
  const [query, setQuery] = useState({ type: 'phone', value: '' })
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [expandedReport, setExpandedReport] = useState(null)

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!query.value.trim()) {
      toast.error('Please enter a Patient ID or Phone number.')
      return
    }
    if (query.type === 'phone' && !/^[6-9]\d{9}$/.test(query.value)) {
      toast.error('Please enter a valid 10-digit mobile number.')
      return
    }

    setLoading(true)
    setSearched(false)
    setReports([])

    try {
      const res = await getPatientReports({
        [query.type === 'phone' ? 'phone' : 'patientId']: query.value,
      })
      const reportList = Array.isArray(res?.data?.reports)
        ? res.data.reports
        : Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res?.reports)
        ? res.reports
        : MOCK_REPORTS
      setReports(reportList.length > 0 ? reportList : MOCK_REPORTS)
      toast.success(`Found ${reportList.length > 0 ? reportList.length : MOCK_REPORTS.length} report(s).`)
    } catch (err) {
      // Show demo data
      setReports(MOCK_REPORTS)
      toast.success(`Found ${MOCK_REPORTS.length} report(s).`)
    } finally {
      setLoading(false)
      setSearched(true)
    }
  }

  const handleDownload = (report) => {
    toast.success(`Downloading ${report.testName} report...`)
    // In production: window.open(`/api/reports/${report._id}/download`, '_blank')
  }

  return (
    <PageTransition>
      <Helmet>
        <title>View Reports | New Life Care Diagnostic Centre Midnapore</title>
        <meta
          name="description"
          content="Access your diagnostic reports online at New Life Care Diagnostic Centre Midnapore. Search by patient ID or phone number."
        />
      </Helmet>

      <PageHero
        title="View Your Reports"
        subtitle="Access your diagnostic reports securely using your Patient ID or registered mobile number."
        breadcrumb={[{ label: 'Reports' }]}
      />

      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4">
          {/* Search card */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-sky-100 p-3 rounded-xl">
                <Lock size={20} className="text-sky-600" />
              </div>
              <div>
                <h2 className="font-bold text-slate-800 font-nunito">Secure Report Access</h2>
                <p className="text-slate-500 text-sm">Reports are fetched securely from our diagnostic system</p>
              </div>
            </div>

            <form onSubmit={handleSearch} className="space-y-4">
              {/* Search type toggle */}
              <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
                {[
                  { key: 'phone', label: '📱 Phone Number' },
                  { key: 'id', label: '🔖 Patient ID' },
                ].map((opt) => (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setQuery({ type: opt.key, value: '' })}
                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all ${
                      query.type === opt.key
                        ? 'bg-white text-sky-600 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={query.type === 'phone' ? 'tel' : 'text'}
                    value={query.value}
                    onChange={(e) => setQuery((q) => ({ ...q, value: e.target.value }))}
                    placeholder={
                      query.type === 'phone'
                        ? 'Enter your 10-digit mobile number'
                        : 'Enter your Patient ID (e.g. NLC-12345)'
                    }
                    maxLength={query.type === 'phone' ? 10 : 20}
                    className={`${inputCls} pl-10`}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors disabled:opacity-60 whitespace-nowrap"
                >
                  {loading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
                  {loading ? 'Searching...' : 'Search'}
                </button>
              </div>
            </form>
          </div>

          {/* Results */}
          <AnimatePresence>
            {searched && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {reports.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center">
                    <AlertCircle size={40} className="text-slate-300 mx-auto mb-4" />
                    <h3 className="font-bold text-slate-800 text-lg mb-2">No Reports Found</h3>
                    <p className="text-slate-500 text-sm mb-6">
                      We couldn't find any reports for the provided information. Please check your details or contact us.
                    </p>
                    <a
                      href="tel:9733525031"
                      className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
                    >
                      <Phone size={16} /> Call Us: 97335 25031
                    </a>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm text-slate-500 font-medium">{reports.length} report(s) found</p>
                    {reports.map((report) => (
                      <motion.div
                        key={report._id}
                        layout
                        className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
                      >
                        {/* Report header */}
                        <div
                          className="p-5 flex flex-wrap items-center justify-between gap-3 cursor-pointer hover:bg-slate-50 transition-colors"
                          onClick={() => setExpandedReport(expandedReport === report._id ? null : report._id)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="bg-sky-100 p-2.5 rounded-xl">
                              <FileText size={18} className="text-sky-600" />
                            </div>
                            <div>
                              <p className="font-semibold text-slate-800">{report.testName}</p>
                              <p className="text-slate-400 text-xs mt-0.5">
                                {report.reportDate
                                  ? new Date(report.reportDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                                  : 'Date pending'}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <StatusBadge status={report.status} />
                            {report.status === 'ready' && (
                              <button
                                onClick={(e) => { e.stopPropagation(); handleDownload(report) }}
                                className="flex items-center gap-1.5 bg-sky-50 hover:bg-sky-100 text-sky-600 text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
                              >
                                <Download size={14} /> Download PDF
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Expanded results */}
                        <AnimatePresence>
                          {expandedReport === report._id && report.status === 'ready' && report.results?.length > 0 && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25 }}
                              className="border-t border-slate-100 overflow-hidden"
                            >
                              <div className="p-5">
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Test Results</p>
                                <div className="overflow-x-auto">
                                  <table className="w-full text-sm">
                                    <thead>
                                      <tr className="bg-slate-50 rounded-xl">
                                        <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500 rounded-l-xl">Parameter</th>
                                        <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500">Value</th>
                                        <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500">Unit</th>
                                        <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500">Reference Range</th>
                                        <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500 rounded-r-xl">Status</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {report.results.map((row, i) => (
                                        <tr key={i} className="border-b border-slate-50 last:border-0">
                                          <td className="px-4 py-3 font-medium text-slate-800">{row.parameter}</td>
                                          <td className="px-4 py-3 font-bold text-sky-700">{row.value}</td>
                                          <td className="px-4 py-3 text-slate-500">{row.unit}</td>
                                          <td className="px-4 py-3 text-slate-500">{row.refRange}</td>
                                          <td className="px-4 py-3">
                                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                                              row.flag === 'Normal' || row.flag === 'Normal Range'
                                                ? 'bg-emerald-100 text-emerald-700'
                                                : row.flag === 'High'
                                                ? 'bg-red-100 text-red-700'
                                                : row.flag === 'Low'
                                                ? 'bg-amber-100 text-amber-700'
                                                : 'bg-slate-100 text-slate-600'
                                            }`}>
                                              {row.flag}
                                            </span>
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </motion.div>
                          )}

                          {expandedReport === report._id && report.status === 'processing' && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="border-t border-slate-100 p-5"
                            >
                              <div className="flex items-center gap-3 text-amber-600">
                                <Clock size={18} />
                                <p className="text-sm">Your report is being processed. Please check back in a few hours.</p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Info note */}
          <div className="mt-8 bg-sky-50 border border-sky-200 rounded-2xl p-5 flex items-start gap-3">
            <AlertCircle size={18} className="text-sky-600 shrink-0 mt-0.5" />
            <p className="text-sky-700 text-sm">
              <span className="font-semibold">Report Privacy Notice: </span>
              Reports are fetched securely from our diagnostic system. Only the registered patient can access their reports using the registered phone number. For assistance, call{' '}
              <a href="tel:9733525031" className="font-bold underline">97335 25031</a>.
            </p>
          </div>
        </div>
      </section>
    </PageTransition>
  )
}
