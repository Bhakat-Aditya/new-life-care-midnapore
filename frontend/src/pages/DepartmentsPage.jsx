import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { Heart, Bone, Baby, Activity, Stethoscope, AlertCircle } from 'lucide-react'
import PageTransition from '../components/PageTransition'
import PageHero from '../components/PageHero'

const departments = [
  {
    icon: Baby,
    name: 'Gynecology & Obstetrics',
    color: 'rose',
    description:
      "Comprehensive women's health services including prenatal care, high-risk pregnancy management, routine gynecological exams, menstrual disorder treatment, and fertility consultations.",
    services: [
      'Antenatal & Postnatal Care',
      'High-Risk Pregnancy Management',
      'Obstetric Ultrasound',
      'Menstrual Disorder Treatment',
      'PCOS / PCOD Management',
      'Fertility Counselling',
    ],
    doctors: ['Dr. MD. Taquedis Nuri'],
  },
  {
    icon: Heart,
    name: 'Cardiology',
    color: 'red',
    description:
      'Expert cardiac care with advanced diagnostic tools including ECG, Holter monitoring, and stress tests. Early detection and management of heart diseases for a healthier life.',
    services: [
      '12-Lead ECG',
      '24/48-Hour Holter Monitoring',
      'Stress Test / TMT',
      'Cardiac Biomarker Testing',
      'Lipid Profile',
      'Echocardiography Referral',
    ],
    doctors: ['Dr. S K Das'],
  },
  {
    icon: Bone,
    name: 'Orthopedics',
    color: 'amber',
    description:
      'Diagnosis and management of bone, joint, and musculoskeletal conditions. Digital X-Ray and USG for musculoskeletal injuries, arthritis, sports injuries, and spinal disorders.',
    services: [
      'Digital X-Ray (Bone & Joint)',
      'Musculoskeletal USG',
      'Arthritis Diagnosis',
      'Sports Injury Assessment',
      'Spine Disorder Evaluation',
      'Bone Density Assessment',
    ],
    doctors: ['Dr. Saubhik Dasukil'],
  },
  {
    icon: Activity,
    name: 'Diabetes & Thyroid',
    color: 'emerald',
    description:
      'Comprehensive diabetes management and thyroid disorder evaluation with HbA1c, fasting glucose, Thyroid Profile (T3/T4/TSH), and expert endocrinology consultations.',
    services: [
      'Fasting & PP Blood Glucose',
      'HbA1c (3-Month Avg Sugar)',
      'Thyroid Profile (TSH, T3, T4)',
      'Insulin Level Testing',
      'Microalbumin & Kidney Tests',
      'Diabetes Education',
    ],
    doctors: ['Dr. Soumen Das'],
  },
  {
    icon: Stethoscope,
    name: 'General Medicine',
    color: 'sky',
    description:
      'Primary care and general medicine for adults covering infectious diseases, chronic conditions, fever management, and preventive health checkups.',
    services: [
      'Routine Health Checkup',
      'Fever & Infection Management',
      'Chronic Disease Management',
      'Complete Blood Count (CBC)',
      'Comprehensive Metabolic Panel',
      'Preventive Screening',
    ],
    doctors: ['Dr. Nileswar Das'],
  },
  {
    icon: AlertCircle,
    name: 'Critical Care',
    color: 'violet',
    description:
      'Rapid diagnostic support for critically ill patients. Priority reporting, emergency lab services, and liaison with intensive care units for time-sensitive clinical decisions.',
    services: [
      'Emergency Blood Tests',
      'Arterial Blood Gas (ABG)',
      'D-Dimer & Coagulation Profile',
      'Sepsis Biomarkers (Procalcitonin)',
      'Lactate Level',
      'Priority Report Delivery',
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
        subtitle="Specialized care across 6 major medical departments, each supported by experienced doctors and advanced diagnostic infrastructure."
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
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {dept.services.map((svc) => (
                        <li key={svc} className="flex items-center gap-2 text-sm text-slate-700">
                          <span className={`w-1.5 h-1.5 rounded-full ${c.bg} border ${c.border} ${c.text} flex-shrink-0`}
                            style={{ backgroundColor: 'currentColor' }}
                          />
                          {svc}
                        </li>
                      ))}
                    </ul>
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
