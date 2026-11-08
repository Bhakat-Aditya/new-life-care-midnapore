import { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  Search,
  CheckCircle,
  Loader2,
  FlaskConical,
  X,
  Info,
} from 'lucide-react';
import { createBooking, getTestCatalog } from '../services/api';
import PageTransition from '../components/PageTransition';
import PageHero from '../components/PageHero';

// ─── Constants ────────────────────────────────────────────────────────────────

const COLLECTION_TIME_SLOTS = [
  '7:00 AM – 9:00 AM',
  '9:00 AM – 11:00 AM',
  '11:00 AM – 1:00 PM',
  '2:00 PM – 4:00 PM',
  '4:00 PM – 6:00 PM',
];

function tomorrowStr() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
}

// ─── Field Helpers ────────────────────────────────────────────────────────────

const inputBase =
  'w-full border rounded-xl py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none transition-colors focus:ring-2 focus:ring-sky-200 focus:border-sky-400';

function FieldError({ msg }) {
  return msg ? <p className="text-red-500 text-xs mt-1">{msg}</p> : null;
}

function FormInput({ label, required, icon: Icon, error, children }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none z-10" />
        )}
        {children}
      </div>
      <FieldError msg={error} />
    </div>
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
      <h2 className="text-2xl font-bold text-slate-800 mb-2">Collection Scheduled!</h2>
      <p className="text-slate-500 mb-5">
        Our trained technician will visit your address at your preferred time.
      </p>
      {bookingId && (
        <div className="inline-block bg-sky-50 border border-sky-200 rounded-xl px-6 py-3 mb-6">
          <p className="text-xs text-sky-500 font-semibold uppercase tracking-wide">Booking ID</p>
          <p className="text-sky-700 font-bold text-lg mt-0.5">{bookingId}</p>
        </div>
      )}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-left max-w-sm mx-auto">
        <p className="text-amber-700 text-sm font-semibold mb-1">Instructions</p>
        <ul className="text-amber-600 text-sm space-y-1 list-disc list-inside">
          <li>Please fast for at least 8–10 hours if required.</li>
          <li>Keep your Aadhaar/ID ready for verification.</li>
          <li>Our team will call you 30 minutes before arrival.</li>
          <li>For queries: <a href="tel:9733525031" className="underline font-semibold">97335 25031</a></li>
        </ul>
      </div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const INITIAL_FORM = {
  fullName: '',
  phone: '',
  email: '',
  address: '',
  city: '',
  date: '',
  timeSlot: '',
  instructions: '',
};

export default function BookCollectionPage() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [tests, setTests] = useState([]);
  const [testsLoading, setTestsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTests, setSelectedTests] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [bookingId, setBookingId] = useState('');

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const data = await getTestCatalog();
        setTests(Array.isArray(data) ? data : []);
      } catch {
        setTests([]);
        toast.error('Could not load test catalog.');
      } finally {
        setTestsLoading(false);
      }
    };
    fetchTests();
  }, []);

  const filteredTests = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return tests;
    return tests.filter(
      (t) =>
        t.name?.toLowerCase().includes(q) || t.category?.toLowerCase().includes(q)
    );
  }, [tests, searchQuery]);

  const totalPrice = selectedTests.reduce((acc, t) => acc + (Number(t.price) || 0), 0);

  const handleChange = (field, value) => {
    setForm((p) => ({ ...p, [field]: value }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: '' }));
  };

  const toggleTest = (test) => {
    setSelectedTests((prev) => {
      const id = test.id || test._id || test.name;
      const exists = prev.some((t) => (t.id || t._id || t.name) === id);
      return exists ? prev.filter((t) => (t.id || t._id || t.name) !== id) : [...prev, test];
    });
    if (errors.tests) setErrors((p) => ({ ...p, tests: '' }));
  };

  const isSelected = (test) => {
    const id = test.id || test._id || test.name;
    return selectedTests.some((t) => (t.id || t._id || t.name) === id);
  };

  const removeTest = (test) => {
    const id = test.id || test._id || test.name;
    setSelectedTests((prev) => prev.filter((t) => (t.id || t._id || t.name) !== id));
  };

  const validate = () => {
    const errs = {};
    if (!form.fullName.trim()) errs.fullName = 'Full name is required.';
    if (!form.phone.trim()) errs.phone = 'Phone number is required.';
    else if (!/^\d{10}$/.test(form.phone.trim())) errs.phone = 'Enter a valid 10-digit number.';
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = 'Enter a valid email.';
    if (!form.address.trim()) errs.address = 'Collection address is required.';
    if (!form.date) errs.date = 'Please select a preferred date.';
    else if (form.date < tomorrowStr()) errs.date = 'Date must be from tomorrow onwards.';
    if (!form.timeSlot) errs.timeSlot = 'Please select a time slot.';
    if (selectedTests.length === 0) errs.tests = 'Please select at least one test.';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      toast.error('Please fix the errors before submitting.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        type: 'sample_collection',
        ...form,
        testsRequested: selectedTests.map((t) => ({
          id: t.id || t._id,
          name: t.name,
          price: t.price,
          category: t.category,
        })),
        totalPrice,
      };
      const result = await createBooking(payload);
      setBookingId(result?.bookingId || result?.id || 'HC' + Date.now());
      setSuccess(true);
      toast.success('Home collection booked!');
    } catch (err) {
      toast.error(err?.message || 'Booking failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageTransition>
      <Helmet>
        <title>Book Home Collection – New Life Care Diagnostic Centre | Midnapore</title>
        <meta
          name="description"
          content="Book a home sample collection at New Life Care Diagnostic Centre, Midnapore. Get your blood tests, urine tests, and more collected at your doorstep."
        />
        <link rel="canonical" href="https://newlifecaredc.in/book-collection" />
      </Helmet>

      <PageHero
        badge="Doorstep Healthcare"
        title="Book Home Sample Collection"
        subtitle="Certified phlebotomists collect your diagnostic blood and pathology samples directly at your doorstep in Midnapore."
        breadcrumb={[{ label: 'Home Collection' }]}
      />

      <main className="overflow-x-hidden bg-slate-50 min-h-screen py-12 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">

          {success ? (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sm:p-8">
              <SuccessCard bookingId={bookingId} />
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-8">
              {/* Section 1: Personal Details */}
              <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sm:p-8">
                <h2 className="text-lg font-bold text-slate-700 mb-5 flex items-center gap-2">
                  <User className="w-5 h-5 text-sky-500" /> Personal Details
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="sm:col-span-2">
                    <FormInput label="Full Name" required icon={User} error={errors.fullName}>
                      <input
                        type="text"
                        placeholder="Your full name"
                        value={form.fullName}
                        onChange={(e) => handleChange('fullName', e.target.value)}
                        className={`${inputBase} pl-9 pr-3 ${
                          errors.fullName ? 'border-red-400 bg-red-50' : 'border-slate-200'
                        }`}
                      />
                    </FormInput>
                  </div>

                  <FormInput label="Phone Number" required icon={Phone} error={errors.phone}>
                    <input
                      type="tel"
                      placeholder="10-digit mobile number"
                      value={form.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      maxLength={10}
                      className={`${inputBase} pl-9 pr-3 ${
                        errors.phone ? 'border-red-400 bg-red-50' : 'border-slate-200'
                      }`}
                    />
                  </FormInput>

                  <FormInput label="Email Address" icon={Mail} error={errors.email}>
                    <input
                      type="email"
                      placeholder="Optional"
                      value={form.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      className={`${inputBase} pl-9 pr-3 ${
                        errors.email ? 'border-red-400 bg-red-50' : 'border-slate-200'
                      }`}
                    />
                  </FormInput>
                </div>
              </section>

              {/* Section 2: Collection Address & Timing */}
              <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sm:p-8">
                <h2 className="text-lg font-bold text-slate-700 mb-5 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-sky-500" /> Collection Address & Timing
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="sm:col-span-2">
                    <FormInput
                      label="Full Address"
                      required
                      icon={MapPin}
                      error={errors.address}
                    >
                      <textarea
                        rows={3}
                        placeholder="House no., street, landmark…"
                        value={form.address}
                        onChange={(e) => handleChange('address', e.target.value)}
                        className={`${inputBase} pl-9 pr-3 pt-2.5 resize-none ${
                          errors.address ? 'border-red-400 bg-red-50' : 'border-slate-200'
                        }`}
                      />
                    </FormInput>
                  </div>

                  <FormInput label="City / Area" icon={MapPin} error={errors.city}>
                    <input
                      type="text"
                      placeholder="e.g. Midnapore, Kharagpur"
                      value={form.city}
                      onChange={(e) => handleChange('city', e.target.value)}
                      className={`${inputBase} pl-9 pr-3 border-slate-200`}
                    />
                  </FormInput>

                  <div />

                  <FormInput
                    label="Preferred Date"
                    required
                    icon={Calendar}
                    error={errors.date}
                  >
                    <input
                      type="date"
                      min={tomorrowStr()}
                      value={form.date}
                      onChange={(e) => handleChange('date', e.target.value)}
                      className={`${inputBase} pl-9 pr-3 cursor-pointer ${
                        errors.date ? 'border-red-400 bg-red-50' : 'border-slate-200'
                      }`}
                    />
                  </FormInput>

                  <FormInput
                    label="Preferred Time"
                    required
                    icon={Clock}
                    error={errors.timeSlot}
                  >
                    <select
                      value={form.timeSlot}
                      onChange={(e) => handleChange('timeSlot', e.target.value)}
                      className={`${inputBase} pl-9 pr-3 appearance-none cursor-pointer ${
                        errors.timeSlot ? 'border-red-400 bg-red-50' : 'border-slate-200'
                      }`}
                    >
                      <option value="">Select time slot</option>
                      {COLLECTION_TIME_SLOTS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </FormInput>
                </div>
              </section>

              {/* Section 3: Test Selection */}
              <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sm:p-8">
                <h2 className="text-lg font-bold text-slate-700 mb-1 flex items-center gap-2">
                  <FlaskConical className="w-5 h-5 text-sky-500" /> Select Tests
                </h2>
                <p className="text-slate-400 text-sm mb-4">
                  Search and select the tests you need.
                </p>

                {/* Search */}
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search tests by name or category…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`${inputBase} pl-9 pr-3 border-slate-200`}
                  />
                </div>

                {/* Test List */}
                {testsLoading ? (
                  <div className="space-y-2">
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        className="h-10 bg-slate-100 rounded-lg animate-pulse"
                      />
                    ))}
                  </div>
                ) : filteredTests.length === 0 ? (
                  <div className="text-center py-8 text-slate-400">
                    <FlaskConical className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p className="text-sm">No tests match your search.</p>
                  </div>
                ) : (
                  <div className="max-h-72 overflow-y-auto space-y-1.5 pr-1 scrollbar-thin">
                    {filteredTests.map((test, idx) => {
                      const sel = isSelected(test);
                      const id = test.id || test._id || test.name;
                      return (
                        <label
                          key={id || idx}
                          className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all ${
                            sel
                              ? 'border-sky-400 bg-sky-50'
                              : 'border-slate-100 hover:border-sky-200 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <input
                              type="checkbox"
                              checked={sel}
                              onChange={() => toggleTest(test)}
                              className="w-4 h-4 accent-sky-500 shrink-0"
                            />
                            <span className="text-sm font-medium text-slate-700 truncate">
                              {test.name}
                            </span>
                            <span className="text-xs text-slate-400 shrink-0 hidden sm:inline">
                              {test.category}
                            </span>
                          </div>
                          <span className="text-sm font-bold text-sky-600 shrink-0">
                            ₹{test.price ?? '—'}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                )}

                {errors.tests && <p className="text-red-500 text-xs mt-2">{errors.tests}</p>}

                {/* Selected Summary */}
                {selectedTests.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 bg-sky-50 border border-sky-200 rounded-xl p-4"
                  >
                    <p className="text-xs font-bold text-sky-600 uppercase tracking-wide mb-3">
                      Selected Tests ({selectedTests.length})
                    </p>
                    <ul className="space-y-2">
                      {selectedTests.map((t) => (
                        <li
                          key={t.id || t._id || t.name}
                          className="flex items-center justify-between gap-2"
                        >
                          <span className="text-sm text-slate-700 flex items-center gap-1.5">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            {t.name}
                          </span>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-sm font-semibold text-sky-600">
                              ₹{t.price ?? '—'}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeTest(t)}
                              className="text-slate-400 hover:text-red-400 transition-colors"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                    <div className="border-t border-sky-200 mt-3 pt-3 flex justify-between">
                      <span className="font-bold text-slate-700">Total</span>
                      <span className="font-bold text-sky-700 text-lg">₹{totalPrice}</span>
                    </div>
                  </motion.div>
                )}
              </section>

              {/* Section 4: Special Instructions */}
              <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sm:p-8">
                <h2 className="text-lg font-bold text-slate-700 mb-5 flex items-center gap-2">
                  <Info className="w-5 h-5 text-sky-500" /> Special Instructions
                </h2>
                <textarea
                  rows={4}
                  placeholder="Any special requirements or instructions for the technician…"
                  value={form.instructions}
                  onChange={(e) => handleChange('instructions', e.target.value)}
                  className={`${inputBase} px-3 resize-none border-slate-200`}
                />
              </section>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 disabled:bg-sky-300 text-white font-bold py-3.5 rounded-2xl text-base transition-colors shadow-md disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Booking…
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" /> Confirm Home Collection
                  </>
                )}
              </button>

              <p className="text-center text-slate-400 text-xs">
                By submitting, you agree to our collection policies. Payment is collected at time
                of service.
              </p>
            </form>
          )}
        </div>
      </main>
    </PageTransition>
  );
}
