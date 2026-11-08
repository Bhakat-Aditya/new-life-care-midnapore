import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Stethoscope,
  Images,
  Megaphone,
  CalendarCheck,
  FlaskConical,
  RefreshCw,
  Plus,
  Trash2,
  Edit,
  Upload,
  CheckCircle2,
  AlertCircle,
  Video,
  LogOut,
  KeyRound,
  Eye,
  EyeOff,
  Clock,
  ExternalLink,
  ChevronRight,
  Shield,
  Save,
  X,
} from 'lucide-react'
import toast from 'react-hot-toast'
import PageTransition from '../components/PageTransition'
import {
  getAdminStats,
  getDoctors,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  getGallery,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
  getAllNotices,
  createNotice,
  updateNotice,
  deleteNotice,
  getAdminBookings,
  updateBookingStatus,
  getTestCatalog,
  syncTestsFromLIS,
  getSyncStatus,
  createTestItem,
  updateTestItem,
  deleteTestItem,
  changeAdminPassword,
} from '../services/api'

export default function AdminDashboardPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview') // overview | doctors | gallery | notices | bookings | tests | settings
  const [stats, setStats] = useState(null)
  const [syncInfo, setSyncInfo] = useState(null)
  const [syncing, setSyncing] = useState(false)

  // Data lists
  const [doctors, setDoctors] = useState([])
  const [gallery, setGallery] = useState([])
  const [notices, setNotices] = useState([])
  const [bookings, setBookings] = useState([])
  const [tests, setTests] = useState([])
  const [loadingData, setLoadingData] = useState(false)

  // Modals & form state
  const [doctorModalOpen, setDoctorModalOpen] = useState(false)
  const [editingDoctor, setEditingDoctor] = useState(null)
  const [doctorForm, setDoctorForm] = useState({
    name: '',
    specialization: '',
    qualification: '',
    experience: '10+ Years',
    phone: '',
    about: '',
    schedule: '',
    imageFile: null,
    imageUrl: '',
  })

  const [galleryModalOpen, setGalleryModalOpen] = useState(false)
  const [editingGallery, setEditingGallery] = useState(null)
  const [galleryForm, setGalleryForm] = useState({
    title: '',
    description: '',
    category: 'Facilities',
    youtubeUrl: '',
    featured: false,
    imageFile: null,
    imageUrl: '',
  })

  const [noticeModalOpen, setNoticeModalOpen] = useState(false)
  const [editingNotice, setEditingNotice] = useState(null)
  const [noticeForm, setNoticeForm] = useState({
    title: '',
    content: '',
    type: 'info',
    isActive: true,
    priority: 1,
    link: '',
  })

  const [testModalOpen, setTestModalOpen] = useState(false)
  const [editingTest, setEditingTest] = useState(null)
  const [testForm, setTestForm] = useState({
    testCode: '',
    name: '',
    category: 'Pathology',
    price: '',
    turnaround: '4-6 hours',
    sampleType: 'Blood',
  })

  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })

  // Auth check
  useEffect(() => {
    const token = localStorage.getItem('nlc_admin_token')
    if (!token) {
      navigate('/admin/login')
    }
  }, [navigate])

  // Load stats and sync info on mount
  const refreshStats = async () => {
    try {
      const [sData, syncData] = await Promise.all([getAdminStats(), getSyncStatus()])
      setStats(sData)
      setSyncInfo(syncData)
    } catch (_) {}
  }

  useEffect(() => {
    refreshStats()
  }, [])

  // Load tab-specific data
  useEffect(() => {
    const loadTabData = async () => {
      setLoadingData(true)
      try {
        if (activeTab === 'doctors') {
          const res = await getDoctors()
          setDoctors(Array.isArray(res) ? res : [])
        } else if (activeTab === 'gallery') {
          const res = await getGallery()
          setGallery(Array.isArray(res) ? res : [])
        } else if (activeTab === 'notices') {
          const res = await getAllNotices()
          setNotices(Array.isArray(res) ? res : [])
        } else if (activeTab === 'bookings') {
          const res = await getAdminBookings()
          setBookings(Array.isArray(res) ? res : [])
        } else if (activeTab === 'tests') {
          const res = await getTestCatalog()
          setTests(Array.isArray(res) ? res : [])
        }
      } catch (err) {
        console.error('Failed to load tab data:', err)
      } finally {
        setLoadingData(false)
      }
    }
    loadTabData()
  }, [activeTab])

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('nlc_admin_token')
    localStorage.removeItem('nlc_admin_user')
    toast.success('Logged out from Admin portal')
    navigate('/admin/login')
  }

  // Manual LIS sync trigger
  const handleTriggerSync = async () => {
    setSyncing(true)
    try {
      const res = await syncTestsFromLIS()
      toast.success(res.message || '24-Hour Sync triggered successfully!')
      refreshStats()
      if (activeTab === 'tests') {
        const t = await getTestCatalog()
        setTests(t)
      }
    } catch (err) {
      toast.error('Sync failed: ' + err.message)
    } finally {
      setSyncing(false)
    }
  }

  // ─── Doctor Form Handlers ──────────────────────────────────────────────────
  const handleOpenDoctorModal = (doc = null) => {
    if (doc) {
      setEditingDoctor(doc)
      setDoctorForm({
        name: doc.name || '',
        specialization: doc.specialization || '',
        qualification: doc.qualification || '',
        experience: doc.experience || '10+ Years',
        phone: doc.phone || '',
        about: doc.about || '',
        schedule: Array.isArray(doc.schedule) ? JSON.stringify(doc.schedule, null, 2) : '',
        imageUrl: doc.imageUrl || '',
        imageFile: null,
      })
    } else {
      setEditingDoctor(null)
      setDoctorForm({
        name: '',
        specialization: '',
        qualification: '',
        experience: '10+ Years',
        phone: '',
        about: '',
        schedule: '[\n  { "day": "Monday", "time": "10:00 AM – 1:00 PM" }\n]',
        imageUrl: '',
        imageFile: null,
      })
    }
    setDoctorModalOpen(true)
  }

  const handleSaveDoctor = async (e) => {
    e.preventDefault()
    const data = new FormData()
    data.append('name', doctorForm.name)
    data.append('specialization', doctorForm.specialization)
    data.append('qualification', doctorForm.qualification)
    data.append('experience', doctorForm.experience)
    data.append('phone', doctorForm.phone)
    data.append('about', doctorForm.about)
    data.append('schedule', doctorForm.schedule)
    if (doctorForm.imageFile) {
      data.append('image', doctorForm.imageFile)
    } else if (doctorForm.imageUrl) {
      data.append('imageUrl', doctorForm.imageUrl)
    }

    try {
      if (editingDoctor?._id) {
        await updateDoctor(editingDoctor._id, data)
        toast.success('Doctor updated successfully via Cloudinary!')
      } else {
        await createDoctor(data)
        toast.success('New doctor registered with Cloudinary image!')
      }
      setDoctorModalOpen(false)
      const res = await getDoctors()
      setDoctors(res)
      refreshStats()
    } catch (err) {
      toast.error(err.message || 'Failed to save doctor')
    }
  }

  const handleDeleteDoctor = async (id) => {
    if (!window.confirm('Are you sure you want to remove this doctor?')) return
    try {
      await deleteDoctor(id)
      toast.success('Doctor removed')
      setDoctors(doctors.filter((d) => d._id !== id))
      refreshStats()
    } catch (err) {
      toast.error('Failed to delete doctor')
    }
  }

  // ─── Gallery Form Handlers ─────────────────────────────────────────────────
  const handleOpenGalleryModal = (item = null) => {
    if (item) {
      setEditingGallery(item)
      setGalleryForm({
        title: item.title || '',
        description: item.description || '',
        category: item.category || 'Facilities',
        youtubeUrl: item.youtubeUrl || '',
        featured: Boolean(item.featured),
        imageUrl: item.imageUrl || '',
        imageFile: null,
      })
    } else {
      setEditingGallery(null)
      setGalleryForm({
        title: '',
        description: '',
        category: 'Facilities',
        youtubeUrl: '',
        featured: false,
        imageUrl: '',
        imageFile: null,
      })
    }
    setGalleryModalOpen(true)
  }

  const handleSaveGallery = async (e) => {
    e.preventDefault()
    const data = new FormData()
    data.append('title', galleryForm.title)
    data.append('description', galleryForm.description)
    data.append('category', galleryForm.category)
    data.append('youtubeUrl', galleryForm.youtubeUrl)
    data.append('featured', galleryForm.featured)
    if (galleryForm.imageFile) {
      data.append('image', galleryForm.imageFile)
    } else if (galleryForm.imageUrl) {
      data.append('imageUrl', galleryForm.imageUrl)
    }

    try {
      if (editingGallery?._id) {
        await updateGalleryItem(editingGallery._id, data)
        toast.success('Gallery media updated!')
      } else {
        await createGalleryItem(data)
        toast.success('Photo/Video added to gallery via Cloudinary!')
      }
      setGalleryModalOpen(false)
      const res = await getGallery()
      setGallery(res)
      refreshStats()
    } catch (err) {
      toast.error(err.message || 'Failed to upload to gallery')
    }
  }

  const handleDeleteGallery = async (id) => {
    if (!window.confirm('Delete this gallery media item?')) return
    try {
      await deleteGalleryItem(id)
      toast.success('Media item deleted')
      setGallery(gallery.filter((g) => g._id !== id))
      refreshStats()
    } catch (err) {
      toast.error('Failed to delete item')
    }
  }

  // ─── Notice Form Handlers ──────────────────────────────────────────────────
  const handleOpenNoticeModal = (item = null) => {
    if (item) {
      setEditingNotice(item)
      setNoticeForm({
        title: item.title || '',
        content: item.content || '',
        type: item.type || 'info',
        isActive: item.isActive !== undefined ? item.isActive : true,
        priority: item.priority || 1,
        link: item.link || '',
      })
    } else {
      setEditingNotice(null)
      setNoticeForm({
        title: '',
        content: '',
        type: 'camp',
        isActive: true,
        priority: 2,
        link: '/contact',
      })
    }
    setNoticeModalOpen(true)
  }

  const handleSaveNotice = async (e) => {
    e.preventDefault()
    try {
      if (editingNotice?._id) {
        await updateNotice(editingNotice._id, noticeForm)
        toast.success('Notice updated!')
      } else {
        await createNotice(noticeForm)
        toast.success('New announcement broadcasted!')
      }
      setNoticeModalOpen(false)
      const res = await getAllNotices()
      setNotices(res)
      refreshStats()
    } catch (err) {
      toast.error(err.message || 'Failed to save notice')
    }
  }

  const handleDeleteNotice = async (id) => {
    if (!window.confirm('Delete this announcement?')) return
    try {
      await deleteNotice(id)
      toast.success('Notice deleted')
      setNotices(notices.filter((n) => n._id !== id))
      refreshStats()
    } catch (err) {
      toast.error('Failed to delete notice')
    }
  }

  // ─── Test CRUD Handlers ────────────────────────────────────────────────────
  const handleOpenTestModal = (t = null) => {
    if (t) {
      setEditingTest(t)
      setTestForm({
        testCode: t.testCode || t.id || '',
        name: t.name || '',
        category: t.category || 'Pathology',
        price: t.price || '',
        turnaround: t.turnaround || '4-6 hours',
        sampleType: t.sampleType || 'Blood',
      })
    } else {
      setEditingTest(null)
      setTestForm({
        testCode: '',
        name: '',
        category: 'Pathology',
        price: '',
        turnaround: 'Same Day',
        sampleType: 'Blood',
      })
    }
    setTestModalOpen(true)
  }

  const handleSaveTest = async (e) => {
    e.preventDefault()
    try {
      if (editingTest?._id) {
        await updateTestItem(editingTest._id, testForm)
        toast.success('Test item / price adjusted!')
      } else {
        await createTestItem(testForm)
        toast.success('Custom test registered on server!')
      }
      setTestModalOpen(false)
      const res = await getTestCatalog()
      setTests(res)
    } catch (err) {
      toast.error(err.message || 'Failed to save test')
    }
  }

  const handleDeleteTest = async (id) => {
    if (!window.confirm('Delete this test item?')) return
    try {
      await deleteTestItem(id)
      toast.success('Test item removed')
      setTests(tests.filter((t) => t._id !== id && t.id !== id))
    } catch (err) {
      toast.error('Failed to delete test')
    }
  }

  // ─── Change Password Handler ───────────────────────────────────────────────
  const handleChangePassword = async (e) => {
    e.preventDefault()
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match')
      return
    }
    try {
      await changeAdminPassword(passwordForm.currentPassword, passwordForm.newPassword)
      toast.success('Master password updated successfully in database!')
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      toast.error(err.message || 'Failed to update password')
    }
  }

  // ─── Booking Status Update Handler ─────────────────────────────────────────
  const handleUpdateBookingStatus = async (id, status) => {
    try {
      await updateBookingStatus(id, status)
      toast.success(`Booking marked as ${status}`)
      setBookings(bookings.map((b) => (b._id === id ? { ...b, status } : b)))
    } catch (err) {
      toast.error('Failed to update status')
    }
  }

  return (
    <PageTransition>
      <Helmet>
        <title>Hospital Administration Dashboard | New Life Care</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0">
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs uppercase tracking-wider text-sky-400 font-bold block">Hospital Admin</span>
              <h2 className="text-white font-bold text-lg font-nunito">New Life Care</h2>
            </div>
            <Shield className="w-6 h-6 text-emerald-400" />
          </div>

          <nav className="p-4 space-y-1.5 flex-1">
            {[
              { id: 'overview', label: 'Overview & Sync', icon: LayoutDashboard },
              { id: 'doctors', label: 'Doctor Roster', icon: Stethoscope },
              { id: 'gallery', label: 'Photo & Video Gallery', icon: Images },
              { id: 'notices', label: 'Notices & Banners', icon: Megaphone },
              { id: 'bookings', label: 'Patient Bookings', icon: CalendarCheck },
              { id: 'tests', label: 'Tests & Pricing', icon: FlaskConical },
              { id: 'settings', label: 'Security & Access', icon: KeyRound },
            ].map((tab) => {
              const Icon = tab.icon
              const active = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                    active
                      ? 'bg-sky-600 text-white font-semibold shadow-md shadow-sky-600/30'
                      : 'hover:bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </nav>

          <div className="p-4 border-t border-slate-800">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out Admin</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-6 sm:p-10 max-w-7xl overflow-y-auto">
          {/* Top header bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-slate-200">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 capitalize">
                {activeTab.replace('-', ' ')}
              </h1>
              <p className="text-slate-500 text-xs sm:text-sm mt-1">
                Manage your hospital website data, Cloudinary uploads, and Main LIS Server sync.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleTriggerSync}
                disabled={syncing}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
                {syncing ? 'Syncing...' : 'Sync Tests (24h LIS)'}
              </button>
              <a
                href="/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold transition-colors"
              >
                <span>View Live Site</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* TAB 1: OVERVIEW & 24H SYNC */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Counters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Active Doctors', count: stats?.doctors ?? '—', icon: Stethoscope, color: 'text-sky-600', bg: 'bg-sky-50' },
                  { label: 'Gallery Media', count: stats?.gallery ?? '—', icon: Images, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                  { label: 'Live Notices', count: stats?.notices ?? '—', icon: Megaphone, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                  { label: 'Total Bookings', count: stats?.bookings ?? '—', icon: CalendarCheck, color: 'text-amber-600', bg: 'bg-amber-50' },
                ].map((stat) => {
                  const Icon = stat.icon
                  return (
                    <div key={stat.label} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center shrink-0`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-2xl font-bold text-slate-800">{stat.count}</span>
                        <p className="text-xs text-slate-500 font-medium">{stat.label}</p>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* 24-Hour Sync Status Card */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                      Automated 24-Hour Cycle
                    </span>
                    <h2 className="text-xl font-bold text-slate-800 mt-2">
                      Main LIS Server Gateway & Synchronization
                    </h2>
                    <p className="text-slate-500 text-xs sm:text-sm mt-1">
                      Our server runs a 24-hour background cron job to keep test names, categories, and prices up to date with the hospital's central server.
                    </p>
                  </div>
                  <button
                    onClick={handleTriggerSync}
                    disabled={syncing}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-sky-600/20 cursor-pointer shrink-0"
                  >
                    <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
                    {syncing ? 'Synchronizing with Main Server...' : 'Trigger Sync Now'}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-100 text-sm">
                  <div className="p-4 bg-slate-50 rounded-2xl">
                    <span className="text-xs text-slate-400 font-medium">Gateway Mode</span>
                    <p className="font-bold text-slate-700 mt-1">
                      {syncInfo?.isLisConfigured ? '🟢 Connected to Main LIS' : '🟡 Standby / Local Mock Mode'}
                    </p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl">
                    <span className="text-xs text-slate-400 font-medium">Last Synchronized</span>
                    <p className="font-bold text-slate-700 mt-1">
                      {syncInfo?.lastSyncTime
                        ? new Date(syncInfo.lastSyncTime).toLocaleString('en-IN')
                        : 'Server Startup Sync (Active)'}
                    </p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl">
                    <span className="text-xs text-slate-400 font-medium">Items Synced</span>
                    <p className="font-bold text-slate-700 mt-1">
                      {syncInfo?.totalItems ?? 22} Diagnostic Tests & Packages
                    </p>
                  </div>
                </div>

                <div className="mt-4 p-4 bg-sky-50/60 rounded-2xl border border-sky-100 text-xs text-sky-900 leading-relaxed">
                  <strong>Notice:</strong> As requested, the Main LIS Server API endpoint is currently kept blank in <code className="bg-white px-1.5 py-0.5 rounded border border-sky-200">.env</code>. The middleman gateway automatically serves tests from our local MongoDB database. Once you fill in <code className="bg-white px-1.5 py-0.5 rounded border border-sky-200">LIS_BASE_URL</code>, the 24-hour sync will seamlessly fetch directly from the main server.
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DOCTOR MANAGEMENT */}
          {activeTab === 'doctors' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <p className="text-sm text-slate-500">
                  Doctors shown here are hosted on our dedicated server and can be updated anytime with Cloudinary photos.
                </p>
                <button
                  onClick={() => handleOpenDoctorModal()}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-sm font-semibold shadow-sm cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add Doctor
                </button>
              </div>

              {loadingData ? (
                <div className="text-center py-12 text-slate-400">Loading doctor profiles...</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {doctors.map((doc) => (
                    <div key={doc._id || doc.id} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
                      <div className="flex items-start gap-4 mb-4">
                        <img
                          src={doc.imageUrl || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200'}
                          alt={doc.name}
                          className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <h3 className="font-bold text-slate-800 text-base">{doc.name}</h3>
                          <span className="text-xs font-semibold text-sky-600 bg-sky-50 px-2.5 py-0.5 rounded-full inline-block mt-1">
                            {doc.specialization}
                          </span>
                          <p className="text-xs text-slate-500 mt-1">{doc.qualification} · {doc.experience}</p>
                        </div>
                      </div>

                      <div className="space-y-1.5 text-xs text-slate-600 pt-3 border-t border-slate-100 mb-4">
                        <p className="font-semibold text-slate-700">OPD Timetable:</p>
                        {Array.isArray(doc.schedule) ? (
                          doc.schedule.map((s, idx) => (
                            <p key={idx} className="text-slate-500">
                              • {s.day}: {s.time}
                            </p>
                          ))
                        ) : (
                          <p className="text-slate-500">{doc.schedule || 'Consultation by appointment'}</p>
                        )}
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                        <button
                          onClick={() => handleOpenDoctorModal(doc)}
                          className="p-2 text-slate-600 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteDoctor(doc._id)}
                          className="p-2 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: GALLERY & YOUTUBE VIDEOS */}
          {activeTab === 'gallery' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <p className="text-sm text-slate-500">
                  Upload high-res photos to Cloudinary or link YouTube videos for public viewing on the Gallery page.
                </p>
                <button
                  onClick={() => handleOpenGalleryModal()}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-sm font-semibold shadow-sm cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add Photo / Video
                </button>
              </div>

              {loadingData ? (
                <div className="text-center py-12 text-slate-400">Loading gallery items...</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {gallery.map((item) => (
                    <div key={item._id || item.id} className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm flex flex-col justify-between">
                      <div className="relative h-44 bg-slate-100">
                        <img
                          src={item.imageUrl || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=400'}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur text-sky-800 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full">
                          {item.category}
                        </span>
                        {item.youtubeUrl && (
                          <span className="absolute bottom-3 right-3 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Video className="w-3 h-3" /> YouTube
                          </span>
                        )}
                      </div>

                      <div className="p-4 flex-1">
                        <h4 className="font-bold text-slate-800 text-sm line-clamp-1">{item.title}</h4>
                        {item.description && (
                          <p className="text-xs text-slate-500 mt-1 line-clamp-2">{item.description}</p>
                        )}
                        {item.youtubeUrl && (
                          <a
                            href={item.youtubeUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-2 text-xs text-sky-600 hover:underline flex items-center gap-1"
                          >
                            <span>Open Video Link</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>

                      <div className="p-3 bg-slate-50 flex items-center justify-end gap-2 border-t border-slate-100">
                        <button
                          onClick={() => handleOpenGalleryModal(item)}
                          className="p-1.5 text-slate-600 hover:text-sky-600 rounded-md cursor-pointer"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteGallery(item._id)}
                          className="p-1.5 text-slate-600 hover:text-rose-600 rounded-md cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: NOTICES & ANNOUNCEMENTS */}
          {activeTab === 'notices' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <p className="text-sm text-slate-500">
                  Broadcast health camps, holiday schedules, and emergency updates to the public homepage banner.
                </p>
                <button
                  onClick={() => handleOpenNoticeModal()}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-sm font-semibold shadow-sm cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> New Announcement
                </button>
              </div>

              <div className="space-y-4">
                {notices.map((n) => (
                  <div
                    key={n._id || n.id}
                    className={`p-6 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                      n.isActive ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-100/70 border-slate-200 opacity-60'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-sky-100 text-sky-800">
                          {n.type}
                        </span>
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${n.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'}`}>
                          {n.isActive ? '● Live on Site' : 'Inactive'}
                        </span>
                        <h4 className="font-bold text-slate-800 text-base">{n.title}</h4>
                      </div>
                      <p className="text-slate-600 text-sm">{n.content}</p>
                      {n.link && <p className="text-xs text-sky-600">Link: {n.link}</p>}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleOpenNoticeModal(n)}
                        className="p-2 text-slate-600 hover:text-sky-600 hover:bg-sky-50 rounded-lg cursor-pointer"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteNotice(n._id)}
                        className="p-2 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: BOOKINGS MANAGER */}
          {activeTab === 'bookings' && (
            <div className="space-y-6">
              <p className="text-sm text-slate-500">
                Patient bookings forwarded through our middleman gateway. Manage status and check requested tests.
              </p>

              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-100">
                      <tr>
                        <th className="px-6 py-4">Patient & Phone</th>
                        <th className="px-6 py-4">Type</th>
                        <th className="px-6 py-4">Appointment Date/Slot</th>
                        <th className="px-6 py-4">Doctor / Address / Tests</th>
                        <th className="px-6 py-4">LIS Ref</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {bookings.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-6 py-10 text-center text-slate-400">
                            No patient bookings registered yet.
                          </td>
                        </tr>
                      ) : (
                        bookings.map((b) => (
                          <tr key={b._id} className="hover:bg-slate-50/50">
                            <td className="px-6 py-4">
                              <p className="font-bold text-slate-800">{b.patientName}</p>
                              <a href={`tel:${b.phone}`} className="text-xs text-sky-600 hover:underline">
                                {b.phone}
                              </a>
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                                  b.type === 'sample_collection'
                                    ? 'bg-purple-100 text-purple-700'
                                    : 'bg-blue-100 text-blue-700'
                                }`}
                              >
                                {b.type === 'sample_collection' ? 'Home Pickup' : 'Consultation'}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-xs text-slate-600">
                              <p className="font-medium text-slate-800">
                                {new Date(b.preferredDate).toLocaleDateString('en-IN')}
                              </p>
                              <p className="text-slate-400">{b.preferredTimeSlot}</p>
                            </td>
                            <td className="px-6 py-4 text-xs text-slate-600 max-w-xs">
                              {b.doctorName && <p><strong>Doctor:</strong> {b.doctorName}</p>}
                              {b.address && <p><strong>Address:</strong> {b.address}</p>}
                              {Array.isArray(b.testsRequested) && b.testsRequested.length > 0 && (
                                <p className="truncate text-slate-500">
                                  <strong>Tests:</strong> {b.testsRequested.join(', ')}
                                </p>
                              )}
                            </td>
                            <td className="px-6 py-4 text-xs font-mono text-slate-500">
                              {b.lisReferenceId || 'Pending'}
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                                  b.status === 'confirmed'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : b.status === 'completed'
                                    ? 'bg-sky-100 text-sky-800'
                                    : 'bg-amber-100 text-amber-800'
                                }`}
                              >
                                {b.status || 'pending'}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <select
                                value={b.status || 'pending'}
                                onChange={(e) => handleUpdateBookingStatus(b._id, e.target.value)}
                                className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 outline-none font-medium cursor-pointer"
                              >
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirm</option>
                                <option value="completed">Complete</option>
                                <option value="cancelled">Cancel</option>
                              </select>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: TESTS & PRICING CATALOG */}
          {activeTab === 'tests' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <p className="text-sm text-slate-500">
                  Tests synced every 24h from the Main LIS Server. You can override prices or register new clinical tests here.
                </p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleTriggerSync}
                    disabled={syncing}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
                    Sync from Main Server
                  </button>
                  <button
                    onClick={() => handleOpenTestModal()}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-sm font-semibold shadow-sm cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Add Test
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-100">
                      <tr>
                        <th className="px-6 py-4">Test Code</th>
                        <th className="px-6 py-4">Name</th>
                        <th className="px-6 py-4">Category</th>
                        <th className="px-6 py-4">Price (₹)</th>
                        <th className="px-6 py-4">Turnaround</th>
                        <th className="px-6 py-4">Sample Type</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {tests.map((t) => (
                        <tr key={t.id || t._id} className="hover:bg-slate-50/50">
                          <td className="px-6 py-4 font-mono text-xs text-slate-500">{t.testCode || t.id}</td>
                          <td className="px-6 py-4 font-bold text-slate-800">{t.name}</td>
                          <td className="px-6 py-4">
                            <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                              {t.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-bold text-sky-600">₹{t.price}</td>
                          <td className="px-6 py-4 text-xs text-slate-500">{t.turnaround}</td>
                          <td className="px-6 py-4 text-xs text-slate-500">{t.sampleType || 'Blood'}</td>
                          <td className="px-6 py-4 text-right space-x-2">
                            <button
                              onClick={() => handleOpenTestModal(t)}
                              className="p-1.5 text-slate-600 hover:text-sky-600 rounded cursor-pointer"
                            >
                              <Edit className="w-4 h-4 inline" />
                            </button>
                            <button
                              onClick={() => handleDeleteTest(t._id || t.id)}
                              className="p-1.5 text-slate-600 hover:text-rose-600 rounded cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4 inline" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: SECURITY & MASTER PASSWORD */}
          {activeTab === 'settings' && (
            <div className="max-w-xl space-y-8">
              <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg">Change Master Admin Password</h3>
                    <p className="text-slate-500 text-xs">
                      Updates the single administrator password in the database directly.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      required
                      placeholder="Enter current password..."
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-sky-100 focus:border-sky-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      New Password (Min 6 Characters)
                    </label>
                    <input
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      required
                      placeholder="Enter new master password..."
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-sky-100 focus:border-sky-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      required
                      placeholder="Repeat new master password..."
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-sky-100 focus:border-sky-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl text-sm transition-colors shadow-sm cursor-pointer"
                  >
                    Save New Master Password
                  </button>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ─── MODAL: DOCTOR ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {doctorModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm p-4 flex items-center justify-center overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative my-8"
            >
              <button
                onClick={() => setDoctorModalOpen(false)}
                className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-xl font-bold text-slate-800 mb-4">
                {editingDoctor ? 'Edit Doctor Profile' : 'Register New Doctor'}
              </h3>

              <form onSubmit={handleSaveDoctor} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Doctor Name *</label>
                    <input
                      type="text"
                      value={doctorForm.name}
                      onChange={(e) => setDoctorForm({ ...doctorForm, name: e.target.value })}
                      required
                      placeholder="e.g. Dr. D. A. Khan"
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Specialization *</label>
                    <input
                      type="text"
                      value={doctorForm.specialization}
                      onChange={(e) => setDoctorForm({ ...doctorForm, specialization: e.target.value })}
                      required
                      placeholder="e.g. Pediatrics & Child Health"
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Qualification *</label>
                    <input
                      type="text"
                      value={doctorForm.qualification}
                      onChange={(e) => setDoctorForm({ ...doctorForm, qualification: e.target.value })}
                      required
                      placeholder="e.g. MBBS, MD"
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Experience</label>
                    <input
                      type="text"
                      value={doctorForm.experience}
                      onChange={(e) => setDoctorForm({ ...doctorForm, experience: e.target.value })}
                      placeholder="e.g. 15+ Years"
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Upload Photo via Cloudinary (File Picker)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setDoctorForm({ ...doctorForm, imageFile: e.target.files[0] })}
                    className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">Or paste direct image URL below if preferred:</p>
                  <input
                    type="url"
                    value={doctorForm.imageUrl}
                    onChange={(e) => setDoctorForm({ ...doctorForm, imageUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs mt-1"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">OPD Schedule (JSON or text)</label>
                  <textarea
                    rows={3}
                    value={doctorForm.schedule}
                    onChange={(e) => setDoctorForm({ ...doctorForm, schedule: e.target.value })}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-mono"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setDoctorModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold cursor-pointer"
                  >
                    Save Doctor
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── MODAL: GALLERY ────────────────────────────────────────────────── */}
      <AnimatePresence>
        {galleryModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm p-4 flex items-center justify-center overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative my-8"
            >
              <button
                onClick={() => setGalleryModalOpen(false)}
                className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-xl font-bold text-slate-800 mb-4">
                {editingGallery ? 'Edit Gallery Item' : 'Upload to Gallery'}
              </h3>

              <form onSubmit={handleSaveGallery} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Title *</label>
                  <input
                    type="text"
                    value={galleryForm.title}
                    onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })}
                    required
                    placeholder="e.g. Modern USG Scanner Room"
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={galleryForm.category}
                    onChange={(e) => setGalleryForm({ ...galleryForm, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm bg-white"
                  >
                    <option value="Facilities">Facilities & Lounge</option>
                    <option value="Equipment">Equipment & Lab</option>
                    <option value="Doctors">Doctors & Specialists</option>
                    <option value="Events & Camps">Events & Health Camps</option>
                    <option value="General">General</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Upload Photo via Cloudinary (File Picker)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setGalleryForm({ ...galleryForm, imageFile: e.target.files[0] })}
                    className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    YouTube Video URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={galleryForm.youtubeUrl}
                    onChange={(e) => setGalleryForm({ ...galleryForm, youtubeUrl: e.target.value })}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Allows patients to watch video tours or doctor health advisories directly in the gallery.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={galleryForm.description}
                    onChange={(e) => setGalleryForm({ ...galleryForm, description: e.target.value })}
                    placeholder="Short description of facility or medical team..."
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setGalleryModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold cursor-pointer"
                  >
                    Upload Media
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── MODAL: NOTICE ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {noticeModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm p-4 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative"
            >
              <button
                onClick={() => setNoticeModalOpen(false)}
                className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-xl font-bold text-slate-800 mb-4">
                {editingNotice ? 'Edit Announcement' : 'Publish Announcement'}
              </h3>

              <form onSubmit={handleSaveNotice} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Notice Headline *</label>
                  <input
                    type="text"
                    value={noticeForm.title}
                    onChange={(e) => setNoticeForm({ ...noticeForm, title: e.target.value })}
                    required
                    placeholder="e.g. Free Health Camp this Sunday"
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Announcement Details *</label>
                  <textarea
                    rows={3}
                    value={noticeForm.content}
                    onChange={(e) => setNoticeForm({ ...noticeForm, content: e.target.value })}
                    required
                    placeholder="Enter details visible on the top banner and noticeboard..."
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Badge Type</label>
                    <select
                      value={noticeForm.type}
                      onChange={(e) => setNoticeForm({ ...noticeForm, type: e.target.value })}
                      className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs bg-white"
                    >
                      <option value="camp">Health Camp</option>
                      <option value="info">General Info</option>
                      <option value="alert">Important Alert</option>
                      <option value="holiday">Holiday Schedule</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Display Status</label>
                    <select
                      value={noticeForm.isActive ? 'true' : 'false'}
                      onChange={(e) => setNoticeForm({ ...noticeForm, isActive: e.target.value === 'true' })}
                      className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs bg-white"
                    >
                      <option value="true">Live Banner (Active)</option>
                      <option value="false">Draft (Hidden)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Action Link (Optional)</label>
                  <input
                    type="text"
                    value={noticeForm.link}
                    onChange={(e) => setNoticeForm({ ...noticeForm, link: e.target.value })}
                    placeholder="/contact or /book-collection"
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setNoticeModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold cursor-pointer"
                  >
                    Publish
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── MODAL: TEST & PRICE ───────────────────────────────────────────── */}
      <AnimatePresence>
        {testModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm p-4 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative"
            >
              <button
                onClick={() => setTestModalOpen(false)}
                className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-xl font-bold text-slate-800 mb-4">
                {editingTest ? 'Adjust Test Pricing' : 'Add Test Item'}
              </h3>

              <form onSubmit={handleSaveTest} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Test Name *</label>
                  <input
                    type="text"
                    value={testForm.name}
                    onChange={(e) => setTestForm({ ...testForm, name: e.target.value })}
                    required
                    placeholder="e.g. Complete Blood Count (CBC)"
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Category *</label>
                    <input
                      type="text"
                      value={testForm.category}
                      onChange={(e) => setTestForm({ ...testForm, category: e.target.value })}
                      required
                      placeholder="e.g. Pathology"
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Price (₹) *</label>
                    <input
                      type="number"
                      value={testForm.price}
                      onChange={(e) => setTestForm({ ...testForm, price: e.target.value })}
                      required
                      placeholder="e.g. 250"
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Turnaround</label>
                    <input
                      type="text"
                      value={testForm.turnaround}
                      onChange={(e) => setTestForm({ ...testForm, turnaround: e.target.value })}
                      placeholder="e.g. 4-6 hours"
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Sample Type</label>
                    <input
                      type="text"
                      value={testForm.sampleType}
                      onChange={(e) => setTestForm({ ...testForm, sampleType: e.target.value })}
                      placeholder="e.g. Blood / Urine"
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setTestModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold cursor-pointer"
                  >
                    Save Test
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </PageTransition>
  )
}

