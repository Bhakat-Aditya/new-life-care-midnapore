import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { ShieldCheck, Lock, Eye, EyeOff, KeyRound, ArrowRight, HeartPulse } from 'lucide-react'
import toast from 'react-hot-toast'
import PageTransition from '../components/PageTransition'
import { loginAdmin } from '../services/api'

export default function AdminLoginPage() {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // If already logged in, redirect to dashboard
    if (localStorage.getItem('nlc_admin_token')) {
      navigate('/admin/dashboard')
    }
  }, [navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!password.trim()) {
      toast.error('Please enter the Admin Master Password')
      return
    }

    setLoading(true)
    try {
      const res = await loginAdmin(password)
      if (res.success && res.token) {
        localStorage.setItem('nlc_admin_token', res.token)
        localStorage.setItem('nlc_admin_user', JSON.stringify(res.admin || { username: 'admin' }))
        toast.success('Admin authorization granted!')
        navigate('/admin/dashboard')
      } else {
        toast.error(res.message || 'Invalid administrator password')
      }
    } catch (err) {
      toast.error(err.message || 'Incorrect administrator password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageTransition>
      <Helmet>
        <title>Admin Portal Login | New Life Care Diagnostic Centre</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4 py-16">
        <div className="w-full max-w-md">
          {/* Brand header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-sky-600 text-white shadow-lg shadow-sky-600/30 mb-4">
              <HeartPulse className="w-8 h-8" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 font-nunito">
              Hospital Admin Portal
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              New Life Care Diagnostic Centre & Nursing Home
            </p>
          </div>

          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/60 border border-slate-100"
          >
            <div className="flex items-center gap-3 p-3 bg-sky-50 rounded-2xl border border-sky-100 mb-6">
              <ShieldCheck className="w-5 h-5 text-sky-600 shrink-0" />
              <p className="text-xs text-sky-800 leading-tight">
                Single-password administrative access for Doctors, Gallery uploads, and LIS sync control.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Admin Master Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter admin password..."
                    required
                    className="w-full pl-10 pr-12 py-3.5 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none text-sm transition-all bg-slate-50/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white font-semibold text-sm transition-all shadow-md shadow-sky-600/20 cursor-pointer"
              >
                {loading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>Enter Admin Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-400">
                Authorized hospital management & medical technicians only.
              </p>
            </div>
          </motion.div>
        </div>
      </main>
    </PageTransition>
  )
}

