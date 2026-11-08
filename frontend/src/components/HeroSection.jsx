import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CalendarDays,
  ArrowRight,
  ShieldCheck,
  Clock,
  Activity,
  Phone,
  CheckCircle2,
  Stethoscope,
  Microscope,
  Award,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Flame,
  Wind,
  HeartPulse,
  Building2,
  Check,
  Star,
  Zap,
} from 'lucide-react'

// Institutional affiliations from the official flyers
const INSTITUTES = [
  { name: 'AIIMS New Delhi', badge: 'Orthopedic Surgery' },
  { name: 'Manipal Hospitals', badge: 'Cardiothoracic Surgery' },
  { name: 'AIIMS Bhubaneswar', badge: 'Neurology' },
  { name: 'PGIMER Chandigarh', badge: 'Pediatrics' },
  { name: 'SSKM Hospital / IPGMER', badge: 'Neuropsychiatry & Medicine' },
  { name: 'BHU Varanasi', badge: 'Surgical Gastroenterology' },
  { name: 'MRCOG London', badge: 'Obstetrics & Gynecology' },
  { name: 'Desun Hospital Kolkata', badge: 'Head & Neck Oncosurgery' },
  { name: 'NIMHANS Bangalore', badge: 'Senior Neurology' },
  { name: 'Midnapore Medical College', badge: 'Clinical Medicine' },
  { name: 'Asian Institute of Gastroenterology', badge: 'GI & Hepatology' },
]

const ROTATING_SPECIALTIES = [
  { title: 'Cardiothoracic & Vascular Surgery', doctor: 'Dr. Niket Arora (Manipal Hospitals)', color: 'text-rose-300' },
  { title: 'Orthopedics & Spine Trauma', doctor: 'Dr. S. K. Das (AIIMS New Delhi)', color: 'text-amber-300' },
  { title: 'Advanced GI & Hepatology', doctor: 'Dr. Panchanan Panigrahi (BHU)', color: 'text-emerald-300' },
  { title: 'Obstetrics, High-Risk Pregnancy', doctor: 'Dr. Ayesha Sultana (MRCOG London)', color: 'text-pink-300' },
  { title: 'Neurology & Neuro-Diagnostics', doctor: 'Dr. Archisman Haldar (AIIMS)', color: 'text-cyan-300' },
  { title: 'Head & Neck Oncosurgery', doctor: 'Dr. Samujjwal Das (Desun Hospital)', color: 'text-indigo-300' },
  { title: 'Neuropsychiatry & Behavioral Health', doctor: 'Dr. Konika Das (SSKM Hospital)', color: 'text-purple-300' },
  { title: 'General & Laparoscopic Surgery', doctor: 'Dr. Biswajit Panda (MS Laparoscopic)', color: 'text-sky-300' },
]

const SPOTLIGHT_DOCTORS = [
  {
    name: 'Dr. S. K. Das',
    spec: 'Orthopedics & Joint Surgery',
    degree: 'MS (Ortho), (AIIMS) New Delhi',
    focus: 'Arthroscopy, Micro Surgery, Trauma & Spine Surgery',
    image: '/images/doctors/dr-sk-das.jpg',
    tag: 'AIIMS New Delhi',
    tagColor: 'bg-amber-500/20 text-amber-200 border-amber-400/30',
  },
  {
    name: 'Dr. Niket Arora',
    spec: 'Cardiothoracic & Vascular Surgery',
    degree: 'MBBS, DNB (Cardio Thoracic Surgery)',
    focus: 'Heart & Vascular Surgery, Member EACTS & IACTS',
    image: '/images/doctors/dr-niket-arora.jpg',
    tag: 'Manipal Hospitals',
    tagColor: 'bg-rose-500/20 text-rose-200 border-rose-400/30',
  },
  {
    name: 'Dr. Panchanan Panigrahi',
    spec: 'Surgical Gastroenterology & GI Surgery',
    degree: 'MCH Surgical Gastroenterology (BHU), FIAGES',
    focus: 'Advanced Endo, Laser, Laparoscopic & GI Surgery',
    image: '/images/doctors/dr-panchanan-panigrahi.jpg',
    tag: 'BHU Varanasi',
    tagColor: 'bg-emerald-500/20 text-emerald-200 border-emerald-400/30',
  },
  {
    name: 'Dr. Ayesha Sultana',
    spec: 'Gynecology & Obstetrics',
    degree: 'MBBS, MS (G&O), DNB, MRCOG (London)',
    focus: 'High-Risk Pregnancy, Menstrual Care & Women’s Health',
    image: '/images/doctors/dr-ayesha-sultana.jpg',
    tag: 'MRCOG London',
    tagColor: 'bg-pink-500/20 text-pink-200 border-pink-400/30',
  },
  {
    name: 'Dr. Archisman Haldar',
    spec: 'Neurology & Brain Care',
    degree: 'MBBS (AIIMS), MD (AIIMS Delhi), DM (AIIMS)',
    focus: 'Seizures, Epilepsy, Stroke, Migraines & Neuropathies',
    image: '/images/doctors/dr-archisman-haldar.jpg',
    tag: 'AIIMS Delhi / BBSR',
    tagColor: 'bg-cyan-500/20 text-cyan-200 border-cyan-400/30',
  },
  {
    name: 'Dr. Samujjwal Das',
    spec: 'Head & Neck Oncosurgery',
    degree: 'MBBS, MDS (Oral & Maxillofacial Surgery)',
    focus: 'Oral, Facial, Mouth & Neck Tumor Treatment',
    image: '/images/doctors/dr-samujjwal-das.jpg',
    tag: 'Desun Hospital',
    tagColor: 'bg-indigo-500/20 text-indigo-200 border-indigo-400/30',
  },
  {
    name: 'Dr. Biswajit Panda',
    spec: 'General & Laparoscopic Surgery',
    degree: 'MBBS, MS (General Laparoscopic Surgeon)',
    focus: 'Hernia, Gallbladder Stones & Minimally Invasive Surgery',
    image: '/images/doctors/dr-biswajit-panda.jpg',
    tag: 'Laparoscopic OT',
    tagColor: 'bg-sky-500/20 text-sky-200 border-sky-400/30',
  },
]

const LAB_CAPABILITIES = [
  { name: 'Hematology AutoQuant', status: 'Active 24/7', load: 98, color: 'emerald' },
  { name: 'Computerized 12-Lead ECG', status: 'Instant Report', load: 100, color: 'sky' },
  { name: 'Digital EEG & NCV Testing', status: 'Ready on Demand', load: 92, color: 'indigo' },
  { name: '24-Hour Holter Monitoring', status: 'Ambulatory Active', load: 95, color: 'purple' },
  { name: 'Upper GI Video Endoscopy', status: 'Procedure Bay Ready', load: 90, color: 'amber' },
  { name: 'Emergency Oxygen Cylinders', status: 'Available in Stock', load: 100, color: 'emerald' },
]

const QUICK_PACKAGES = [
  { name: 'Health Checkup', count: '47 Tests', price: '₹1,350', old: '₹2,200', tag: 'Most Popular', color: 'sky' },
  { name: 'Advanced Health Checkup', count: '12 Tests', price: '₹1,999', old: '₹3,200', tag: 'Full Body', color: 'emerald' },
  { name: 'Diabetic Profile', count: '59 Tests', price: '₹2,999', old: '₹4,500', tag: 'Specialist Care', color: 'purple' },
  { name: 'Cancer Marker Profile', count: '7 Tests', price: '₹2,999', old: '₹5,000', tag: 'Biomarkers', color: 'rose' },
]

export default function HeroSection() {
  const [specialtyIdx, setSpecialtyIdx] = useState(0)
  const [activeTab, setActiveTab] = useState('doctors') // 'doctors' | 'lab' | 'packages'
  const [doctorIdx, setDoctorIdx] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  // Rotating specialty words every 3.5s
  useEffect(() => {
    const timer = setInterval(() => {
      setSpecialtyIdx((prev) => (prev + 1) % ROTATING_SPECIALTIES.length)
    }, 3500)
    return () => clearInterval(timer)
  }, [])

  // Auto-cycling spotlight doctors if not hovered/paused
  useEffect(() => {
    if (activeTab !== 'doctors' || isPaused) return
    const timer = setInterval(() => {
      setDoctorIdx((prev) => (prev + 1) % SPOTLIGHT_DOCTORS.length)
    }, 4500)
    return () => clearInterval(timer)
  }, [activeTab, isPaused])

  const curSpec = ROTATING_SPECIALTIES[specialtyIdx]
  const curDoctor = SPOTLIGHT_DOCTORS[doctorIdx]

  return (
    <section className="relative bg-gradient-to-br from-slate-950 via-sky-950 to-slate-900 text-white overflow-hidden min-h-screen flex flex-col justify-between pt-32 sm:pt-36 md:pt-40 lg:pt-44 pb-12">
      {/* Background Animated Gradients & Mesh */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-sky-500/15 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute top-1/3 -right-32 w-[550px] h-[550px] bg-cyan-500/15 rounded-full blur-[130px]" />
        <div className="absolute -bottom-32 left-1/3 w-[650px] h-[650px] bg-indigo-500/15 rounded-full blur-[150px]" />
        
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #38bdf8 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* SVG Animated Heartbeat / ECG Line across the background */}
      <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 opacity-[0.08] pointer-events-none select-none overflow-hidden">
        <svg viewBox="0 0 1200 120" className="w-full h-28" preserveAspectRatio="none">
          <path
            d="M 0,60 L 200,60 L 220,20 L 240,100 L 260,30 L 280,75 L 300,60 L 500,60 L 520,10 L 540,110 L 560,20 L 580,80 L 600,60 L 800,60 L 820,20 L 840,100 L 860,30 L 880,75 L 900,60 L 1200,60"
            fill="none"
            stroke="url(#ecgGradient)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="ecgGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="50%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#818cf8" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Main Container */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headlines & Action Matrix */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            
            {/* Accreditation & Location Pills */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-wrap items-center gap-2.5 mb-5 select-none"
            >
              <div className="inline-flex items-center gap-2 bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-bold px-3.5 py-1.5 rounded-full backdrop-blur-md shadow-sm">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
                NABL M(EL)T Accredited & ISO 9001:2015
              </div>
              <div className="inline-flex items-center gap-1.5 bg-sky-500/15 border border-sky-400/30 text-sky-200 text-xs font-semibold px-3 py-1.5 rounded-full backdrop-blur-md">
                <Building2 size={13} className="text-sky-400" />
                Keranitola, Midnapore Town (721101)
              </div>
              <div className="hidden sm:inline-flex items-center gap-1 bg-amber-500/15 border border-amber-400/30 text-amber-200 text-xs font-bold px-3 py-1.5 rounded-full">
                <Star size={13} className="text-amber-400 fill-amber-400" />
                4.9★ (163+ Reviews)
              </div>
            </motion.div>

            {/* Main Headline with Bengali Accent */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black font-nunito tracking-tight leading-[1.12] mb-4">
                Premier Specialists.
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-cyan-200 to-emerald-300">
                  NABL Certified
                </span>
                Diagnostics In Midnapore.
              </h1>

              {/* Bengali Official Title */}
              <p className="text-slate-300 text-sm font-medium tracking-wide mb-5 flex items-center gap-2">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400" />
                নিউ লাইফ কেয়ার ডায়াগনস্টিক সেন্টার — নির্ভুল রিপোর্ট ও অভিজ্ঞ বিশেষজ্ঞ চিকিৎসক
              </p>
            </motion.div>

            {/* Rotating Specialty Highlight Banner */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 backdrop-blur-xl mb-6 relative overflow-hidden group hover:border-sky-500/40 transition-colors"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-cyan-600 flex items-center justify-center shrink-0 shadow-lg shadow-sky-500/20">
                    <Stethoscope size={20} className="text-white" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-sky-400 uppercase tracking-wider block">
                      Live Specialist Chamber
                    </span>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={curSpec.title}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                      >
                        <p className={`text-base sm:text-lg font-bold font-nunito leading-tight ${curSpec.color}`}>
                          {curSpec.title}
                        </p>
                        <p className="text-xs text-slate-300 mt-0.5">
                          {curSpec.doctor}
                        </p>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>

                <Link
                  to="/doctors"
                  className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-cyan-300 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-2 rounded-xl transition-all border border-white/10"
                >
                  All 19 Doctors <ArrowRight size={13} />
                </Link>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap items-center gap-3.5 mb-8"
            >
              <Link
                to="/book-consultation"
                className="group relative inline-flex items-center gap-2.5 bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 text-white font-bold text-sm sm:text-base px-6 py-3.5 rounded-2xl shadow-xl shadow-sky-500/25 hover:shadow-sky-500/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <CalendarDays size={18} />
                <span>Book Doctor Appointment</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/book-collection"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-sm sm:text-base px-5 py-3.5 rounded-2xl backdrop-blur-md transition-all hover:border-white/30"
              >
                <Activity size={18} className="text-emerald-400" />
                <span>24/7 Home Sample Collection</span>
              </Link>
            </motion.div>

            {/* Trust Points Matrix */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/10"
            >
              {[
                { label: 'Blood, Urine, Stool, Semen', sub: 'Complete Pathology' },
                { label: 'EEG & NCV Testing', sub: 'Neurological Lab' },
                { label: '24-Hr Holter & ECG', sub: 'Cardiology Care' },
                { label: 'Oxygen Cylinders', sub: 'Available 24x7' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <CheckCircle2 size={15} className="text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-slate-100 leading-tight">{item.label}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{item.sub}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Column: Multi-View Interactive Showcase Card */}
          <div className="lg:col-span-5 flex justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: 40 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="w-full max-w-lg bg-gradient-to-b from-white/15 to-white/5 border border-white/20 rounded-3xl p-5 sm:p-6 backdrop-blur-2xl shadow-2xl relative"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {/* Card Header & Tabs */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
                <div className="flex items-center gap-1.5 p-1 bg-black/30 rounded-xl border border-white/10">
                  <button
                    onClick={() => setActiveTab('doctors')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      activeTab === 'doctors'
                        ? 'bg-sky-500 text-white shadow-md'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    Doctors
                  </button>
                  <button
                    onClick={() => setActiveTab('lab')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      activeTab === 'lab'
                        ? 'bg-sky-500 text-white shadow-md'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    Lab & OT
                  </button>
                  <button
                    onClick={() => setActiveTab('packages')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      activeTab === 'packages'
                        ? 'bg-sky-500 text-white shadow-md'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    Packages
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <span className="flex h-2.5 w-2.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                  </span>
                  <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider">
                    Open Now
                  </span>
                </div>
              </div>

              {/* Tab 1: Doctors Spotlight */}
              {activeTab === 'doctors' && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-sky-300 font-bold uppercase tracking-wider flex items-center gap-1">
                      <Sparkles size={13} />
                      Featured Specialist ({doctorIdx + 1}/{SPOTLIGHT_DOCTORS.length})
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() =>
                          setDoctorIdx((prev) => (prev === 0 ? SPOTLIGHT_DOCTORS.length - 1 : prev - 1))
                        }
                        className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
                        aria-label="Previous doctor"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <button
                        onClick={() =>
                          setDoctorIdx((prev) => (prev + 1) % SPOTLIGHT_DOCTORS.length)
                        }
                        className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
                        aria-label="Next doctor"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={curDoctor.name}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      className="bg-slate-900/60 border border-white/15 rounded-2xl p-4 relative overflow-hidden"
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative shrink-0">
                          <img
                            src={curDoctor.image}
                            alt={curDoctor.name}
                            className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-white/30 shadow-lg"
                          />
                          <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-1 shadow-md">
                            <Check size={12} strokeWidth={3} />
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <span
                            className={`inline-block text-[10px] font-extrabold px-2 py-0.5 rounded-full border mb-1.5 ${curDoctor.tagColor}`}
                          >
                            {curDoctor.tag}
                          </span>
                          <h3 className="text-base sm:text-lg font-bold text-white truncate">
                            {curDoctor.name}
                          </h3>
                          <p className="text-xs text-cyan-300 font-semibold truncate">
                            {curDoctor.spec}
                          </p>
                          <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                            {curDoctor.degree}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t border-white/10">
                        <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                          🎯 {curDoctor.focus}
                        </p>
                      </div>

                      <div className="mt-4 flex items-center gap-2">
                        <Link
                          to={`/book-consultation?doctor=${encodeURIComponent(curDoctor.name)}&department=${encodeURIComponent(curDoctor.spec)}`}
                          className="flex-1 text-center py-2.5 bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
                        >
                          <CalendarDays size={14} />
                          <span>Book Consultation</span>
                        </Link>
                        <Link
                          to="/doctors"
                          className="px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl transition-all"
                        >
                          View Bio
                        </Link>
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  {/* Doctor Thumbnail Nav */}
                  <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1 scrollbar-none">
                    {SPOTLIGHT_DOCTORS.map((doc, idx) => (
                      <button
                        key={doc.name}
                        onClick={() => setDoctorIdx(idx)}
                        className={`relative w-9 h-9 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                          idx === doctorIdx
                            ? 'border-sky-400 scale-105 shadow-md shadow-sky-400/30'
                            : 'border-white/20 opacity-60 hover:opacity-100'
                        }`}
                        title={doc.name}
                      >
                        <img src={doc.image} alt={doc.name} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 2: Lab & Testing Equipment */}
              {activeTab === 'lab' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative rounded-2xl overflow-hidden mb-4 border border-white/20 h-36">
                    <img
                      src="/images/lab-interior-ncv-eeg.jpg"
                      alt="NABL Accredited Pathology Laboratory Floor"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex items-end p-3.5">
                      <div>
                        <span className="text-[10px] font-extrabold bg-sky-500 text-white px-2 py-0.5 rounded-full uppercase">
                          NABL M(EL)T Certified
                        </span>
                        <p className="text-sm font-bold text-white mt-1">
                          Automated Biochemistry & Neurological Lab Setup
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {LAB_CAPABILITIES.map((cap) => (
                      <div
                        key={cap.name}
                        className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full bg-${cap.color}-400`} />
                          <span className="text-slate-200 font-semibold">{cap.name}</span>
                        </div>
                        <span className="text-[11px] font-bold text-cyan-300">{cap.status}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Tab 3: Diagnostic Packages */}
              {activeTab === 'packages' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-2.5"
                >
                  {QUICK_PACKAGES.map((pkg) => (
                    <div
                      key={pkg.name}
                      className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl p-3 hover:border-sky-400/40 transition-all"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-xs sm:text-sm">{pkg.name}</span>
                          <span className="text-[10px] font-bold bg-white/10 text-cyan-300 px-2 py-0.5 rounded-md">
                            {pkg.count}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400">{pkg.tag}</span>
                      </div>

                      <div className="text-right">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-slate-400 line-through text-[11px]">{pkg.old}</span>
                          <span className="text-sm sm:text-base font-extrabold text-emerald-400">{pkg.price}</span>
                        </div>
                        <Link
                          to="/book-collection"
                          className="inline-block text-[10px] font-bold text-sky-400 hover:text-sky-300 underline mt-0.5"
                        >
                          Book Home Pickup →
                        </Link>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}

              {/* Emergency Hotline Banner inside Card */}
              <div className="mt-4 pt-3.5 border-t border-white/10 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
                    <Phone size={14} />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block leading-tight">24/7 Helpline</span>
                    <a href="tel:09733525031" className="text-white font-bold hover:text-sky-300 transition-colors">
                      097335 25031 / 9647393949
                    </a>
                  </div>
                </div>

                <a
                  href="https://wa.me/919733525031"
                  target="_blank"
                  rel="noreferrer"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] px-3 py-1.5 rounded-xl transition-all shadow-md flex items-center gap-1"
                >
                  <span>WhatsApp</span>
                  <ArrowRight size={12} />
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Infinite Animated Marquee of Hospital & Clinic Affiliations */}
      <div className="relative border-t border-white/10 bg-slate-950/70 backdrop-blur-md py-3.5 select-none overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 mb-1.5 flex items-center justify-between text-[11px] font-bold text-sky-300 uppercase tracking-widest">
          <span className="flex items-center gap-1.5">
            <Award size={13} className="text-amber-400" />
            Specialists Affiliated With Renowned Hospitals & Institutes
          </span>
          <span className="hidden sm:inline-block text-slate-400 font-normal">
            New Life Care Diagnostic Centre • Midnapore Town
          </span>
        </div>

        {/* Marquee Track */}
        <div className="flex overflow-hidden relative">
          <motion.div
            animate={{ x: ['0%', '-50%'] }}
            transition={{ repeat: Infinity, duration: 25, ease: 'linear' }}
            className="flex items-center gap-6 whitespace-nowrap shrink-0"
          >
            {[...INSTITUTES, ...INSTITUTES].map((inst, i) => (
              <div
                key={i}
                className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-200 hover:border-sky-400/50 transition-colors"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span className="text-white font-bold">{inst.name}</span>
                <span className="text-slate-400 text-[10px]">({inst.badge})</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

