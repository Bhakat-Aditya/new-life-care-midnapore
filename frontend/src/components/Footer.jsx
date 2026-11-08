import { Link } from 'react-router-dom'
import { HeartPulse, Phone, MapPin, Clock, Mail } from 'lucide-react'

const quickLinks = [
  { label: 'Home', to: '/' },
  { label: 'Departments', to: '/departments' },
  { label: 'Our Doctors', to: '/doctors' },
  { label: 'Diagnostic Services', to: '/diagnostics' },
  { label: 'Hospital Gallery', to: '/gallery' },
  { label: 'Book Consultation', to: '/book-consultation' },
  { label: 'Home Collection', to: '/book-collection' },
  { label: 'View Reports', to: '/reports' },
  { label: 'Contact Us', to: '/contact' },
]

const services = [
  'Advanced Pathology (Blood, Urine, Stool, Semen, Sputum)',
  'Digital X-Ray & Computerized ECG',
  'EEG & NCV (Neurological Testing)',
  '24-Hour Holter Monitoring',
  'Endoscopy & PFT (Pulmonary Function)',
  'Ultrasonography (USG)',
  '24/7 Home Sample Collection',
  'Oxygen Cylinder Supply & Support',
]

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-sky-500 text-white p-2 rounded-xl">
                <HeartPulse size={22} />
              </div>
              <div className="leading-tight">
                <span className="font-bold text-white text-lg font-nunito block leading-none">
                  New Life Care
                </span>
                <span className="text-xs text-slate-400 leading-none">
                  Diagnostic Centre
                </span>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              Midnapore's most trusted NABL-certified diagnostic centre. Accurate
              reports, expert doctors, and 24/7 service you can rely on.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="bg-emerald-900/50 text-emerald-400 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-800">
                ✓ NABL Certified
              </span>
              <span className="bg-sky-900/50 text-sky-400 text-xs font-semibold px-3 py-1 rounded-full border border-sky-800">
                ⭐ 4.9 Rating
              </span>
              <span className="bg-orange-900/50 text-orange-400 text-xs font-semibold px-3 py-1 rounded-full border border-orange-800">
                🕐 24/7 Open
              </span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-slate-400 text-sm hover:text-sky-400 transition-colors flex items-center gap-1"
                  >
                    <span className="text-sky-600">›</span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Our Services
            </h3>
            <ul className="space-y-2">
              {services.map((service) => (
                <li key={service} className="text-slate-400 text-sm flex items-center gap-1">
                  <span className="text-emerald-500">›</span>
                  {service}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Contact Us
            </h3>
            <div className="space-y-3">
              <div className="flex gap-3">
                <MapPin size={16} className="text-sky-400 mt-0.5 shrink-0" />
                <p className="text-slate-400 text-sm leading-relaxed">
                  Keranitola, Station Road,<br />
                  Near Mahamaya Nursing Home,<br />
                  Rabindra Nagar East,<br />
                  Midnapore, West Bengal 721101
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-sky-400 shrink-0" />
                <div className="text-sm">
                  <a href="tel:9733525031" className="text-slate-400 hover:text-sky-400 transition-colors block">
                    +91 97335 25031
                  </a>
                  <a href="tel:9647393949" className="text-slate-400 hover:text-sky-400 transition-colors block">
                    +91 96473 93949
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-sky-400 shrink-0" />
                <a href="mailto:newlifecaredc@gmail.com" className="text-slate-400 hover:text-sky-400 text-sm transition-colors block">
                  newlifecaredc@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Clock size={16} className="text-sky-400 shrink-0" />
                <div className="text-sm text-slate-400">
                  <p>Open Daily: 24x7 Services Available</p>
                  <p className="text-emerald-400 font-medium">Home Collection: 24/7</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-slate-500 text-xs text-center sm:text-left">
            © {new Date().getFullYear()} New Life Care Diagnostic Centre, Midnapore. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span>Designed with ❤️ for better healthcare</span>
            <span className="text-slate-700">|</span>
            <Link to="/admin/login" className="hover:text-sky-400 transition-colors">
              🔒 Staff / Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
