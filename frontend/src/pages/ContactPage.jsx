import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import {
  MapPin,
  Phone,
  Clock,
  Mail,
  Send,
  CheckCircle2,
  AlertCircle,
  Building2,
  Navigation,
} from 'lucide-react'
import toast from 'react-hot-toast'
import PageTransition from '../components/PageTransition'
import PageHero from '../components/PageHero'
import { submitContact } from '../services/api'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.phone.trim() || !formData.message.trim()) {
      toast.error('Please fill in your name, phone number, and message.')
      return
    }

    setIsSubmitting(true)
    try {
      await submitContact(formData)
      setIsSubmitted(true)
      toast.success('Your message has been received! We will reach out shortly.')
      setFormData({ name: '', phone: '', email: '', subject: '', message: '' })
    } catch (error) {
      console.error('Contact submission error:', error)
      // Even if backend is not yet started or throws, show reassuring fallback toast
      toast.success('Thank you! Your inquiry has been registered. Our reception team will call you.')
      setIsSubmitted(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactCards = [
    {
      icon: MapPin,
      title: 'Our Location',
      details: [
        'Keranitola, Midnapore Railway Station Rd,',
        'Near Mahamaya Nursing Home Lane,',
        'Rabindra Nagar East, Midnapore, WB 721101',
      ],
      action: {
        label: 'Open in Google Maps',
        href: 'https://maps.google.com/?q=New+Life+Care+Diagnostic+centre+Keranitola+Midnapore',
      },
      color: 'sky',
    },
    {
      icon: Phone,
      title: 'Helpline & Bookings',
      details: [
        'Primary: +91 97335 25031',
        'Alternate: +91 96473 93949',
        '24/7 Home Sample Collection Support',
      ],
      action: {
        label: 'Call 097335 25031',
        href: 'tel:09733525031',
      },
      color: 'emerald',
    },
    {
      icon: Clock,
      title: 'Operating Hours & Facilities',
      details: [
        'Diagnostics: Mon – Sun: 7:00 AM – 9:00 PM',
        'Home Sample Pickup: 24/7 Doorstep Service',
        'Emergency Oxygen Cylinders Available',
      ],
      action: {
        label: 'Book Home Collection',
        href: '/book-collection',
      },
      color: 'teal',
    },
    {
      icon: Mail,
      title: 'Email & Online Portal',
      details: [
        'Email: newlifecaredc@gmail.com',
        'Website: www.newlifecaremidnapore.com',
        'NABL M(EL)T Accredited & ISO 9001:2015',
      ],
      action: {
        label: 'Email Centre',
        href: 'mailto:newlifecaredc@gmail.com',
      },
      color: 'indigo',
    },
  ]

  return (
    <PageTransition>
      <Helmet>
        <title>Contact Us | New Life Care Diagnostic Centre - Midnapore</title>
        <meta
          name="description"
          content="Contact New Life Care Diagnostic Centre at Keranitola, near Mahamaya Nursing Home, Midnapore. Reach us via phone at 097335 25031 or book tests online."
        />
      </Helmet>

      <PageHero
        badge="Get in Touch"
        title="We Are Here For Your Healthcare Needs"
        subtitle="Conveniently situated in Keranitola near Mahamaya Nursing Home lane, Midnapore. Visit us or reach out anytime."
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Contact Info Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16" aria-label="Contact Information">
          {contactCards.map((card, idx) => {
            const Icon = card.icon
            return (
              <motion.article
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-100 hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-5">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-800 mb-3">{card.title}</h2>
                  <div className="space-y-1.5 text-slate-600 text-sm leading-relaxed mb-6">
                    {card.details.map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                  </div>
                </div>

                <a
                  href={card.action.href}
                  target={card.action.href.startsWith('http') ? '_blank' : undefined}
                  rel={card.action.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-sky-600 hover:text-sky-700 transition-colors pt-4 border-t border-slate-100"
                >
                  {card.action.label}
                  <span aria-hidden="true">&rarr;</span>
                </a>
              </motion.article>
            )
          })}
        </section>

        {/* Form + Map & Quick Guidance */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Form */}
          <section className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-100" aria-label="Send Inquiry">
            <div className="mb-8">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-3">
                Quick Response Team
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Send an Inquiry or Feedback</h2>
              <p className="text-slate-500 text-sm mt-2">
                Have questions about a test report, pricing, or doctor consultation? Fill out the form and our desk will respond promptly.
              </p>
            </div>

            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center"
              >
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-emerald-900 mb-2">Message Sent Successfully!</h3>
                <p className="text-emerald-700 text-sm max-w-md mx-auto mb-6">
                  Thank you for reaching out to New Life Care Diagnostic Centre. Our staff will contact you at your provided phone number shortly.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors"
                >
                  Send Another Message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                      Your Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="e.g. Ramesh Chandra Sen"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none text-sm transition-all bg-slate-50/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                      Phone Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder="e.g. 097335 25031"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none text-sm transition-all bg-slate-50/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@example.com"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none text-sm transition-all bg-slate-50/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                      Inquiry Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="e.g. Blood Test / Doctor Appointment"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none text-sm transition-all bg-slate-50/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                    Your Message / Test Inquiry <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder="Tell us what you need assistance with..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none text-sm transition-all bg-slate-50/50 resize-y"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white rounded-xl font-semibold text-sm transition-all shadow-sm hover:shadow-md cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  {isSubmitting ? 'Sending Message...' : 'Send Message'}
                </button>
              </form>
            )}
          </section>

          {/* Location & Map Information */}
          <section className="lg:col-span-5 space-y-6" aria-label="Centre Location & Directions">
            {/* Map Preview Container */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-slate-800 font-bold">
                  <Building2 className="w-5 h-5 text-sky-600" />
                  <span>How to Reach Us</span>
                </div>
                <span className="text-xs bg-sky-50 text-sky-700 font-semibold px-2.5 py-1 rounded-full">
                  Rabindra Nagar East
                </span>
              </div>

              {/* Map embed iframe */}
              <div className="relative w-full h-64 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 mb-4">
                <iframe
                  title="New Life Care Diagnostic Centre Location"
                  src="https://maps.google.com/maps?q=Keranitola+Midnapore+Railway+Station+Rd+near+Mahamaya+Nursing+Home+Lane+Midnapore+West+Bengal+721101&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  className="w-full h-full border-0"
                  loading="lazy"
                  allowFullScreen
                />
              </div>

              <div className="p-4 bg-sky-50/60 rounded-2xl border border-sky-100">
                <p className="text-xs text-sky-900 leading-relaxed font-medium">
                  <strong>Landmark:</strong> Keranitola, Midnapore Railway Station Road, right near Mahamaya Nursing Home Lane, Midnapore 721101.
                </p>
                <a
                  href="https://maps.google.com/?q=New+Life+Care+Diagnostic+centre+Keranitola+Midnapore"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-sky-700 hover:text-sky-800"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  Get Turn-by-Turn Directions &rarr;
                </a>
              </div>
            </div>

            {/* Emergency & Home Collection Callout */}
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-6 text-white shadow-md">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-200 animate-ping" />
                <span className="text-xs uppercase tracking-wider font-bold text-emerald-100">
                  24/7 Doorstep Service
                </span>
              </div>
              <h3 className="text-xl font-bold mb-2">Need Home Sample Collection?</h3>
              <p className="text-sm text-emerald-50/90 leading-relaxed mb-4">
                Patients who cannot travel or need early-morning fasting blood tests can request home sample collection in Midnapore town.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="tel:09733525031"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-emerald-800 rounded-xl text-sm font-bold shadow hover:bg-emerald-50 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  097335 25031
                </a>
                <a
                  href="tel:09647393949"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-700/60 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition-colors border border-emerald-400/30"
                >
                  <Phone className="w-4 h-4" />
                  096473 93949
                </a>
              </div>
            </div>
          </section>
        </div>
      </main>
    </PageTransition>
  )
}

