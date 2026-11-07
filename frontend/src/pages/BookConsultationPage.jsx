import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
  User,
  Phone,
  Mail,
  Calendar,
  Users,
  Stethoscope,
  ClipboardList,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Edit2,
  Loader2,
} from 'lucide-react';
import { createBooking, getDoctors } from '../services/api';
import PageTransition from '../components/PageTransition';

// ─── Fallback Data ────────────────────────────────────────────────────────────

const FALLBACK_DOCTORS_LIST = [
  { name: 'Dr. D. A. Khan', specialization: 'Pediatrics & Child Health' },
  { name: 'Dr. Saikat Maiti', specialization: 'Cosmetology, Trichology & Hair Transplant' },
  { name: 'Dr. S. Mahapatra', specialization: 'Orthopedics & Joint Care' },
  { name: 'Dr. Sudipto Sit', specialization: 'General Medicine & Pain Management' },
  { name: 'Dr. Alamgir Sekh', specialization: 'General Medicine & Diabetology' },
  { name: 'Dr. Ujjwal Kumar Bera', specialization: 'General Physician & Internal Medicine' },
  { name: 'Dr. Supriyo Bal', specialization: 'General & Laparoscopic Surgery' },
  { name: 'Dr. Swapan Sinha', specialization: 'Neurology & Brain Care' },
  { name: 'Dr. Arya Mahapatra', specialization: 'Diabetes, Thyroid & Endocrinology' },
  { name: 'Dr. Nileswar Das', specialization: 'General Medicine & Critical Care' },
  { name: 'Dr. S K Das', specialization: 'Cardiology' },
  { name: 'Dr. Saubhik Dasukil', specialization: 'Orthopedics' },
  { name: 'Dr. MD. Taquedis Nuri', specialization: 'Gynecology & Obstetrics' },
  { name: 'Dr. Soumen Das', specialization: 'Diabetes & Endocrinology' },
];

const TIME_SLOTS = [
  '9:00 AM – 10:00 AM',
  '10:00 AM – 11:00 AM',
  '11:00 AM – 12:00 PM',
  '12:00 PM – 1:00 PM',
  '3:00 PM – 4:00 PM',
  '4:00 PM – 5:00 PM',
  '5:00 PM – 6:00 PM',
  '6:00 PM – 7:00 PM',
  '7:00 PM – 8:00 PM',
];

const GENDER_OPTIONS = ['Male', 'Female', 'Other'];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function todayStr() {
  return new Date().toISOString().split('T')[0];
}

function StepIndicator({ currentStep, totalSteps }) {
  const labels = ['Personal Details', 'Appointment', 'Review & Confirm'];
  return (
    <div className="flex items-center justify-center gap-0 mb-10 select-none">
      {labels.map((label, idx) => {
        const step = idx + 1;
        const done = step < currentStep;
        const active = step === currentStep;
        return (
          <div key={step} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                  done
                    ? 'bg-emerald-500 text-white'
                    : active
                    ? 'bg-sky-500 text-white ring-4 ring-sky-100'
                    : 'bg-slate-200 text-slate-400'
                }`}
              >
                {done ? <CheckCircle className="w-5 h-5" /> : step}
              </div>
              <span
                className={`hidden sm:block text-xs font-medium mt-0.5 ${
                  active ? 'text-sky-600' : done ? 'text-emerald-600' : 'text-slate-400'
                }`}
              >
                {label}
              </span>
            </div>
            {idx < labels.length - 1 && (
              <div
                className={`h-0.5 w-16 sm:w-24 mx-2 mt-[-18px] sm:mt-[-20px] transition-all duration-300 ${
                  done ? 'bg-emerald-400' : 'bg-slate-200'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function FieldError({ msg }) {
  if (!msg) return null;
  return <p className="text-red-500 text-xs mt-1">{msg}</p>;
}

function FormField({ label, required, icon: Icon, error, children }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className={`relative ${Icon ? '' : ''}`}>
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        )}
        {children}
      </div>
      <FieldError msg={error} />
    </div>
  );
}

const inputClass = (hasIcon, hasError) =>
  `w-full border rounded-xl py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none transition-colors focus:ring-2 focus:ring-sky-200 focus:border-sky-400 ${
    hasIcon ? 'pl-9 pr-3' : 'px-3'
  } ${hasError ? 'border-red-400 bg-red-50' : 'border-slate-200 bg-white'}`;

// ─── Step 1 ───────────────────────────────────────────────────────────────────

function Step1({ data, onChange, errors }) {
  return (
    <motion.div
      key="step1"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.3 }}
      className="grid grid-cols-1 sm:grid-cols-2 gap-5"
    >
      <div className="sm:col-span-2">
        <FormField label="Full Name" required icon={User} error={errors.fullName}>
          <input
            type="text"
            placeholder="Enter your full name"
            value={data.fullName}
            onChange={(e) => onChange('fullName', e.target.value)}
            className={inputClass(true, !!errors.fullName)}
          />
        </FormField>
      </div>

      <FormField label="Phone Number" required icon={Phone} error={errors.phone}>
        <input
          type="tel"
          placeholder="10-digit mobile number"
          value={data.phone}
          onChange={(e) => onChange('phone', e.target.value)}
          maxLength={10}
          className={inputClass(true, !!errors.phone)}
        />
      </FormField>

      <FormField label="Email Address" icon={Mail} error={errors.email}>
        <input
          type="email"
          placeholder="your@email.com (optional)"
          value={data.email}
          onChange={(e) => onChange('email', e.target.value)}
          className={inputClass(true, !!errors.email)}
        />
      </FormField>

      <FormField label="Age" error={errors.age}>
        <input
          type="number"
          placeholder="Your age"
          value={data.age}
          onChange={(e) => onChange('age', e.target.value)}
          min={1}
          max={120}
          className={inputClass(false, !!errors.age) + ' px-3'}
        />
      </FormField>

      <FormField label="Gender" icon={Users} error={errors.gender}>
        <select
          value={data.gender}
          onChange={(e) => onChange('gender', e.target.value)}
          className={inputClass(true, !!errors.gender) + ' appearance-none cursor-pointer'}
        >
          <option value="">Select gender</option>
          {GENDER_OPTIONS.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </FormField>
    </motion.div>
  );
}

// ─── Step 2 ───────────────────────────────────────────────────────────────────

function Step2({ data, onChange, errors, departments = [], doctorsByDept = {} }) {
  const availableDoctors = data.department ? doctorsByDept[data.department] || [] : [];

  const handleDeptChange = (val) => {
    onChange('department', val);
    onChange('doctor', '');
  };

  return (
    <motion.div
      key="step2"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.3 }}
      className="grid grid-cols-1 sm:grid-cols-2 gap-5"
    >
      <FormField label="Department" required icon={Stethoscope} error={errors.department}>
        <select
          value={data.department}
          onChange={(e) => handleDeptChange(e.target.value)}
          className={inputClass(true, !!errors.department) + ' appearance-none cursor-pointer'}
        >
          <option value="">Select department</option>
          {departments.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </FormField>

      <FormField label="Doctor" required icon={User} error={errors.doctor}>
        <select
          value={data.doctor}
          onChange={(e) => onChange('doctor', e.target.value)}
          disabled={!data.department}
          className={
            inputClass(true, !!errors.doctor) +
            ' appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
          }
        >
          <option value="">{data.department ? 'Select doctor' : 'Select department first'}</option>
          {availableDoctors.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </FormField>

      <FormField label="Preferred Date" required icon={Calendar} error={errors.date}>
        <input
          type="date"
          min={todayStr()}
          value={data.date}
          onChange={(e) => onChange('date', e.target.value)}
          className={inputClass(true, !!errors.date) + ' cursor-pointer'}
        />
      </FormField>

      <FormField label="Time Slot" required icon={ClipboardList} error={errors.timeSlot}>
        <select
          value={data.timeSlot}
          onChange={(e) => onChange('timeSlot', e.target.value)}
          className={inputClass(true, !!errors.timeSlot) + ' appearance-none cursor-pointer'}
        >
          <option value="">Select time slot</option>
          {TIME_SLOTS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </FormField>

      <div className="sm:col-span-2">
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          Additional Notes
        </label>
        <textarea
          rows={4}
          placeholder="Any symptoms, prior reports, or special requests…"
          value={data.notes}
          onChange={(e) => onChange('notes', e.target.value)}
          className="w-full border border-slate-200 bg-white rounded-xl px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-400 resize-none transition-colors"
        />
      </div>
    </motion.div>
  );
}

// ─── Step 3 ───────────────────────────────────────────────────────────────────

function Step3({ step1Data, step2Data, onEdit }) {
  const InfoRow = ({ label, value }) => (
    <div className="flex justify-between gap-4 py-2 border-b border-slate-100 last:border-0">
      <span className="text-slate-500 text-sm">{label}</span>
      <span className="text-slate-800 font-medium text-sm text-right">{value || '—'}</span>
    </div>
  );

  return (
    <motion.div
      key="step3"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.3 }}
      className="space-y-5"
    >
      {/* Personal Details Card */}
      <div className="bg-sky-50 rounded-xl p-5 relative">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-slate-700 flex items-center gap-2">
            <User className="w-4 h-4 text-sky-500" /> Personal Details
          </h3>
          <button
            onClick={() => onEdit(1)}
            className="flex items-center gap-1 text-sky-500 text-xs font-semibold hover:text-sky-700 transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" /> Edit
          </button>
        </div>
        <InfoRow label="Full Name" value={step1Data.fullName} />
        <InfoRow label="Phone" value={step1Data.phone} />
        <InfoRow label="Email" value={step1Data.email} />
        <InfoRow label="Age" value={step1Data.age} />
        <InfoRow label="Gender" value={step1Data.gender} />
      </div>

      {/* Appointment Card */}
      <div className="bg-emerald-50 rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-slate-700 flex items-center gap-2">
            <Stethoscope className="w-4 h-4 text-emerald-500" /> Appointment Details
          </h3>
          <button
            onClick={() => onEdit(2)}
            className="flex items-center gap-1 text-emerald-600 text-xs font-semibold hover:text-emerald-800 transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" /> Edit
          </button>
        </div>
        <InfoRow label="Department" value={step2Data.department} />
        <InfoRow label="Doctor" value={step2Data.doctor} />
        <InfoRow label="Preferred Date" value={step2Data.date} />
        <InfoRow label="Time Slot" value={step2Data.timeSlot} />
        {step2Data.notes && <InfoRow label="Notes" value={step2Data.notes} />}
      </div>

      <p className="text-slate-400 text-xs text-center">
        Please verify the details above before confirming your appointment.
      </p>
    </motion.div>
  );
}

// ─── Success Card ─────────────────────────────────────────────────────────────

function SuccessCard({ bookingId }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="text-center py-10 px-4"
    >
      <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5">
        <CheckCircle className="w-10 h-10 text-emerald-500" />
      </div>
      <h2 className="text-2xl font-bold text-slate-800 mb-2">Booking Confirmed!</h2>
      <p className="text-slate-500 mb-4">
        Your appointment has been successfully booked.
      </p>
      {bookingId && (
        <div className="inline-block bg-sky-50 border border-sky-200 rounded-xl px-6 py-3 mb-6">
          <p className="text-xs text-sky-500 font-semibold uppercase tracking-wide">Booking ID</p>
          <p className="text-sky-700 font-bold text-lg mt-0.5">{bookingId}</p>
        </div>
      )}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-left max-w-sm mx-auto">
        <p className="text-amber-700 text-sm font-semibold mb-1">Important</p>
        <ul className="text-amber-600 text-sm space-y-1 list-disc list-inside">
          <li>Please arrive 10 minutes before your slot.</li>
          <li>Carry a valid photo ID and any prior reports.</li>
          <li>For queries, call us at 97335 25031.</li>
        </ul>
      </div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const INITIAL_STEP1 = { fullName: '', phone: '', email: '', age: '', gender: '' };
const INITIAL_STEP2 = { department: '', doctor: '', date: '', timeSlot: '', notes: '' };

export default function BookConsultationPage() {
  const [searchParams] = useSearchParams();
  const [doctorsList, setDoctorsList] = useState(FALLBACK_DOCTORS_LIST);
  const [currentStep, setCurrentStep] = useState(1);
  const [step1Data, setStep1Data] = useState(INITIAL_STEP1);
  const [step2Data, setStep2Data] = useState(INITIAL_STEP2);
  const [step1Errors, setStep1Errors] = useState({});
  const [step2Errors, setStep2Errors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [bookingId, setBookingId] = useState('');

  // Fetch live doctors on load
  useEffect(() => {
    let mounted = true;
    getDoctors()
      .then((data) => {
        if (mounted && Array.isArray(data) && data.length > 0) {
          setDoctorsList(data);
        }
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  const { departments, doctorsByDept } = useMemo(() => {
    const deptMap = {};
    doctorsList.forEach((d) => {
      const dept = d.specialization?.trim() || 'General Medicine';
      if (!deptMap[dept]) deptMap[dept] = [];
      if (!deptMap[dept].includes(d.name)) {
        deptMap[dept].push(d.name);
      }
    });
    return {
      departments: Object.keys(deptMap).sort(),
      doctorsByDept: deptMap,
    };
  }, [doctorsList]);

  // Pre-fill doctor and department if URL params are present
  useEffect(() => {
    const docParam = searchParams.get('doctor');
    const deptParam = searchParams.get('department');
    if (docParam) {
      const matched = doctorsList.find(
        (d) => d.name.toLowerCase() === docParam.toLowerCase()
      );
      if (matched) {
        setStep2Data((p) => ({
          ...p,
          doctor: matched.name,
          department: matched.specialization || p.department,
        }));
      } else {
        setStep2Data((p) => ({
          ...p,
          doctor: docParam,
          department: deptParam || p.department,
        }));
      }
    } else if (deptParam) {
      setStep2Data((p) => ({ ...p, department: deptParam }));
    }
  }, [searchParams, doctorsList]);

  const handleStep1Change = (field, value) => {
    setStep1Data((p) => ({ ...p, [field]: value }));
    if (step1Errors[field]) setStep1Errors((p) => ({ ...p, [field]: '' }));
  };

  const handleStep2Change = (field, value) => {
    setStep2Data((p) => ({ ...p, [field]: value }));
    if (step2Errors[field]) setStep2Errors((p) => ({ ...p, [field]: '' }));
  };

  const validateStep1 = () => {
    const errs = {};
    if (!step1Data.fullName.trim()) errs.fullName = 'Full name is required.';
    if (!step1Data.phone.trim()) errs.phone = 'Phone number is required.';
    else if (!/^\d{10}$/.test(step1Data.phone.trim()))
      errs.phone = 'Enter a valid 10-digit phone number.';
    if (step1Data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(step1Data.email))
      errs.email = 'Enter a valid email address.';
    if (step1Data.age && (Number(step1Data.age) < 1 || Number(step1Data.age) > 120))
      errs.age = 'Enter a valid age (1–120).';
    return errs;
  };

  const validateStep2 = () => {
    const errs = {};
    if (!step2Data.department) errs.department = 'Please select a department.';
    if (!step2Data.doctor) errs.doctor = 'Please select a doctor.';
    if (!step2Data.date) errs.date = 'Please select a preferred date.';
    else if (step2Data.date < todayStr()) errs.date = 'Date cannot be in the past.';
    if (!step2Data.timeSlot) errs.timeSlot = 'Please select a time slot.';
    return errs;
  };

  const handleNext = () => {
    if (currentStep === 1) {
      const errs = validateStep1();
      if (Object.keys(errs).length > 0) {
        setStep1Errors(errs);
        return;
      }
    }
    if (currentStep === 2) {
      const errs = validateStep2();
      if (Object.keys(errs).length > 0) {
        setStep2Errors(errs);
        return;
      }
    }
    setCurrentStep((s) => s + 1);
  };

  const handleBack = () => setCurrentStep((s) => s - 1);

  const handleEdit = (step) => setCurrentStep(step);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const payload = {
        type: 'consultation',
        ...step1Data,
        ...step2Data,
      };
      const result = await createBooking(payload);
      setBookingId(result?.bookingId || result?.id || 'BK' + Date.now());
      setSuccess(true);
      toast.success('Appointment booked successfully!');
    } catch (err) {
      toast.error(err?.message || 'Booking failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageTransition>
      <Helmet>
        <title>Book Consultation – New Life Care Diagnostic Centre | Midnapore</title>
        <meta
          name="description"
          content="Book a doctor consultation at New Life Care Diagnostic Centre, Midnapore. Choose from general medicine, cardiology, orthopedics, gynecology and more."
        />
        <link rel="canonical" href="https://newlifecaredc.in/book-consultation" />
      </Helmet>

      <main className="overflow-x-hidden bg-slate-50 min-h-screen py-10 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-8">
            <span className="inline-block bg-sky-100 text-sky-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
              Book Now
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-800">
              Book a Consultation
            </h1>
            <p className="text-slate-500 mt-2 text-sm">
              Fill in the form below to schedule an appointment with one of our specialists.
            </p>
          </div>

          {!success && <StepIndicator currentStep={currentStep} totalSteps={3} />}

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sm:p-8">
            {success ? (
              <SuccessCard bookingId={bookingId} />
            ) : (
              <>
                <AnimatePresence mode="wait">
                  {currentStep === 1 && (
                    <Step1
                      key="s1"
                      data={step1Data}
                      onChange={handleStep1Change}
                      errors={step1Errors}
                    />
                  )}
                  {currentStep === 2 && (
                    <Step2
                      key="s2"
                      data={step2Data}
                      onChange={handleStep2Change}
                      errors={step2Errors}
                      departments={departments}
                      doctorsByDept={doctorsByDept}
                    />
                  )}
                  {currentStep === 3 && (
                    <Step3
                      key="s3"
                      step1Data={step1Data}
                      step2Data={step2Data}
                      onEdit={handleEdit}
                    />
                  )}
                </AnimatePresence>

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100">
                  <button
                    onClick={handleBack}
                    disabled={currentStep === 1}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" /> Back
                  </button>

                  {currentStep < 3 ? (
                    <button
                      onClick={handleNext}
                      className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-sm font-bold transition-colors shadow"
                    >
                      Continue <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      disabled={submitting}
                      className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold transition-colors shadow disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" /> Booking…
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4" /> Confirm Booking
                        </>
                      )}
                    </button>
                  )}
                </div>
              </>
            )}
          </div>

          <p className="text-center text-slate-400 text-xs mt-6">
            Need help? Call us at{' '}
            <a href="tel:9733525031" className="text-sky-500 font-semibold hover:underline">
              97335 25031
            </a>
          </p>
        </div>
      </main>
    </PageTransition>
  );
}
