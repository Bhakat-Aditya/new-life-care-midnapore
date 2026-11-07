import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FlaskConical,
  Heart,
  Scan,
  Wind,
  Package,
  Microscope,
  CheckCircle,
  ArrowRight,
  Clock,
  Beaker,
} from 'lucide-react';
import { getTestCatalog, getHealthPackages } from '../services/api';
import PageTransition from '../components/PageTransition';
import PageHero from '../components/PageHero';

const TABS = [
  { key: 'All', label: 'All Tests', icon: Microscope },
  { key: 'Pathology', label: 'Pathology', icon: FlaskConical },
  { key: 'USG', label: 'USG', icon: Scan },
  { key: 'Cardiology', label: 'Cardiology', icon: Heart },
  { key: 'Radiology', label: 'Radiology', icon: Scan },
  { key: 'Pulmonology', label: 'Pulmonology', icon: Wind },
  { key: 'Packages', label: 'Packages', icon: Package },
];

const CATEGORY_BADGE_COLORS = {
  Pathology: 'bg-purple-100 text-purple-700',
  USG: 'bg-blue-100 text-blue-700',
  Cardiology: 'bg-red-100 text-red-700',
  Radiology: 'bg-orange-100 text-orange-700',
  Pulmonology: 'bg-teal-100 text-teal-700',
  default: 'bg-slate-100 text-slate-600',
};

function categoryBadge(category) {
  return CATEGORY_BADGE_COLORS[category] || CATEGORY_BADGE_COLORS.default;
}

// Skeleton loaders
function SkeletonRow() {
  return (
    <tr className="border-b border-slate-100">
      {[...Array(5)].map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 bg-slate-200 rounded animate-pulse w-full" />
        </td>
      ))}
    </tr>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-3 animate-pulse">
      <div className="h-5 bg-slate-200 rounded w-3/4" />
      <div className="h-4 bg-slate-100 rounded w-1/2" />
      <div className="space-y-2 mt-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-3 bg-slate-100 rounded w-full" />
        ))}
      </div>
      <div className="h-9 bg-slate-200 rounded-xl w-full mt-4" />
    </div>
  );
}

function TestTable({ tests }) {
  if (tests.length === 0) {
    return (
      <div className="text-center py-16 text-slate-400">
        <Microscope className="w-10 h-10 mx-auto mb-3 opacity-40" />
        <p className="font-medium">No tests found in this category.</p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-slate-100 shadow-sm">
        <table className="min-w-full bg-white">
          <thead className="bg-sky-50 border-b border-sky-100">
            <tr>
              {['Test Name', 'Category', 'Price', 'Turnaround', 'Sample Type'].map((h) => (
                <th
                  key={h}
                  className="px-5 py-3 text-left text-xs font-semibold text-sky-700 uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tests.map((test, idx) => (
              <motion.tr
                key={test.id || test._id || idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.03, duration: 0.3 }}
                className="border-b border-slate-50 hover:bg-slate-50 transition-colors"
              >
                <td className="px-5 py-3.5 font-medium text-slate-800 text-sm">{test.name}</td>
                <td className="px-5 py-3.5">
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${categoryBadge(test.category)}`}
                  >
                    {test.category}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-sky-600 font-bold text-sm">
                  ₹{test.price ?? 'N/A'}
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-1 text-slate-600 text-sm">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {test.turnaround || test.turnaroundTime || 'Same Day'}
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-1 text-slate-500 text-sm">
                    <Beaker className="w-3.5 h-3.5 text-slate-400" />
                    {test.sampleType || 'Blood'}
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden grid grid-cols-1 gap-3">
        {tests.map((test, idx) => (
          <motion.div
            key={test.id || test._id || idx}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.04, duration: 0.35 }}
            className="bg-white rounded-xl border border-slate-100 shadow-sm p-4"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <p className="font-semibold text-slate-800 text-sm leading-snug">{test.name}</p>
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 ${categoryBadge(test.category)}`}
              >
                {test.category}
              </span>
            </div>
            <div className="flex flex-wrap gap-3 text-xs text-slate-500">
              <span className="font-bold text-sky-600 text-base">₹{test.price ?? 'N/A'}</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {test.turnaround || test.turnaroundTime || 'Same Day'}
              </span>
              <span className="flex items-center gap-1">
                <Beaker className="w-3 h-3" />
                {test.sampleType || 'Blood'}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </>
  );
}

function PackageCard({ pkg, idx }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.08, duration: 0.4 }}
      className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col gap-4"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-slate-800 font-bold text-lg leading-tight">{pkg.name}</h3>
          {pkg.description && (
            <p className="text-slate-500 text-sm mt-1">{pkg.description}</p>
          )}
        </div>
        <div className="bg-sky-50 rounded-xl px-4 py-2 text-center shrink-0">
          <p className="text-sky-600 font-bold text-xl">₹{pkg.price}</p>
          <p className="text-sky-400 text-xs">/ package</p>
        </div>
      </div>

      {pkg.tests && pkg.tests.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
            Included Tests ({pkg.tests.length})
          </p>
          <ul className="space-y-1.5">
            {pkg.tests.map((t, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                {typeof t === 'string' ? t : t.name}
              </li>
            ))}
          </ul>
        </div>
      )}

      <Link
        to="/book-collection"
        className="mt-auto flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-semibold text-sm py-2.5 rounded-xl transition-colors"
      >
        Book Now <ArrowRight className="w-4 h-4" />
      </Link>
    </motion.article>
  );
}

export default function DiagnosticsPage() {
  const [activeTab, setActiveTab] = useState('All');
  const [tests, setTests] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pkgLoading, setPkgLoading] = useState(true);

  useEffect(() => {
    const fetchTests = async () => {
      setLoading(true);
      try {
        const data = await getTestCatalog();
        setTests(Array.isArray(data) ? data : []);
      } catch {
        setTests([]);
      } finally {
        setLoading(false);
      }
    };

    const fetchPackages = async () => {
      setPkgLoading(true);
      try {
        const data = await getHealthPackages();
        setPackages(Array.isArray(data) ? data : []);
      } catch {
        setPackages([]);
      } finally {
        setPkgLoading(false);
      }
    };

    fetchTests();
    fetchPackages();
  }, []);

  const filteredTests =
    activeTab === 'All' || activeTab === 'Packages'
      ? tests
      : tests.filter((t) => t.category === activeTab);

  const breadcrumbs = [{ label: 'Home', href: '/' }, { label: 'Diagnostics & Tests' }];

  return (
    <PageTransition>
      <Helmet>
        <title>Diagnostic Tests & Health Packages – New Life Care Diagnostic Centre | Midnapore</title>
        <meta
          name="description"
          content="Explore our comprehensive list of diagnostic tests including pathology, USG, cardiology, radiology, and pulmonology. Book a test or health package at New Life Care Diagnostic Centre, Midnapore."
        />
        <meta
          name="keywords"
          content="diagnostic tests Midnapore, blood test Midnapore, USG test, ECG, health packages West Bengal, New Life Care"
        />
        <link rel="canonical" href="https://newlifecaredc.in/diagnostics" />
      </Helmet>

      <main className="overflow-x-hidden bg-slate-50 min-h-screen">
        <PageHero
          title="Diagnostic Tests & Packages"
          subtitle="Comprehensive diagnostics with accurate results, delivered with care."
          breadcrumbs={breadcrumbs}
        />

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-2 mb-8">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 border ${
                    isActive
                      ? 'bg-sky-500 text-white border-sky-500 shadow'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-sky-300 hover:text-sky-600'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'Packages' ? (
              <motion.div
                key="packages"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {pkgLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, i) => (
                      <SkeletonCard key={i} />
                    ))}
                  </div>
                ) : packages.length === 0 ? (
                  <div className="text-center py-16 text-slate-400">
                    <Package className="w-10 h-10 mx-auto mb-3 opacity-40" />
                    <p className="font-medium">No health packages available right now.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {packages.map((pkg, idx) => (
                      <PackageCard key={pkg.id || pkg._id || idx} pkg={pkg} idx={idx} />
                    ))}
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {loading ? (
                  <>
                    <div className="hidden md:block overflow-x-auto rounded-xl border border-slate-100 shadow-sm">
                      <table className="min-w-full bg-white">
                        <thead className="bg-sky-50 border-b border-sky-100">
                          <tr>
                            {['Test Name', 'Category', 'Price', 'Turnaround', 'Sample Type'].map((h) => (
                              <th
                                key={h}
                                className="px-5 py-3 text-left text-xs font-semibold text-sky-700 uppercase tracking-wider"
                              >
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {[...Array(8)].map((_, i) => (
                            <SkeletonRow key={i} />
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="md:hidden grid grid-cols-1 gap-3">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 animate-pulse">
                          <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
                          <div className="h-3 bg-slate-100 rounded w-1/2" />
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <TestTable tests={filteredTests} />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Book CTA */}
        <section className="bg-gradient-to-r from-sky-500 to-sky-600 py-14 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h3 className="text-white text-2xl sm:text-3xl font-bold mb-3">
              Book a Home Collection Today
            </h3>
            <p className="text-sky-100 mb-7">
              Our trained technicians will collect your sample at your doorstep.
            </p>
            <Link
              to="/book-collection"
              className="inline-flex items-center gap-2 bg-white text-sky-600 font-bold px-8 py-3 rounded-xl hover:bg-sky-50 transition-colors shadow"
            >
              Book Home Collection <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </section>
      </main>
    </PageTransition>
  );
}
