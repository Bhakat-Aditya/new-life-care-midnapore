import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CalendarDays, Clock, Stethoscope, Award, ArrowRight, AlertCircle } from 'lucide-react';
import { getDoctors } from '../services/api';
import PageTransition from '../components/PageTransition';
import PageHero from '../components/PageHero';

const FALLBACK_DOCTORS = [
  {
    id: 1,
    name: 'Dr. Nileswar Das',
    specialization: 'General Medicine & Critical Care',
    qualification: 'MBBS MD',
    experience: '15+ Years',
    schedule: [
      { day: 'Monday', time: '10am – 1pm' },
      { day: 'Wednesday', time: '10am – 1pm' },
      { day: 'Friday', time: '5pm – 8pm' },
    ],
  },
  {
    id: 2,
    name: 'Dr. S K Das',
    specialization: 'Cardiology',
    qualification: 'MBBS MD (Cardiology)',
    experience: '20+ Years',
    schedule: [
      { day: 'Tuesday', time: '11am – 2pm' },
      { day: 'Saturday', time: '11am – 2pm' },
      { day: 'Thursday', time: '5pm – 8pm' },
    ],
  },
  {
    id: 3,
    name: 'Dr. Saubhik Dasukil',
    specialization: 'Orthopedics',
    qualification: 'MBBS MS (Ortho)',
    experience: '12+ Years',
    schedule: [
      { day: 'Monday', time: '5pm – 8pm' },
      { day: 'Wednesday', time: '5pm – 8pm' },
      { day: 'Saturday', time: '11am – 2pm' },
    ],
  },
  {
    id: 4,
    name: 'Dr. MD. Taquedis Nuri',
    specialization: 'Gynecology',
    qualification: 'MBBS MS (Gynae)',
    experience: '18+ Years',
    schedule: [
      { day: 'Tuesday', time: '10am – 1pm' },
      { day: 'Friday', time: '10am – 1pm' },
      { day: 'Sunday', time: '10am – 12pm' },
    ],
  },
  {
    id: 5,
    name: 'Dr. Soumen Das',
    specialization: 'Diabetes & Endocrinology',
    qualification: 'MBBS MD',
    experience: '10+ Years',
    schedule: [
      { day: 'Monday', time: '3pm – 6pm' },
      { day: 'Saturday', time: '3pm – 6pm' },
      { day: 'Thursday', time: '10am – 1pm' },
    ],
  },
];

function getInitials(name) {
  return name
    .replace(/^Dr\.\s*/i, '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join('');
}

const SPECIALTY_COLORS = {
  'General Medicine & Critical Care': 'bg-blue-100 text-blue-700',
  Cardiology: 'bg-red-100 text-red-700',
  Orthopedics: 'bg-orange-100 text-orange-700',
  Gynecology: 'bg-pink-100 text-pink-700',
  'Diabetes & Endocrinology': 'bg-green-100 text-green-700',
};

const DAY_SHORT = {
  Monday: 'Mon',
  Tuesday: 'Tue',
  Wednesday: 'Wed',
  Thursday: 'Thu',
  Friday: 'Fri',
  Saturday: 'Sat',
  Sunday: 'Sun',
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <div className="w-14 h-14 border-4 border-sky-200 border-t-sky-500 rounded-full animate-spin" />
      <p className="text-slate-500 text-sm font-medium">Loading doctors…</p>
    </div>
  );
}

function ErrorState({ onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
      <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
        <AlertCircle className="w-8 h-8 text-red-500" />
      </div>
      <div>
        <p className="text-slate-700 font-semibold text-lg">Could not load doctors</p>
        <p className="text-slate-400 text-sm mt-1">Please check your connection and try again.</p>
      </div>
      <button
        onClick={onRetry}
        className="mt-2 px-6 py-2 bg-sky-500 text-white rounded-lg text-sm font-medium hover:bg-sky-600 transition-colors"
      >
        Retry
      </button>
    </div>
  );
}

function DoctorCard({ doctor }) {
  const colorClass =
    SPECIALTY_COLORS[doctor.specialization] || 'bg-sky-100 text-sky-700';
  const initials = getInitials(doctor.name);

  return (
    <motion.article
      variants={cardVariants}
      whileInView="visible"
      initial="hidden"
      viewport={{ once: true }}
      className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col gap-5 hover:shadow-md transition-shadow duration-300"
    >
      {/* Avatar + Name */}
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 rounded-full bg-sky-500 flex items-center justify-center shrink-0 shadow">
          <span className="text-white font-bold text-xl tracking-wide">{initials}</span>
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-slate-800 font-bold text-lg leading-tight">{doctor.name}</h2>
          <p className="text-slate-500 text-sm mt-0.5">{doctor.qualification}</p>
          <span
            className={`inline-block mt-2 px-3 py-0.5 rounded-full text-xs font-semibold ${colorClass}`}
          >
            {doctor.specialization}
          </span>
        </div>
      </div>

      {/* Experience badge */}
      <div className="flex items-center gap-2">
        <Award className="w-4 h-4 text-amber-500 shrink-0" />
        <span className="text-sm text-slate-600 font-medium">{doctor.experience} Experience</span>
      </div>

      {/* Schedule */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <CalendarDays className="w-4 h-4 text-sky-500 shrink-0" />
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            Weekly Schedule
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {(doctor.schedule || []).map((slot, idx) => (
            <div
              key={idx}
              className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5"
            >
              <span className="text-xs font-bold text-sky-600">
                {DAY_SHORT[slot.day] || slot.day}
              </span>
              <span className="text-slate-300 text-xs">|</span>
              <Clock className="w-3 h-3 text-slate-400" />
              <span className="text-xs text-slate-600">{slot.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Book Button */}
      <Link
        to="/book-consultation"
        className="mt-auto flex items-center justify-center gap-2 w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold text-sm py-2.5 rounded-xl transition-colors duration-200"
      >
        <Stethoscope className="w-4 h-4" />
        Book Appointment
        <ArrowRight className="w-4 h-4" />
      </Link>
    </motion.article>
  );
}

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchDoctors = async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await getDoctors();
      setDoctors(Array.isArray(data) && data.length > 0 ? data : FALLBACK_DOCTORS);
    } catch {
      setDoctors(FALLBACK_DOCTORS);
      setError(false); // show fallback instead
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const breadcrumbs = [{ label: 'Home', href: '/' }, { label: 'Our Doctors' }];

  return (
    <PageTransition>
      <Helmet>
        <title>Our Doctors – New Life Care Diagnostic Centre | Midnapore</title>
        <meta
          name="description"
          content="Meet our experienced panel of specialist doctors at New Life Care Diagnostic Centre, Midnapore. Book appointments with cardiologists, orthopedic surgeons, gynecologists, and more."
        />
        <meta
          name="keywords"
          content="doctors Midnapore, specialist doctors West Bengal, New Life Care Diagnostic Centre, book appointment Midnapore"
        />
        <link rel="canonical" href="https://newlifecaredc.in/doctors" />
      </Helmet>

      <main className="overflow-x-hidden bg-slate-50 min-h-screen">
        <PageHero
          title="Our Expert Doctors"
          subtitle="A dedicated panel of experienced specialists committed to your health and well-being."
          breadcrumbs={breadcrumbs}
        />

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <ErrorState onRetry={fetchDoctors} />
          ) : (
            <>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="text-center text-slate-500 text-sm mb-10"
              >
                Showing <span className="font-semibold text-slate-700">{doctors.length}</span>{' '}
                specialist{doctors.length !== 1 ? 's' : ''}
              </motion.p>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {doctors.map((doctor) => (
                  <DoctorCard key={doctor.id || doctor._id || doctor.name} doctor={doctor} />
                ))}
              </motion.div>
            </>
          )}
        </section>

        {/* CTA Banner */}
        <section className="bg-sky-500 py-14 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h3 className="text-white text-2xl sm:text-3xl font-bold mb-3">
              Need help choosing the right doctor?
            </h3>
            <p className="text-sky-100 mb-7 text-base">
              Call us at{' '}
              <a href="tel:9733525031" className="underline font-semibold hover:text-white">
                97335 25031
              </a>{' '}
              and our team will guide you to the best specialist.
            </p>
            <Link
              to="/book-consultation"
              className="inline-flex items-center gap-2 bg-white text-sky-600 font-bold px-8 py-3 rounded-xl hover:bg-sky-50 transition-colors shadow"
            >
              Book an Appointment <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </section>
      </main>
    </PageTransition>
  );
}
