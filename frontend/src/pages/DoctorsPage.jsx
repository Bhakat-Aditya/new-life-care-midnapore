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
    name: 'Dr. S. K. Das',
    specialization: 'Orthopedics & Joint Surgery',
    qualification: 'MS (Ortho), (AIIMS) New Delhi',
    experience: '15+ Years',
    imageUrl: '/images/doctors/dr-sk-das.jpg',
    about: 'Renowned Orthopedic Surgeon from AIIMS New Delhi specializing in arthroscopy, micro surgery, trauma, spine, and ligament replacement surgery.',
    schedule: [{ day: 'Monday – Saturday', time: 'Consultation by Appointment' }],
  },
  {
    id: 2,
    name: 'Dr. Niket Arora',
    specialization: 'Cardiothoracic & Vascular Surgery',
    qualification: 'MBBS, DNB (Cardio Thoracic Surgery)',
    experience: '12+ Years',
    imageUrl: '/images/doctors/dr-niket-arora.jpg',
    about: 'Senior Consultant Cardiothoracic & Vascular Surgeon attached with Manipal Hospitals. WBMC Reg No: 82887. Member of EACTS and IACTS.',
    schedule: [{ day: 'Monday – Saturday', time: 'Consultation by Appointment' }],
  },
  {
    id: 3,
    name: 'Dr. Panchanan Panigrahi',
    specialization: 'Surgical Gastroenterology & GI Surgery',
    qualification: 'MBBS, MS (Gen. Surgery), MCH Surgical Gastroenterology (BHU), FIAGES, EFIAGES, FAGIE',
    experience: '14+ Years',
    imageUrl: '/images/doctors/dr-panchanan-panigrahi.jpg',
    about: 'Consultant Surgical Gastroenterologist & Advanced GI, Endo, Laser and Laparoscopic Surgeon from BHU & Hitech Medical College Bhubaneswar.',
    schedule: [{ day: 'Monday – Saturday', time: 'Consultation by Appointment' }],
  },
  {
    id: 4,
    name: 'Dr. Ayesha Sultana',
    specialization: 'Gynecology & Obstetrics',
    qualification: 'MBBS (Kol), MS (G&O) (Kol), D.N.B. (G&O), MRCOG (London)',
    experience: '12+ Years',
    imageUrl: '/images/doctors/dr-ayesha-sultana.jpg',
    about: 'Renowned Obstetrician & Gynecologist holding MRCOG London and DNB from National Board Delhi, providing expert care for menstrual disorders and pregnancy.',
    schedule: [{ day: 'Monday – Saturday', time: 'Consultation by Appointment' }],
  },
  {
    id: 5,
    name: 'Dr. Archisman Haldar',
    specialization: 'Neurology & Brain Care',
    qualification: 'MBBS (AIIMS–Bhubaneswar), MD–Medicine (AIIMS, Delhi), DM–Neuro (AIIMS–Bhubaneswar)',
    experience: '10+ Years',
    imageUrl: '/images/doctors/dr-archisman-haldar.jpg',
    about: 'Distinguished Neurologist from AIIMS New Delhi and AIIMS Bhubaneswar, specializing in seizures, epilepsy, stroke, neuropathy, and neurological disorders.',
    schedule: [{ day: 'Monday – Saturday', time: 'Consultation by Appointment' }],
  },
  {
    id: 6,
    name: 'Dr. Samujjwal Das',
    specialization: 'Head & Neck Oncosurgery',
    qualification: 'MBBS, MDS (Oral and Maxillofacial Surgery)',
    experience: '10+ Years',
    imageUrl: '/images/doctors/dr-samujjwal-das.jpg',
    about: 'Renowned Head and Neck Oncosurgeon attached with Desun Hospital Kolkata, diagnosing and treating oral, mouth, throat, and neck tumors.',
    schedule: [{ day: 'Monday – Saturday', time: 'Consultation by Appointment' }],
  },
  {
    id: 7,
    name: 'Dr. Biswajit Panda',
    specialization: 'General & Laparoscopic Surgery',
    qualification: 'MBBS, MS (General Laparoscopic Surgeon)',
    experience: '10+ Years',
    imageUrl: '/images/doctors/dr-biswajit-panda.jpg',
    about: 'Renowned General and Laparoscopic Surgeon offering advanced minimally invasive laparoscopic procedures for hernia, gallbladder stones, and acute conditions.',
    schedule: [{ day: 'Monday – Saturday', time: 'Consultation by Appointment' }],
  },
  {
    id: 8,
    name: 'Dr. Sudipto Sit',
    specialization: 'General Medicine & Pain Management',
    qualification: 'MBBS, DNB (General Medicine)',
    experience: '10+ Years',
    imageUrl: '/images/doctors/dr-sudipto-sit.jpg',
    about: 'Renowned Medicine Specialist attached to Midnapore Medical College & Hospital, with focused expertise in chest diseases, thyroid disorders, diabetes, and pain management.',
    schedule: [{ day: 'Monday – Saturday', time: 'Consultation by Appointment' }],
  },
  {
    id: 9,
    name: 'Dr. Konika Das',
    specialization: 'Neuropsychiatry & Behavioral Health',
    qualification: 'MBBS, MD Psychiatry (SSKM), Regd no: 75006 of WBMC',
    experience: '10+ Years',
    imageUrl: '/images/doctors/dr-konika-das.jpg',
    about: 'Consultant Neuropsychiatrist post-graduated from SSKM Hospital (WBMC Reg: 75006), specializing in clinical depression, anxiety, panic disorders, and counseling.',
    schedule: [{ day: 'Monday – Saturday', time: 'Consultation by Appointment' }],
  },
  {
    id: 10,
    name: 'Dr. Arpita Maiti',
    specialization: 'Gynecology, Obstetrics & Infertility',
    qualification: 'MBBS (Cal), DGO (Cal)',
    experience: '15+ Years',
    imageUrl: '/images/doctors/dr-arpita-maiti.jpg',
    about: 'Consultant Gynecologist, Obstetrician, and Infertility & Assisted Reproduction Specialist, formerly associated with Midnapore Medical College & Hospital.',
    schedule: [{ day: 'Monday – Saturday', time: 'Consultation by Appointment' }],
  },
  {
    id: 11,
    name: 'Dr. Sushovan Maiti',
    specialization: 'Gastroenterology & Hepatology',
    qualification: 'M.B.B.S. (Calcutta Univ), M.S. (SSKM Hospital), Formerly Asian Institute of Gastroenterology (Hyderabad)',
    experience: '18+ Years',
    imageUrl: '/images/doctors/dr-sushovan-maiti.jpg',
    about: 'Eminent Gastroenterologist post-graduated from SSKM Hospital and formerly with Asian Institute of Gastroenterology (AIG) Hyderabad.',
    schedule: [{ day: 'Monday – Saturday', time: 'Consultation by Appointment' }],
  },
  {
    id: 12,
    name: 'Dr. D. A. Khan',
    specialization: 'Pediatrics & Child Health',
    qualification: 'MBBS, DCH (KOL), MD PEDIATRICS (PGIMER CHANDIGARH)',
    experience: '15+ Years',
    about: 'Renowned Child Specialist (Pediatrician) with postgraduate training from PGIMER Chandigarh and Kolkata, specializing in newborn care and pediatric illnesses.',
    schedule: [{ day: 'Monday – Saturday', time: 'Consultation by Appointment' }],
  },
  {
    id: 13,
    name: 'Dr. Saikat Maiti',
    specialization: 'Cosmetology, Trichology & Hair Transplant',
    qualification: 'MD, NM (Run), Cosmetologist & Trichologist, (PGDCC) E-Derm',
    experience: '10+ Years',
    about: 'Renowned Mentor Hair Transplant Specialist, Cosmetologist and Trichologist specializing in hair restoration, aesthetic dermatology, and skin rejuvenation.',
    schedule: [{ day: 'Monday – Saturday', time: 'Consultation by Appointment' }],
  },
  {
    id: 14,
    name: 'Dr. S. Mahapatra',
    specialization: 'Orthopedics & Joint Care',
    qualification: 'MBBS, D (Ortho)',
    experience: '12+ Years',
    about: 'Renowned Consultant Orthopedic Surgeon diagnosing and managing bone fractures, arthritis, joint replacements, and musculoskeletal injuries.',
    schedule: [{ day: 'Monday – Saturday', time: 'Consultation by Appointment' }],
  },
  {
    id: 15,
    name: 'Dr. Arya Mahapatra',
    specialization: 'Diabetes, Thyroid & Endocrinology',
    qualification: 'M.B.B.S. (NRSMCH), DNB (General Medicine)',
    experience: '10+ Years',
    about: 'Renowned Thyroid and Sugar Specialist from NRS Medical College and DNB board, dedicated to advanced glycemic management, thyroid disorders, and endocrine health.',
    schedule: [{ day: 'Monday – Saturday', time: 'Consultation by Appointment' }],
  },
  {
    id: 16,
    name: 'Dr. Alamgir Sekh',
    specialization: 'General Medicine & Diabetology',
    qualification: 'MBBS, DNB (General Medicine)',
    experience: '10+ Years',
    about: 'Renowned General Medicine Specialist with focused expertise in medicine, chest and respiratory health, thyroid diseases, and blood sugar control.',
    schedule: [{ day: 'Monday – Saturday', time: 'Consultation by Appointment' }],
  },
  {
    id: 17,
    name: 'Dr. Ujjwal Kumar Bera',
    specialization: 'General Physician & Internal Medicine',
    qualification: 'M.B.B.S., M.D. (PG: SSKM College & Hospital)',
    experience: '12+ Years',
    about: 'Renowned General Physician post-graduated from SSKM College & Hospital (IPGMER Kolkata), treating acute and chronic adult illnesses and preventive healthcare.',
    schedule: [{ day: 'Monday – Saturday', time: 'Consultation by Appointment' }],
  },
  {
    id: 18,
    name: 'Dr. Supriyo Bal',
    specialization: 'General & Laparoscopic Surgery',
    qualification: 'MBBS, DNB',
    experience: '10+ Years',
    about: 'Renowned General and Laparoscopic Surgeon offering advanced minimally invasive laparoscopic procedures, hernia repair, gallbladder, and general surgical interventions.',
    schedule: [{ day: 'Monday – Saturday', time: 'Consultation by Appointment' }],
  },
  {
    id: 19,
    name: 'Dr. Swapan Sinha',
    specialization: 'Neurology & Brain Care',
    qualification: 'MBBS (Cal), MD (Med) Bangalore University, DM (Neuro) NIMHANS, DNB (Med & Neuro) New Delhi',
    experience: '20+ Years',
    about: 'Renowned Senior Consultant Neurologist trained at NIMHANS and New Delhi, specializing in stroke, epilepsy, migraines, neuropathies, and neuro-rehabilitation.',
    schedule: [{ day: 'Monday – Saturday', time: 'Consultation by Appointment' }],
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
  'Cardiothoracic & Vascular Surgery': 'bg-red-100 text-red-700',
  'Orthopedics & Joint Surgery': 'bg-amber-100 text-amber-700',
  'Orthopedics & Joint Care': 'bg-amber-100 text-amber-700',
  'Surgical Gastroenterology & GI Surgery': 'bg-emerald-100 text-emerald-700',
  'Gastroenterology & Hepatology': 'bg-emerald-100 text-emerald-700',
  'Gynecology & Obstetrics': 'bg-pink-100 text-pink-700',
  'Gynecology, Obstetrics & Infertility': 'bg-rose-100 text-rose-700',
  'Head & Neck Oncosurgery': 'bg-indigo-100 text-indigo-700',
  'Neuropsychiatry & Behavioral Health': 'bg-purple-100 text-purple-700',
  'General Medicine & Critical Care': 'bg-blue-100 text-blue-700',
  'Cardiology': 'bg-red-100 text-red-700',
  'Orthopedics': 'bg-amber-100 text-amber-700',
  'Gynecology': 'bg-pink-100 text-pink-700',
  'Diabetes & Endocrinology': 'bg-emerald-100 text-emerald-700',
  'Diabetes & Thyroid': 'bg-emerald-100 text-emerald-700',
  'Diabetes, Thyroid & Endocrinology': 'bg-emerald-100 text-emerald-700',
  'Pediatrics & Child Health': 'bg-purple-100 text-purple-700',
  'Cosmetology, Trichology & Hair Transplant': 'bg-teal-100 text-teal-700',
  'General Medicine & Pain Management': 'bg-sky-100 text-sky-700',
  'General Medicine & Diabetology': 'bg-cyan-100 text-cyan-700',
  'General Physician & Internal Medicine': 'bg-blue-100 text-blue-700',
  'General & Laparoscopic Surgery': 'bg-indigo-100 text-indigo-700',
  'Neurology & Brain Care': 'bg-rose-100 text-rose-700',
  'Critical Care': 'bg-violet-100 text-violet-700',
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
  const [imageError, setImageError] = useState(false);
  const colorClass =
    SPECIALTY_COLORS[doctor.specialization] || 'bg-sky-100 text-sky-700';
  const initials = getInitials(doctor.name);
  const photo = !imageError && (doctor.imageUrl || doctor.image);

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
        {photo ? (
          <img
            src={photo}
            alt={doctor.name}
            onError={() => setImageError(true)}
            className="w-16 h-16 rounded-full object-cover shrink-0 shadow border-2 border-sky-100"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-sky-500 flex items-center justify-center shrink-0 shadow">
            <span className="text-white font-bold text-xl tracking-wide">{initials}</span>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h2 className="text-slate-800 font-bold text-lg leading-tight">{doctor.name}</h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5 leading-snug">{doctor.qualification}</p>
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
        <span className="text-sm text-slate-600 font-medium">{doctor.experience || '10+ Years'} Experience</span>
      </div>

      {doctor.about && (
        <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">
          {doctor.about}
        </p>
      )}

      {/* Schedule */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <CalendarDays className="w-4 h-4 text-sky-500 shrink-0" />
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            Consultation / Schedule
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {(doctor.schedule && doctor.schedule.length > 0
            ? doctor.schedule
            : [{ day: 'Monday – Saturday', time: 'Consultation by Appointment' }]
          ).map((slot, idx) => (
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
        to={`/book-consultation?doctor=${encodeURIComponent(doctor.name)}&department=${encodeURIComponent(doctor.specialization)}`}
        className="mt-auto flex items-center justify-center gap-2 w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold text-sm py-2.5 rounded-xl transition-colors duration-200 shadow-sm"
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
