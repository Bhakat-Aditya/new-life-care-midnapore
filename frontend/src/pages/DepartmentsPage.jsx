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
    icon: Heart,
    name: 'Cardiothoracic & Vascular Surgery',
    color: 'red',
    description:
      'Advanced cardiac and vascular surgical consultations led by Senior Consultant Dr. Niket Arora from Manipal Hospitals, specializing in coronary, valvular, and peripheral vascular diseases.',
    services: [
      'Cardiothoracic Surgical Consultations',
      'Coronary Artery Disease Management',
      'Vascular & Peripheral Vessel Surgery',
      'Post-Operative Cardiac Rehab Follow-up',
      'Computerized 12-Lead Digital ECG',
      '24/48-Hour Holter Monitoring',
    ],
    doctors: ['Dr. Niket Arora (Manipal Hospitals)'],
  },
  {
    icon: Bone,
    name: 'Orthopedics, Joint & Spine Surgery',
    color: 'amber',
    description:
      'Diagnosis and surgical management of bone fractures, complex trauma, arthroscopy, joint reconstruction, and spine conditions led by AIIMS New Delhi trained surgeons.',
    services: [
      'Arthroscopy & Minimally Invasive Joint Surgery',
      'Ligament Replacement (ACL/PCL Reconstructions)',
      'Complex Trauma & Fracture Reduction',
      'Spine Disorders, Sciatica & Slip Disc',
      'High-Resolution Digital Bone X-Ray',
      'Joint Injections & Musculoskeletal USG',
    ],
    doctors: ['Dr. S. K. Das (AIIMS New Delhi)', 'Dr. S. Mahapatra'],
  },
  {
    icon: Activity,
    name: 'Gastroenterology, Hepatology & GI Surgery',
    color: 'emerald',
    description:
      'Advanced endoscopic, laser, and laparoscopic gastrointestinal care for liver, gallbladder, stomach, and colorectal conditions led by BHU and SSKM/AIG trained specialists.',
    services: [
      'Upper GI Video Endoscopy',
      'Liver & Hepatobiliary Diseases Management',
      'Advanced Gastrointestinal & Colorectal Care',
      'GERD, Acid Peptic & Gastric Ulcer Solutions',
      'Laparoscopic & Laser GI Procedures',
      'Complete Liver Function Profiles',
    ],
    doctors: ['Dr. Panchanan Panigrahi (BHU)', 'Dr. Sushovan Maiti (SSKM & AIG)'],
  },
  {
    icon: Baby,
    name: 'Gynecology, Obstetrics & Infertility',
    color: 'rose',
    description:
      'Comprehensive women’s health services led by MRCOG London and National Board certified specialists, providing high-risk pregnancy management, infertility solutions, and menstrual disorder care.',
    services: [
      'High-Risk Pregnancy Screening & Care',
      'Infertility & Assisted Reproduction Counseling',
      'Menstrual Irregularities & PCOS / PCOD',
      'Pelvic & Obstetric High-Res Ultrasound',
      'Antenatal Care & Fetal Well-being Panels',
      'Cervical Cancer Screening (Pap Smear)',
    ],
    doctors: ['Dr. Ayesha Sultana (MRCOG London)', 'Dr. Arpita Maiti (Ex-MMC)'],
  },
  {
    icon: Brain,
    name: 'Neurology, Brain Care & Neuro-Diagnostics',
    color: 'indigo',
    description:
      'Specialized care for neurological disorders, epilepsy, stroke, migraines, and nerve conditions by AIIMS and NIMHANS specialists, supported by in-house digital EEG and NCV testing.',
    services: [
      'Digital Electroencephalogram (EEG)',
      'Nerve Conduction Velocity (NCV) Studies',
      'Epilepsy & Seizure Disorder Management',
      'Stroke Rehabilitation & Risk Assessment',
      'Headache, Migraine & Neuropathy Relief',
      'Neuro-Electrophysiological Diagnostics',
    ],
    doctors: ['Dr. Archisman Haldar (AIIMS)', 'Dr. Swapan Sinha (NIMHANS)'],
  },
  {
    icon: AlertCircle,
    name: 'Head & Neck Oncosurgery',
    color: 'purple',
    description:
      'Specialized oncology consultations for oral cavity, mouth, salivary glands, thyroid, and neck tumors by Desun Hospital affiliated Head & Neck Oncosurgeons.',
    services: [
      'Oral & Mouth Tumor Diagnostics',
      'Neck Swelling & Lymph Node Evaluations',
      'Maxillofacial & Salivary Gland Lesions',
      'Pre-Surgical Tumor Staging & Biopsies',
      'Cancer Marker Screening (7 Markers)',
      'Post-Oncology Surgical Rehabilitation',
    ],
    doctors: ['Dr. Samujjwal Das (Desun Hospital)'],
  },
  {
    icon: Sparkles,
    name: 'Neuropsychiatry & Behavioral Health',
    color: 'teal',
    description:
      'Confidential and empathetic psychiatric consultations by SSKM-trained Neuropsychiatrists for depression, anxiety disorders, panic attacks, obsessive conditions, and sleep health.',
    services: [
      'Depression & Anxiety Management',
      'Panic Disorder & Phobia Therapy',
      'Sleep Disturbance & Insomnia Solutions',
      'Stress & Psychosomatic Disorders',
      'Geriatric & Memory Health Counseling',
      'Neuropsychiatric Medications & Review',
    ],
    doctors: ['Dr. Konika Das (SSKM)'],
  },
  {
    icon: Scissors,
    name: 'General & Laparoscopic Surgery',
    color: 'sky',
    description:
      'Minimally invasive laparoscopic surgical consultations for hernia repair, gallbladder stones, appendicitis, and soft-tissue surgical procedures with rapid recovery.',
    services: [
      'Laparoscopic Gallbladder Stone Removal',
      'Hernia Repair (Inguinal, Umbilical, Ventral)',
      'Laparoscopic Appendectomy Consultations',
      'Anorectal & Hemorrhoid Surgery Advice',
      'Cyst, Lipoma & Soft Tissue Excision',
      'Pre-Surgical Fitness & Lab Clearance',
    ],
    doctors: ['Dr. Biswajit Panda', 'Dr. Supriyo Bal'],
  },
  {
    icon: Baby,
    name: 'Pediatrics & Child Health',
    color: 'purple',
    description:
      'Dedicated healthcare for infants, toddlers, children, and adolescents led by PGIMER Chandigarh-trained pediatricians. From newborn screening to pediatric acute infection care.',
    services: [
      'Newborn & Infant Health Assessments',
      'Complete Childhood Immunization Packages',
      'Pediatric Respiratory & Asthma Care',
      'Childhood Fever, Infection & Growth Review',
      'Nutritional & Milestone Screening',
      'Pediatric Blood & Biochemical Diagnostics',
    ],
    doctors: ['Dr. D. A. Khan (PGIMER Chandigarh)'],
  },
  {
    icon: Stethoscope,
    name: 'General Medicine & Pain Management',
    color: 'sky',
    description:
      'Comprehensive internal medicine and primary care led by Midnapore Medical College and SSKM Hospital physicians for fever, respiratory illnesses, hypertension, and chronic pain.',
    services: [
      'Fever, Typhoid, Dengue & Malaria Diagnostics',
      'Hypertension & Cardiac Risk Evaluation',
      'Chest & Respiratory Condition Care',
      'Chronic Pain Management & Arthritis Review',
      'Routine Preventive Health Checkups',
      'Emergency Oxygen Cylinder Support',
    ],
    doctors: ['Dr. Sudipto Sit (MMC)', 'Dr. Alamgir Sekh', 'Dr. Ujjwal Kumar Bera (SSKM)'],
  },
  {
    icon: Sparkles,
    name: 'Cosmetology, Trichology & Hair Transplant',
    color: 'teal',
    description:
      'Modern aesthetic dermatology, trichological evaluations, hair transplant guidance, and clinical skin rejuvenation led by certified clinical cosmetologists.',
    services: [
      'Hair Loss Assessment & Trichology',
      'Hair Transplant Evaluation & Care',
      'Aesthetic Dermatology & Skin Peels',
      'Acne Scar & Hyperpigmentation Care',
      'Anti-Aging Therapies & Rejuvenation',
      'Laser & Electrodermal Procedures',
    ],
    doctors: ['Dr. Saikat Maiti'],
  },
  {
    icon: Activity,
    name: 'Diabetes, Thyroid & Endocrinology',
    color: 'emerald',
    description:
      'Expert endocrine care for type 1 and type 2 diabetes, thyroid nodules, hypo/hyperthyroidism, hormonal disorders, and comprehensive metabolic health.',
    services: [
      'HbA1c & 59-Parameter Diabetic Profile',
      'Thyroid Hormone Panel (TSH, Free T3, T4)',
      'Diabetic Foot & Neuropathy Screen',
      'Lipid & Cardiovascular Risk Assessment',
      'Insulin Titration & Lifestyle Guidance',
      'Metabolic Wellness Screening',
    ],
    doctors: ['Dr. Arya Mahapatra (NRSMCH)'],
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
