import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import {
  FlaskConical,
  Scan,
  Activity,
  Heart,
  Wind,
  Clock,
  CheckCircle2,
  Star,
  MapPin,
  Phone,
  ArrowRight,
  Home,
  ShieldCheck,
  Users,
  Trophy,
  Microscope,
  Stethoscope,
  CalendarDays,
  BookOpen,
  Megaphone,
  AlertTriangle,
  Bell,
} from 'lucide-react'
import PageTransition from '../components/PageTransition'
import HeroSection from '../components/HeroSection'
import { getActiveNotices, getDoctors } from '../services/api'

// ─── Data ──────────────────────────────────────────────────────────────────────

const stats = [
  { icon: Star, value: '163+', label: 'Google Reviews', color: 'text-amber-500' },
  { icon: Trophy, value: '4.9★', label: 'Average Rating', color: 'text-sky-500' },
  { icon: Clock, value: '24/7', label: 'Service Available', color: 'text-emerald-500' },
  { icon: ShieldCheck, value: 'NABL', label: 'Certified Centre', color: 'text-violet-500' },
]

const services = [
  {
    icon: FlaskConical,
    title: 'Advanced Pathology (NABL)',
    desc: 'Blood, Urine, Stool, Semen, Sputum testing with automated analyzers and NABL certified accuracy.',
    color: 'sky',
  },
  {
    icon: Scan,
    title: 'Digital X-Ray & ECG',
    desc: 'Instant digital radiography and computerized 12-lead ECG with priority reporting.',
    color: 'emerald',
  },
  {
    icon: Activity,
    title: 'Neurological EEG & NCV',
    desc: 'Advanced digital EEG and Nerve Conduction Velocity (NCV) electrophysiology testing.',
    color: 'indigo',
  },
  {
    icon: Heart,
    title: '24-Hour Holter Monitoring',
    desc: 'Continuous ambulatory ECG recording for arrhythmia detection and cardiac evaluation.',
    color: 'rose',
  },
  {
    icon: Wind,
    title: 'Endoscopy & PFT',
    desc: 'Upper GI video endoscopy and computerized Pulmonary Function Testing for respiratory health.',
    color: 'amber',
  },
  {
    icon: Home,
    title: '24/7 Home Collection & Oxygen',
    desc: 'Doorstep sample pickup across Midnapore town anytime. Emergency oxygen cylinders available.',
    color: 'emerald',
  },
]

const whyUs = [
  {
    icon: CheckCircle2,
    title: 'Accurate Reports',
    desc: 'NABL-accredited & ISO 9001:2015 certified laboratory with advanced automated analyzers.',
    color: 'sky',
  },
  {
    icon: Stethoscope,
    title: 'Expert Doctors',
    desc: 'Panel of 19 highly qualified specialists across AIIMS, PGIMER, BHU, SSKM, and Manipal Hospitals.',
    color: 'emerald',
  },
  {
    icon: Clock,
    title: '24/7 Available',
    desc: "Round-the-clock diagnostic support and doorstep sample collection whenever you need it.",
    color: 'sky',
  },
  {
    icon: Home,
    title: 'Home Collection',
    desc: 'Doorstep sample pickup anywhere in Midnapore town — book online or call 9733525031.',
    color: 'emerald',
  },
]

const fallbackHomeDoctors = [
  { name: 'Dr. S. K. Das', spec: 'Orthopedics & Joint Surgery', exp: '15+ yrs', days: 'Mon–Sat', initials: 'SD', color: 'blue', imageUrl: '/images/doctors/dr-sk-das.jpg' },
  { name: 'Dr. Niket Arora', spec: 'Cardiothoracic & Vascular Surgery', exp: '12+ yrs', days: 'Mon–Sat', initials: 'NA', color: 'red', imageUrl: '/images/doctors/dr-niket-arora.jpg' },
  { name: 'Dr. Panchanan Panigrahi', spec: 'Surgical Gastroenterology', exp: '14+ yrs', days: 'Mon–Sat', initials: 'PP', color: 'amber', imageUrl: '/images/doctors/dr-panchanan-panigrahi.jpg' },
  { name: 'Dr. Ayesha Sultana', spec: 'Gynecology & Obstetrics', exp: '12+ yrs', days: 'Mon–Sat', initials: 'AS', color: 'rose', imageUrl: '/images/doctors/dr-ayesha-sultana.jpg' },
  { name: 'Dr. Archisman Haldar', spec: 'Neurology (AIIMS)', exp: '10+ yrs', days: 'Mon–Sat', initials: 'AH', color: 'indigo', imageUrl: '/images/doctors/dr-archisman-haldar.jpg' },
  { name: 'Dr. Samujjwal Das', spec: 'Head & Neck Oncosurgery', exp: '10+ yrs', days: 'Mon–Sat', initials: 'SD', color: 'teal', imageUrl: '/images/doctors/dr-samujjwal-das.jpg' },
  { name: 'Dr. Biswajit Panda', spec: 'General & Laparoscopic Surgery', exp: '10+ yrs', days: 'Mon–Sat', initials: 'BP', color: 'sky', imageUrl: '/images/doctors/dr-biswajit-panda.jpg' },
  { name: 'Dr. Sudipto Sit', spec: 'General Medicine & Pain Management', exp: '10+ yrs', days: 'Mon–Sat', initials: 'SS', color: 'cyan', imageUrl: '/images/doctors/dr-sudipto-sit.jpg' },
]

const packages = [
  {
    name: 'Health Checkup (47 Tests)',
    price: '₹1,350',
    originalPrice: '₹2,200',
    color: 'sky',
    tests: [
      'Complete Blood Count (CBC)',
      'Liver Function Test (LFT)',
      'Kidney Function Test (KFT)',
      'Lipid Profile Screen',
      'Blood Sugar (Fasting)',
      'Urine Routine & Microscopy',
      'Serum Electrolytes',
      'ESR Assessment',
    ],
    popular: true,
  },
  {
    name: 'Advanced Health Checkup (12 Tests)',
    price: '₹1,999',
    originalPrice: '₹3,200',
    color: 'emerald',
    tests: [
      'CBC Complete Profiling',
      'Liver & Kidney Function Panels',
      'Complete Lipid Profile',
      'Thyroid Profile (TSH)',
      'HbA1c Glycated Hemoglobin',
      'Computerized 12-Lead ECG',
      'Digital Chest X-Ray',
      'Doctor Consultation Review',
    ],
    popular: false,
  },
  {
    name: 'Diabetic Profile (59 Tests)',
    price: '₹2,999',
    originalPrice: '₹4,500',
    color: 'purple',
    tests: [
      'Fasting & PP Blood Glucose',
      'HbA1c & Estimated Avg Glucose',
      'Complete Renal Function',
      'Cardiovascular Lipid Risk Panel',
      'Microalbuminuria Screen',
      'Electrolytes & Urine Chemistry',
      'Comprehensive Hematology',
      'Specialist Diabetic Guidance',
    ],
    popular: true,
  },
  {
    name: 'Cancer Marker Profile (7 Tests)',
    price: '₹2,999',
    originalPrice: '₹5,000',
    color: 'rose',
    tests: [
      'CEA (Carcinoembryonic Antigen)',
      'AFP (Alpha Fetoprotein)',
      'CA-125 (Ovarian Screen)',
      'PSA Total (Prostate Screen)',
      'CA 19-9 (Pancreatic / GI)',
      'Beta HCG Tumor Marker',
      'CBC with Peripheral Smear',
    ],
    popular: false,
  },
]

const reviews = [
  {
    name: 'Tapas Kumar',
    rating: 5,
    text: 'I got best service in NEW LIFE CARE DIAGNOSTIC LABORATORY.',
    date: 'Verified Patient',
    badge: 'Fast Testing',
  },
  {
    name: 'Subrata Maity',
    rating: 5,
    text: "The lab owner and all staff's are good.",
    date: 'Local Resident',
    badge: 'Courteous Staff',
  },
  {
    name: 'Anirban Roy',
    rating: 5,
    text: 'Very helpful people at night 9 pm they do our report .',
    date: 'Emergency Service',
    badge: 'Night Reporting',
  },
  {
    name: 'Arpita Mondal',
    rating: 5,
    text: 'Excellent service! Got my blood reports within hours. The staff is very courteous and the reports are extremely accurate. Highly recommended for anyone in Midnapore.',
    date: '2 weeks ago',
    badge: 'Accurate Reports',
  },
  {
    name: 'Sourav Ghosh',
    rating: 5,
    text: 'Best diagnostic centre in Midnapore. The home sample collection service is a lifesaver. The technician came on time and the reports were ready by afternoon.',
    date: '1 month ago',
    badge: 'Home Collection',
  },
  {
    name: 'Priya Dey',
    rating: 5,
    text: 'Very clean, hygienic facility with modern equipment. Dr. Ujjwal Kumar Bera and the consulting team are amazing. The USG and diagnostic facilities here are top-notch.',
    date: '3 weeks ago',
    badge: 'Top Specialists',
  },
]

const journalArticles = [
  {
    id: 1,
    title: 'Sanitizery Precautions',
    tag: 'Preventive Health',
    summary:
      'We can help stop the spread of COVID-19 and seasonal illnesses by washing our hands regularly with soap and water for 20 seconds – especially after going to public areas, before eating, and following clinical visits.',
    author: 'New Life Care Health Desk',
    readTime: '3 min read',
    iconColor: 'bg-emerald-50 text-emerald-600',
  },
  {
    id: 2,
    title: 'Cure For Viral Fever & Diagnosis',
    tag: 'Clinical Care',
    summary:
      'Most people have a standard body temperature of about 98.6°F (37°C). Anything a degree above this is considered a fever. Fevers are often a sign your body is fighting infection; timely CBC and dengue tests ensure accurate diagnosis.',
    author: 'Pathology Advisory',
    readTime: '4 min read',
    iconColor: 'bg-sky-50 text-sky-600',
  },
  {
    id: 3,
    title: 'Medicine Productions & Compassionate Healing',
    tag: 'Patient Experience',
    summary:
      'Modern healthcare merges cutting-edge laboratory accuracy with genuine warmth. Our nursing team and diagnostic specialists prioritize empathetic listening and personalized attention for every family.',
    author: 'Nursing Home Team',
    readTime: '3 min read',
    iconColor: 'bg-indigo-50 text-indigo-600',
  },
]

// ─── Animation Variants ───────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
}

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function HomePage() {
  const [notices, setNotices] = useState([])
  const [featuredDoctors, setFeaturedDoctors] = useState(fallbackHomeDoctors)

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const data = await getActiveNotices()
        if (Array.isArray(data)) {
          // Sort alerts first, then newest
          const sorted = [...data].sort((a, b) => {
            if (a.type === 'alert' && b.type !== 'alert') return -1
            if (b.type === 'alert' && a.type !== 'alert') return 1
            return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
          })
          setNotices(sorted)
        }
      } catch (_) {}
    }
    fetchNotices()
    const timer = setInterval(fetchNotices, 30000)

    // Fetch doctors dynamically
    getDoctors()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setFeaturedDoctors(data.slice(0, 8))
        }
      })
      .catch(() => {})

    return () => clearInterval(timer)
  }, [])

  return (
    <PageTransition>
      <Helmet>
        <title>New Life Care Diagnostic Centre | NABL Certified | Midnapore</title>
        <meta
          name="description"
          content="New Life Care Diagnostic Centre – Midnapore's best NABL-certified diagnostic centre offering Pathology, Digital X-Ray, USG, ECG, PFT and 24/7 home sample collection near Mahamaya Nursing Home."
        />
      </Helmet>

      {/* ── Advanced Animated Hero Section ─────────────────────────────────── */}
      <HeroSection />

      {/* ── Stats Bar ────────────────────────────────────────────────────────── */}
      <section className="py-10 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={fadeUp}
                className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 text-center hover:shadow-md transition-shadow"
              >
                <stat.icon size={28} className={`${stat.color} mx-auto mb-3`} />
                <p className="text-3xl font-bold font-nunito text-slate-800">{stat.value}</p>
                <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Live Announcements & Patient Alerts ─────────────────────────────── */}
      {notices.length > 0 && (
        <section className="py-8 bg-slate-50 border-b border-slate-200/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                    <Megaphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 font-nunito flex items-center gap-2">
                      Live Hospital Notices & Patient Alerts
                      <span className="text-xs bg-rose-100 text-rose-800 font-bold px-2.5 py-0.5 rounded-full">
                        {notices.length} Active
                      </span>
                    </h2>
                    <p className="text-xs text-slate-500">
                      Important health advisories, upcoming health camps, and emergency bulletins from New Life Care
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {notices.map((n) => {
                  const isAlert = n.type === 'alert'
                  return (
                    <div
                      key={n._id || n.id}
                      className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                        isAlert
                          ? 'bg-rose-50/80 border-rose-200 shadow-sm hover:shadow-md'
                          : n.type === 'camp'
                          ? 'bg-emerald-50/60 border-emerald-200 hover:shadow-sm'
                          : 'bg-slate-50 border-slate-200 hover:shadow-sm'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span
                            className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                              isAlert
                                ? 'bg-rose-600 text-white'
                                : n.type === 'camp'
                                ? 'bg-emerald-600 text-white'
                                : 'bg-sky-600 text-white'
                            }`}
                          >
                            {isAlert ? '🚨 Urgent Alert' : n.type || 'Notice'}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {n.createdAt
                              ? new Date(n.createdAt).toLocaleDateString('en-IN', {
                                  day: 'numeric',
                                  month: 'short',
                                })
                              : 'Live'}
                          </span>
                        </div>
                        <h3 className="font-bold text-slate-900 text-base mb-1.5">{n.title}</h3>
                        <p className="text-slate-600 text-sm leading-relaxed mb-4">{n.content}</p>
                      </div>

                      {n.link && (
                        <Link
                          to={n.link}
                          className={`inline-flex items-center gap-1.5 text-xs font-bold pt-3 border-t ${
                            isAlert
                              ? 'border-rose-200 text-rose-700 hover:text-rose-800'
                              : 'border-slate-200 text-sky-600 hover:text-sky-700'
                          }`}
                        >
                          <span>Learn More / Open</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Services ─────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="text-sky-600 font-semibold text-sm uppercase tracking-widest">What We Offer</span>
            <h2 className="text-3xl md:text-4xl font-bold font-nunito text-slate-800 mt-2 mb-4">
              Our Diagnostic Services
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto">
              Comprehensive diagnostic services under one roof with NABL-certified accuracy and fast turnaround times.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {services.map((svc) => (
              <motion.article
                key={svc.title}
                variants={fadeUp}
                whileHover={{ y: -4 }}
                className={`group bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:border-${svc.color}-200 transition-all duration-300`}
              >
                <div className={`inline-flex p-3 bg-${svc.color}-50 rounded-xl mb-4 group-hover:bg-${svc.color}-100 transition-colors`}>
                  <svc.icon size={24} className={`text-${svc.color}-500`} />
                </div>
                <h3 className="font-bold text-slate-800 text-lg mb-2">{svc.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{svc.desc}</p>
              </motion.article>
            ))}
          </motion.div>

          <div className="text-center mt-10">
            <Link
              to="/diagnostics"
              className="inline-flex items-center gap-2 text-sky-600 font-semibold hover:gap-3 transition-all"
            >
              View All Services & Pricing <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ────────────────────────────────────────────────────── */}
      <section className="py-20 bg-gradient-to-br from-sky-50 to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: visual */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-sky-500 to-cyan-600 rounded-3xl p-10 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="relative">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="bg-white/20 rounded-2xl p-4">
                      <Microscope size={36} className="text-white" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold font-nunito">NABL</p>
                      <p className="text-sky-200 text-sm">Accredited Laboratory</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: 'Tests Conducted', value: '50,000+' },
                      { label: 'Happy Patients', value: '10,000+' },
                      { label: 'Years of Service', value: '8+' },
                      { label: 'Expert Doctors', value: '14+' },
                    ].map((item) => (
                      <div key={item.label} className="bg-white/15 rounded-xl p-4">
                        <p className="text-2xl font-bold font-nunito">{item.value}</p>
                        <p className="text-sky-200 text-xs mt-1">{item.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right: points */}
            <div>
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="mb-10"
              >
                <span className="text-sky-600 font-semibold text-sm uppercase tracking-widest">Why Us</span>
                <h2 className="text-3xl md:text-4xl font-bold font-nunito text-slate-800 mt-2 mb-4">
                  Why Choose New Life Care?
                </h2>
                <p className="text-slate-500">
                  We combine advanced technology with compassionate care to deliver healthcare services that exceed your expectations.
                </p>
              </motion.div>

              <motion.div
                variants={stagger}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="space-y-5"
              >
                {whyUs.map((point) => (
                  <motion.div
                    key={point.title}
                    variants={fadeUp}
                    className="flex items-start gap-4"
                  >
                    <div className={`bg-${point.color}-100 p-3 rounded-xl shrink-0`}>
                      <point.icon size={22} className={`text-${point.color}-600`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800 mb-1">{point.title}</h3>
                      <p className="text-slate-500 text-sm">{point.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Doctors ──────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="text-sky-600 font-semibold text-sm uppercase tracking-widest">Our Panel</span>
            <h2 className="text-3xl md:text-4xl font-bold font-nunito text-slate-800 mt-2 mb-4">
              Expert Doctors
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              Board-certified specialists with years of experience dedicated to your health and well-being.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {featuredDoctors.map((doc) => {
              const initials =
                doc.initials ||
                doc.name
                  .replace(/^Dr\.\s*/i, '')
                  .split(' ')
                  .filter(Boolean)
                  .slice(0, 2)
                  .map((n) => n[0].toUpperCase())
                  .join('')
              const photo = doc.imageUrl || doc.image
              const spec = doc.spec || doc.specialization
              const exp = doc.exp || doc.experience || '10+ yrs'
              const days =
                doc.days ||
                (Array.isArray(doc.schedule) && doc.schedule[0]?.day
                  ? doc.schedule[0].day
                  : 'By Appointment')

              return (
                <motion.article
                  key={doc.name}
                  variants={fadeUp}
                  whileHover={{ y: -4 }}
                  className="bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-lg transition-all overflow-hidden text-center group flex flex-col justify-between"
                >
                  <div>
                    <div className="bg-slate-50 pt-7 pb-5 px-6 flex justify-center">
                      {photo ? (
                        <img
                          src={photo}
                          alt={doc.name}
                          className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md"
                        />
                      ) : (
                        <div
                          className="w-20 h-20 mx-auto rounded-full bg-sky-100 flex items-center justify-center text-sky-700 text-2xl font-bold font-nunito border-4 border-white shadow-md group-hover:bg-sky-200 transition-colors"
                        >
                          {initials}
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-slate-800 text-sm mb-1">{doc.name}</h3>
                      <p className="text-slate-500 text-xs mb-3 line-clamp-1">{spec}</p>
                      <div className="flex flex-col gap-2">
                        <span className="text-xs font-semibold text-sky-700 bg-sky-50 px-3 py-1 rounded-full">
                          {exp} Experience
                        </span>
                        <span className="text-xs text-slate-500">📅 {days}</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 pt-0">
                    <Link
                      to={`/book-consultation?doctor=${encodeURIComponent(doc.name)}&department=${encodeURIComponent(spec || '')}`}
                      className="block w-full py-2 bg-slate-50 hover:bg-sky-500 hover:text-white text-sky-600 text-xs font-bold rounded-xl border border-sky-100 transition-colors"
                    >
                      Book Consultation
                    </Link>
                  </div>
                </motion.article>
              )
            })}
          </motion.div>

          <div className="text-center mt-10">
            <Link
              to="/doctors"
              className="inline-flex items-center gap-2 bg-sky-50 text-sky-600 font-semibold px-6 py-3 rounded-xl hover:bg-sky-100 transition-colors"
            >
              View All Doctors <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Health Packages ──────────────────────────────────────────────────── */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="text-sky-600 font-semibold text-sm uppercase tracking-widest">Save More</span>
            <h2 className="text-3xl md:text-4xl font-bold font-nunito text-slate-800 mt-2 mb-4">
              Health Check Packages
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              Comprehensive health screenings at unbeatable prices. Know your health status completely.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
          >
            {packages.map((pkg) => (
              <motion.article
                key={pkg.name}
                variants={fadeUp}
                whileHover={{ y: -4 }}
                className={`relative bg-white rounded-3xl shadow-sm border ${pkg.popular ? 'border-emerald-200 shadow-emerald-100 shadow-lg' : 'border-slate-100'} overflow-hidden transition-all`}
              >
                {pkg.popular && (
                  <div className="bg-emerald-500 text-white text-xs font-bold text-center py-2 tracking-wide">
                    ⭐ MOST POPULAR
                  </div>
                )}
                <div className={`p-8 bg-gradient-to-br from-${pkg.color}-50 to-white`}>
                  <h3 className="font-bold text-slate-800 text-xl mb-2">{pkg.name}</h3>
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className={`text-4xl font-bold font-nunito text-${pkg.color}-600`}>{pkg.price}</span>
                  </div>
                  <p className="text-slate-400 text-sm line-through mb-6">{pkg.originalPrice}</p>

                  <ul className="space-y-2.5 mb-8">
                    {pkg.tests.map((test) => (
                      <li key={test} className="flex items-center gap-2 text-sm text-slate-700">
                        <CheckCircle2 size={16} className={`text-${pkg.color}-500 shrink-0`} />
                        {test}
                      </li>
                    ))}
                  </ul>

                  <Link
                    to="/book-collection"
                    className={`block text-center bg-${pkg.color}-500 hover:bg-${pkg.color}-600 text-white font-semibold py-3.5 rounded-xl transition-colors`}
                  >
                    Book This Package
                  </Link>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Reviews ──────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="text-sky-600 font-semibold text-sm uppercase tracking-widest">Testimonials</span>
            <h2 className="text-3xl md:text-4xl font-bold font-nunito text-slate-800 mt-2 mb-4">
              What Our Patients Say
            </h2>
            <div className="flex items-center justify-center gap-2 text-amber-500">
              {[...Array(5)].map((_, i) => <Star key={i} size={20} fill="currentColor" />)}
              <span className="text-slate-600 text-sm ml-2">4.9 / 5 from 163 reviews on Google</span>
            </div>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {reviews.map((review) => (
              <motion.article
                key={review.name}
                variants={fadeUp}
                className="bg-slate-50 border border-slate-100 rounded-2xl p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex text-amber-400">
                    {[...Array(review.rating)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                  </div>
                  {review.badge && (
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {review.badge}
                    </span>
                  )}
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mb-5 italic">"{review.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 font-bold text-sm">
                    {review.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">{review.name}</p>
                    <p className="text-slate-400 text-xs">{review.date} · Google Review</p>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Health Journal & Insights ────────────────────────────────────────── */}
      <section className="py-20 bg-sky-50/50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="text-sky-600 font-semibold text-xs uppercase tracking-widest bg-sky-100 px-3 py-1 rounded-full">
              Medical Journal & Tips
            </span>
            <h2 className="text-3xl md:text-4xl font-bold font-nunito text-slate-800 mt-3 mb-3">
              Health Insights & Preventive Care
            </h2>
            <p className="text-slate-500 text-sm max-w-2xl mx-auto">
              Empowering you and your family with verified medical knowledge, prevention guidelines, and everyday wellness practices.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {journalArticles.map((art) => (
              <motion.article
                key={art.id}
                variants={fadeUp}
                className="bg-white rounded-2xl p-7 shadow-sm border border-slate-100 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-sky-700 bg-sky-50 px-2.5 py-1 rounded-lg">
                      {art.tag}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">{art.readTime}</span>
                  </div>
                  <h3 className="font-bold text-slate-800 text-lg mb-3 hover:text-sky-600 transition-colors">
                    {art.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-6">
                    {art.summary}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="font-medium text-slate-700">{art.author}</span>
                  <Link
                    to="/contact"
                    className="font-semibold text-sky-600 hover:text-sky-700 inline-flex items-center gap-1"
                  >
                    Ask Doctor &rarr;
                  </Link>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────────────────────────── */}
      <section className="py-20 bg-gradient-to-r from-sky-600 to-cyan-600 text-white overflow-hidden relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/5 rounded-full" />
          <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-white/5 rounded-full" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold font-nunito mb-4">
              Book Your Test Today
            </h2>
            <p className="text-sky-100 text-lg mb-8">
              Free home sample collection available 24/7. Reports delivered online and via WhatsApp.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/book-collection"
                className="inline-flex items-center gap-2 bg-white text-sky-700 font-bold px-8 py-4 rounded-xl hover:bg-sky-50 transition-all shadow-lg hover:shadow-xl"
              >
                <Home size={18} />
                Book Home Collection
              </Link>
              <a
                href="tel:9733525031"
                className="inline-flex items-center gap-2 bg-white/20 border border-white/40 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/30 transition-all"
              >
                <Phone size={18} />
                Call Now: 97335 25031
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Contact Teaser ───────────────────────────────────────────────────── */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-sky-600 font-semibold text-sm uppercase tracking-widest">Find Us</span>
            <h2 className="text-3xl md:text-4xl font-bold font-nunito text-slate-800 mt-2">
              Visit Us or Call Us
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Info card */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8"
            >
              <h3 className="font-bold text-slate-800 text-xl mb-6">Contact Information</h3>
              <div className="space-y-5">
                <div className="flex gap-4">
                  <div className="bg-sky-50 p-3 rounded-xl shrink-0">
                    <MapPin size={20} className="text-sky-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-700 text-sm mb-1">Address</p>
                    <p className="text-slate-500 text-sm leading-relaxed">
                      Keranitola, Station Road, near Mahamaya Nursing Home,<br />
                      Rabindra Nagar East, Midnapore, West Bengal 721101
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="bg-sky-50 p-3 rounded-xl shrink-0">
                    <Phone size={20} className="text-sky-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-700 text-sm mb-1">Phone</p>
                    <a href="tel:9733525031" className="text-sky-600 hover:underline text-sm block">+91 97335 25031</a>
                    <a href="tel:9647393949" className="text-sky-600 hover:underline text-sm block">+91 96473 93949</a>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="bg-sky-50 p-3 rounded-xl shrink-0">
                    <Clock size={20} className="text-sky-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-700 text-sm mb-1">Hours</p>
                    <p className="text-slate-500 text-sm">Centre: 7:00 AM – 11:00 PM daily</p>
                    <p className="text-emerald-600 text-sm font-medium">Home Collection: Open 24/7</p>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
                >
                  Get Directions <ArrowRight size={16} />
                </Link>
              </div>
            </motion.div>

            {/* Map embed */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden min-h-64"
            >
              <iframe
                title="New Life Care Diagnostic Centre Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3686.2!2d87.3215!3d22.4216!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sNew+Life+Care+Diagnostic+Centre+Midnapore!5e0!3m2!1sen!2sin!4v1699999999999!5m2!1sen!2sin"
                width="100%"
                height="100%"
                className="min-h-80"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </motion.div>
          </div>
        </div>
      </section>
    </PageTransition>
  )
}
