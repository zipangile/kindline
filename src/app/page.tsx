'use client';

import Hero from '@/components/Hero';
import AboutSnapshot from '@/components/AboutSnapshot';
import VisionMission from '@/components/VisionMission';
import CoreValues from '@/components/CoreValues';
import ProgramsOverview from '@/components/ProgramsOverview';
import GetInvolvedSnapshot from '@/components/GetInvolvedSnapshot';
import ImpactSnapshot from '@/components/ImpactSnapshot';
import LoveCareShare from '@/components/LoveCareShare';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function Home() {


  return (
    <div>
      <Hero />

      <AboutSnapshot />



      <VisionMission />

      <CoreValues />

      <ProgramsOverview />

      <GetInvolvedSnapshot />

      <ImpactSnapshot />

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-900 rounded-3xl p-8 md:p-16 text-center text-white relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Be Part of the Impact</h2>
              <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
                Your generosity fuels these stories of transformation. Join us in creating a brighter future for those who need it most.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700" asChild>
                  <Link href="/get-involved">Donate Now</Link>
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900" asChild>
                  <Link href="/get-involved">Get Involved</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <LoveCareShare />

      <section className="py-20 bg-gray-50 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">News & Updates</h2>
          <p className="text-gray-600 mb-8">
            Stay informed about our latest activities, events, and announcements.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Your email address"
              className="flex-grow px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
            <Button type="submit">Subscribe</Button>
          </form>
          <div className="mt-8">
            <Button variant="link" asChild>
              <Link href="/news">View All News &rarr;</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
