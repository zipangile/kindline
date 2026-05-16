'use client';

import { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle } from "lucide-react";
import { submitContactForm } from "./actions";

export default function ContactPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(formData: FormData) {
    setStatus('loading');
    const result = await submitContactForm(formData);

    if (result.success) {
      setStatus('success');
    } else {
      setStatus('error');
      setErrorMessage(result.error || 'An unexpected error occurred.');
    }
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <section className="bg-brand-blue text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6">Get in Touch</h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto font-medium">
            We&apos;d love to hear from you. Whether you want to donate, partner, volunteer, or learn more about our work, every message helps us move closer to transforming lives in Zambia.
          </p>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Info */}
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-10">Contact Information</h2>
              <div className="space-y-10">
                <div className="flex items-start">
                  <div className="bg-brand-blue/10 p-4 rounded-2xl text-brand-blue mr-6">
                    <Mail className="h-7 w-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Email Us</h3>
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm font-bold text-brand-blue uppercase tracking-wider mb-1">General Enquiries</p>
                        <p className="text-gray-700 font-medium">info@kindlinecare.org</p>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-brand-blue uppercase tracking-wider mb-1">Partnerships & Donations</p>
                        <p className="text-gray-700 font-medium">partnerships@kindlinecare.org</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-brand-blue/10 p-4 rounded-2xl text-brand-blue mr-6">
                    <Phone className="h-7 w-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Call Us</h3>
                    <p className="text-gray-700 font-medium">+260 958 582 293</p>
                    <p className="text-gray-700 font-medium">+260 762 595 634</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-brand-blue/10 p-4 rounded-2xl text-brand-blue mr-6">
                    <MapPin className="h-7 w-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Our Location</h3>
                    <div className="space-y-2 text-gray-700 font-medium">
                      <p>Mtendere, Lusaka, Zambia</p>
                      <p className="text-sm text-gray-500 italic">Service Area: 10 Miles, Chibombo District, Central Province</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-16 p-10 bg-gray-50 rounded-[2rem] border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4">Follow Our Work</h3>
                <div className="flex space-x-4">
                  <a href="https://www.facebook.com/YouthCareFoundation/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-blue-800 rounded-full flex items-center justify-center text-white font-bold hover:bg-blue-900 transition-colors">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                  <a href="https://www.linkedin.com/company/kindline-care-foundation/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-[#0077b5] rounded-full flex items-center justify-center text-white font-bold hover:bg-[#0077b5]/90 transition-colors">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                  <a href="https://www.tiktok.com/@kindlinecarefoundation?_r=1&_t=ZS-96IbFVOYkEe" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white font-bold hover:bg-black/90 transition-colors">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 448 512">
                      <path d="M448 209.91a210.06 210.06 0 0 1-122.77-39.25V349.38A162.55 162.55 0 1 1 185 188.31V278.2a74.62 74.62 0 1 0 52.23 71.18V0l88 0a121.18 121.18 0 0 0 1.86 22.17A122.18 122.18 0 0 0 381 102.39a121.43 121.43 0 0 0 67 20.14Z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="flex flex-col border rounded-xl p-4 sm:p-6 lg:p-8 border-gray-200 shadow-sm">
              {status === 'success' ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h2>
                  <p className="text-gray-600 max-w-sm">
                    Thank you for reaching out. Our team has received your message and will get back to you within 1-2 business days.
                  </p>
                  <button
                    onClick={() => setStatus('idle')}
                    className="mt-8 text-brand-blue font-bold hover:underline"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="mb-8 text-xl font-semibold text-gray-800">
                    Send us a message
                  </h2>

                  <form action={handleSubmit}>
                    <div className="grid gap-4 lg:gap-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                        <div>
                          <label htmlFor="firstName" className="block mb-2 text-sm text-gray-700 font-medium">First Name</label>
                          <input type="text" name="firstName" id="firstName" className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm focus:border-brand-blue focus:ring-brand-blue disabled:opacity-50" placeholder="First Name" disabled={status === 'loading'} />
                        </div>

                        <div>
                          <label htmlFor="lastName" className="block mb-2 text-sm text-gray-700 font-medium">Last Name</label>
                          <input type="text" name="lastName" id="lastName" className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm focus:border-brand-blue focus:ring-brand-blue disabled:opacity-50" placeholder="Last Name" disabled={status === 'loading'} />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="email" className="block mb-2 text-sm text-gray-700 font-medium">Email</label>
                        <input type="email" name="email" id="email" autoComplete="email" className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm focus:border-brand-blue focus:ring-brand-blue disabled:opacity-50" placeholder="your@email.com" required disabled={status === 'loading'} />
                      </div>

                      <div>
                        <label htmlFor="message" className="block mb-2 text-sm text-gray-700 font-medium">Details</label>
                        <textarea id="message" name="message" rows={4} className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm focus:border-brand-blue focus:ring-brand-blue disabled:opacity-50" placeholder="How can we help you?" required disabled={status === 'loading'}></textarea>
                      </div>
                    </div>

                    {status === 'error' && (
                      <div className="mt-4 flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg text-sm">
                        <AlertCircle className="h-4 w-4" />
                        {errorMessage}
                      </div>
                    )}

                    <div className="mt-6 grid">
                      <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-brand-blue text-white hover:bg-brand-blue/90 disabled:opacity-50"
                      >
                        {status === 'loading' ? 'Sending...' : 'Send Message'} <Send className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="mt-3 text-center">
                      <p className="text-sm text-gray-500">
                        We&apos;ll get back to you in 1-2 business days.
                      </p>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
