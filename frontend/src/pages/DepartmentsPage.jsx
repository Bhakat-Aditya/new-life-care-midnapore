import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Heart,
  Bone,
  Baby,
  Activity,
  Stethoscope,
  AlertCircle,
  Brain,
  Sparkles,
  Scissors,
} from 'lucide-react'
import PageTransition from '../components/PageTransition'
import PageHero from '../components/PageHero'

const departments = [
  {
    icon: Baby,
    name: 'Pediatrics & Child Health',
    color: 'purple',
    description:
      'Specialized care for infants, children, and adolescents led by PGIMER-trained child specialists. From newborn screening to pediatric acute care and immunization.',
    services: [
      'Newborn & Infant Care',
      'Childhood Vaccinations & Immunization',
      'Growth & Nutritional Assessment',
      'Pediatric Respiratory & Asthma Care',
      'Childhood Infection & Fever Management',
      'Developmental Milestones Evaluation',
    ],
    doctors: ['Dr. D. A. Khan'],
  },
  {
    icon: Sparkles,
    name: 'Cosmetology & Hair Transplant',
    color: 'teal',
    description:
      'Advanced aesthetic dermatology, hair restoration treatments, trichology care, and modern skin rejuvenation led by certified clinical cosmetologists.',
    services: [
      'Hair Loss Evaluation & Trichology',
      'Hair Transplant Consultation & Care',
      'Aesthetic Dermatology & Skin Peels',
      'Acne, Pigmentation & Scar Management',
      'Anti-Aging & Skin Rejuvenation',
      'Laser & Electrodermal Therapies',
    ],
    doctors: ['Dr. Saikat Maiti'],
  },
  {
    icon: Brain,
    name: 'Neurology & Brain Care',
    color: 'rose',
    description:
      'Specialized diagnosis and management of neurological disorders, stroke prevention, headache disorders, epilepsy, and peripheral neuropathy by NIMHANS-trained specialists.',
    services: [
      'Stroke Risk Assessment & Post-Care',
      'Headache & Migraine Management',
      'Epilepsy & Seizure Evaluation',
      'Neuropathy & Nerve Pain Treatment',
      'Dementia & Memory Care',
      'Neuro-Rehabilitation Guidance',
    ],
    doctors: ['Dr. Swapan Sinha'],
  },
  {
    icon: Scissors,
    name: 'General & Laparoscopic Surgery',
    color: 'indigo',
    description:
      'Minimally invasive laparoscopic surgical consultations and general surgical procedures with state-of-the-art preoperative diagnostic imaging and recovery care.',
    services: [
      'Laparoscopic Gallbladder & Appendix',
      'Hernia Repair (Inguinal & Ventral)',
      'Anorectal & Hemorrhoid Consultations',
      'Soft Tissue Swellings & Cysts',
      'Wound Management & Minor Procedures',
      'Pre-Surgical Fitness Clearance',
    ],
    doctors: ['Dr. Supriyo Bal'],
  },
  {
    icon: Bone,
    name: 'Orthopedics & Joint Care',
    color: 'amber',
    description:
      'Diagnosis and treatment of bone, joint, and musculoskeletal conditions with high-resolution digital X-Ray and USG for arthritis, fractures, and spine disorders.',
    services: [
      'Digital X-Ray (Bone & Joint)',
      'Musculoskeletal Ultrasound (USG)',
      'Arthritis & Osteoporosis Diagnosis',
      'Sports Injury & Ligament Assessment',
      'Spine Disorder & Sciatica Management',
      'Joint Pain Injections & Physical Rehab',
    ],
    doctors: ['Dr. S. Mahapatra', 'Dr. Saubhik Dasukil'],
  },
  {
    icon: Activity,
    name: 'Diabetes, Thyroid & Endocrinology',
    color: 'emerald',
    description:
      'Complete endocrine care for type 1 and type 2 diabetes, thyroid nodules, hypo/hyperthyroidism, hormonal disorders, and metabolic health checkups.',
    services: [
      'Fasting & Post-Prandial Glucose',
      'HbA1c Glycemic Evaluation',
      'Comprehensive Thyroid Panel (TSH/T3/T4)',
      'Diabetic Foot & Neuropathy Screening',
      'Lipid & Cardiovascular Risk Assessment',
      'Personalized Diet & Lifestyle Planning',
    ],
    doctors: ['Dr. Arya Mahapatra', 'Dr. Soumen Das'],
  },
  {
    icon: Stethoscope,
    name: 'General Medicine & Internal Medicine',
    color: 'sky',
    description:
      'Comprehensive primary care for adult health conditions, fever, infections, chest illnesses, chronic multi-system disorders, and holistic pain management.',
    services: [
      'Routine Health & Annual Checkups',
      'Fever, Typhoid & Malaria Diagnostics',
      'Chest & Respiratory Condition Care',
      'Chronic Pain & Headache Management',
      'Complete Blood & Biochemical Profiles',
      'Preventive Healthcare & Screenings',
    ],
    doctors: ['Dr. Sudipto Sit', 'Dr. Alamgir Sekh', 'Dr. Ujjwal Kumar Bera', 'Dr. Nileswar Das'],
  },
  {
    icon: Heart,
    name: 'Cardiology',
    color: 'red',
    description:
      'Expert cardiac care with advanced non-invasive diagnostic tools including 12-lead ECG, 24/48-hour Holter monitoring, cardiac biomarkers, and preventive heart screenings.',
    services: [
      '12-Lead Digital ECG',
      '24/48-Hour Holter Monitoring',
      'Cardiac Biomarker Testing (Troponin)',
      'Lipid Profile & Hypertension Review',
      'Stress Assessment & Heart Checkups',
      'Preventive Cardiology Counseling',
    ],
    doctors: ['Dr. S K Das'],
  },
  {
    icon: Baby,
    name: 'Gynecology & Obstetrics',
    color: 'rose',
    description:
      "Comprehensive women's health services including antenatal care, high-risk pregnancy evaluations, obstetric ultrasound, menstrual disorder treatments, and fertility guidance.",
    services: [
      'Antenatal & Postnatal Mother Care',
      'High-Risk Pregnancy Screening',
      'Pelvic & Obstetric Ultrasound (USG)',
      'PCOS / PCOD Evaluation & Diet',
      'Menstrual Disorder Management',
      'Fertility & Pre-Conception Guidance',
    ],
    doctors: ['Dr. MD. Taquedis Nuri'],
  },
  {
    icon: AlertCircle,
    name: 'Critical Care Support',
    color: 'violet',
    description:
      'Rapid diagnostic support for critically ill patients. Priority stat reporting, emergency biochemistry, and time-sensitive laboratory decisions.',
    services: [
      'Stat Blood & Arterial Gas Tests',
      'D-Dimer & Coagulation Profiling',
      'Sepsis Biomarkers (Procalcitonin, CRP)',
      'Serum Electrolytes & Lactate Monitoring',
      'Priority Emergency Report Delivery',
      'Liaison for Critical Patient Care',
    ],
    doctors: ['Dr. Nileswar Das'],
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
}

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
}

const colorMap = {
  purple: { bg: 'bg-purple-50', iconBg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-200', badge: 'bg-purple-100 text-purple-700' },
  teal: { bg: 'bg-teal-50', iconBg: 'bg-teal-100', text: 'text-teal-600', border: 'border-teal-200', badge: 'bg-teal-100 text-teal-700' },
  indigo: { bg: 'bg-indigo-50', iconBg: 'bg-indigo-100', text: 'text-indigo-600', border: 'border-indigo-200', badge: 'bg-indigo-100 text-indigo-700' },
  rose: { bg: 'bg-rose-50', iconBg: 'bg-rose-100', text: 'text-rose-600', border: 'border-rose-200', badge: 'bg-rose-100 text-rose-700' },
  red: { bg: 'bg-red-50', iconBg: 'bg-red-100', text: 'text-red-600', border: 'border-red-200', badge: 'bg-red-100 text-red-700' },
  amber: { bg: 'bg-amber-50', iconBg: 'bg-amber-100', text: 'text-amber-600', border: 'border-amber-200', badge: 'bg-amber-100 text-amber-700' },
  emerald: { bg: 'bg-emerald-50', iconBg: 'bg-emerald-100', text: 'text-emerald-600', border: 'border-emerald-200', badge: 'bg-emerald-100 text-emerald-700' },
  sky: { bg: 'bg-sky-50', iconBg: 'bg-sky-100', text: 'text-sky-600', border: 'border-sky-200', badge: 'bg-sky-100 text-sky-700' },
  violet: { bg: 'bg-violet-50', iconBg: 'bg-violet-100', text: 'text-violet-600', border: 'border-violet-200', badge: 'bg-violet-100 text-violet-700' },
}

export default function DepartmentsPage() {
  return (
    <PageTransition>
      <Helmet>
        <title>Departments | New Life Care Diagnostic Centre Midnapore</title>
        <meta
          name="description"
          content="Explore all departments at New Life Care Diagnostic Centre Midnapore — Gynecology, Cardiology, Orthopedics, Diabetes & Thyroid, General Medicine, and Critical Care."
        />
      </Helmet>

      <PageHero
        title="Our Departments"
        subtitle="Specialized care across 10 major medical departments, each supported by experienced doctors and advanced diagnostic infrastructure."
        breadcrumb={[{ label: 'Departments' }]}
      />

      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {departments.map((dept) => {
              const c = colorMap[dept.color]
              return (
                <motion.article
                  key={dept.name}
                  variants={fadeUp}
                  whileHover={{ y: -4 }}
                  className={`bg-white rounded-2xl border ${c.border} shadow-sm hover:shadow-lg transition-all overflow-hidden`}
                >
                  {/* Header */}
                  <div className={`${c.bg} p-6 border-b ${c.border}`}>
                    <div className="flex items-center gap-4">
                      <div className={`${c.iconBg} p-4 rounded-2xl`}>
                        <dept.icon size={28} className={c.text} />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-slate-800 font-nunito">{dept.name}</h2>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {dept.doctors.map((doc) => (
                            <span key={doc} className={`text-xs font-medium px-2.5 py-1 rounded-full ${c.badge}`}>
                              👨‍⚕️ {doc}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-6">
                    <p className="text-slate-600 text-sm leading-relaxed mb-5">{dept.description}</p>
                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                      Services Include
                    </h3>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-5">
                      {dept.services.map((svc) => (
                        <li key={svc} className="flex items-center gap-2 text-sm text-slate-700">
                          <span className={`w-1.5 h-1.5 rounded-full ${c.bg} border ${c.border} ${c.text} flex-shrink-0`}
                            style={{ backgroundColor: 'currentColor' }}
                          />
                          {svc}
                        </li>
                      ))}
                    </ul>

                    <Link
                      to={`/book-consultation?department=${encodeURIComponent(dept.name)}`}
                      className={`inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-bold transition-all ${c.badge} hover:shadow-sm`}
                    >
                      Book Consultation in {dept.name} →
                    </Link>
                  </div>
                </motion.article>
              )
            })}
          </motion.div>
        </div>
      </section>
    </PageTransition>
  )
}
