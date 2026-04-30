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
                  <div className="w-10 h-10 bg-blue-800 rounded-full flex items-center justify-center text-white font-bold cursor-pointer hover:bg-blue-900 transition-colors">f</div>
                  <div className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center text-white font-bold cursor-pointer hover:bg-blue-500 transition-colors">t</div>
                  <div className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center text-white font-bold cursor-pointer hover:bg-pink-700 transition-colors">i</div>
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
