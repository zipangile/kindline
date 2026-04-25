'use client';

import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <section className="bg-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Get in Touch</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            We would love to hear from you. Reach out to ask questions, learn about our programmes, or simply say hello.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Info */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Contact Information</h2>
              <div className="space-y-8">
                <div className="flex items-start">
                  <div className="bg-blue-100 p-3 rounded-lg text-blue-600 mr-4">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Email Us</h3>
                    <p className="text-gray-600">info@kindlinecare.org</p>
                    <p className="text-gray-600">partnerships@kindlinecare.org</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-blue-100 p-3 rounded-lg text-blue-600 mr-4">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Call Us</h3>
                    <p className="text-gray-600">+260 958 582 293</p>
                    <p className="text-gray-600">+260 762 595 634</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-blue-100 p-3 rounded-lg text-blue-600 mr-4">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Our Location</h3>
                    <p className="text-gray-600">Lusaka, Zambia</p>
                    <p className="text-sm text-gray-500 mt-1 italic">(In-person visits by appointment only)</p>
                  </div>
                </div>
              </div>

              <div className="mt-12 p-8 bg-gray-50 rounded-2xl border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4">Follow Our Work</h3>
                <div className="flex space-x-4">
                  <div className="w-10 h-10 bg-blue-800 rounded-full flex items-center justify-center text-white font-bold cursor-pointer hover:bg-blue-900 transition-colors">f</div>
                  <div className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center text-white font-bold cursor-pointer hover:bg-blue-500 transition-colors">t</div>
                  <div className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center text-white font-bold cursor-pointer hover:bg-pink-700 transition-colors">i</div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="flex flex-col border rounded-xl p-4 sm:p-6 lg:p-8 border-gray-200">
              <h2 className="mb-8 text-xl font-semibold text-gray-800">
                Send us a message
              </h2>

              <form onSubmit={(e) => e.preventDefault()}>
                <div className="grid gap-4 lg:gap-6">
                  {/* Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                    <div>
                      <label htmlFor="hs-firstname-contacts-1" className="block mb-2 text-sm text-gray-700 font-medium">First Name</label>
                      <input type="text" name="hs-firstname-contacts-1" id="hs-firstname-contacts-1" className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none" placeholder="First Name" />
                    </div>

                    <div>
                      <label htmlFor="hs-lastname-contacts-1" className="block mb-2 text-sm text-gray-700 font-medium">Last Name</label>
                      <input type="text" name="hs-lastname-contacts-1" id="hs-lastname-contacts-1" className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none" placeholder="Last Name" />
                    </div>
                  </div>
                  {/* End Grid */}

                  <div>
                    <label htmlFor="hs-email-contacts-1" className="block mb-2 text-sm text-gray-700 font-medium">Email</label>
                    <input type="email" name="hs-email-contacts-1" id="hs-email-contacts-1" autoComplete="email" className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none" placeholder="your@email.com" />
                  </div>

                  <div>
                    <label htmlFor="hs-about-contacts-1" className="block mb-2 text-sm text-gray-700 font-medium">Details</label>
                    <textarea id="hs-about-contacts-1" name="hs-about-contacts-1" rows={4} className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none" placeholder="How can we help you?"></textarea>
                  </div>
                </div>
                {/* End Grid */}

                <div className="mt-6 grid">
                  <button type="submit" className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-800 text-white hover:bg-blue-900 disabled:opacity-50 disabled:pointer-events-none">
                    Send Message <Send className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-3 text-center">
                  <p className="text-sm text-gray-500">
                    We&apos;ll get back to you in 1-2 business days.
                  </p>
                </div>
              </form>
            </div>
            {/* End Contact Form */}
          </div>
        </div>
      </section>
    </div>
  );
}
