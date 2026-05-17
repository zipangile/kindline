import Hero from '@/components/Hero';
import AboutSnapshot from '@/components/AboutSnapshot';
import VisionMission from '@/components/VisionMission';
import CoreValues from '@/components/CoreValues';
import ProgramsOverview from '@/components/ProgramsOverview';
import GetInvolvedSnapshot from '@/components/GetInvolvedSnapshot';
import ImpactSnapshot from '@/components/ImpactSnapshot';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import prisma from '@/lib/prisma';
import { subscribe } from '@/app/admin/newsletter/actions';
import { SiteImage, ImpactStat, ImpactStory } from '@prisma/client';

export const dynamic = "force-dynamic";

export default async function Home(props: {
  params: Promise<Record<string, string | string[] | undefined>>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await props.params;
  await props.searchParams;

  let images: SiteImage[] = [];
  let stats: ImpactStat[] = [];
  let stories: ImpactStory[] = [];

  try {
    [images, stats, stories] = await Promise.all([
      prisma.siteImage.findMany(),
      prisma.impactStat.findMany({ orderBy: { order: 'asc' }, take: 4 }),
      prisma.impactStory.findMany({ orderBy: { createdAt: 'desc' }, take: 2 })
    ]);
  } catch (error) {
    console.error('[Home] Error fetching data:', error);
  }

  const getImage = (key: string) => images.find(img => img.key === key)?.url;

  return (
    <div>
      <Hero imageUrl={getImage('homepage_hero') || '/images/child-development.jpg'} />

      <AboutSnapshot imageUrl={getImage('about_snapshot') || '/images/volunteers.jpg'} />

      <ProgramsOverview />

      <ImpactSnapshot stats={stats} stories={stories} />

      <VisionMission />

      <CoreValues />

      <GetInvolvedSnapshot />

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-brand-blue font-bold uppercase tracking-widest mb-4">Get in Touch</h2>
            <h3 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-8">We&apos;d love to hear from you.</h3>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto font-medium">
              Whether you want to donate, partner, volunteer, or learn more about our work, every message helps us move closer to transforming lives in Zambia.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-gray-50 p-10 rounded-[2rem] border border-gray-100">
              <h4 className="text-2xl font-bold text-gray-900 mb-4">General Enquiries</h4>
              <p className="text-gray-600 mb-6 font-medium">For questions about our work and programmes.</p>
              <div className="space-y-3">
                <a href="mailto:info@kindlinecare.org" className="flex items-center gap-3 text-brand-blue font-bold hover:underline">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  info@kindlinecare.org
                </a>
                <p className="flex items-center gap-3 text-gray-700 font-bold">
                  <svg className="w-5 h-5 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  +260 958 582 293
                </p>
                <p className="flex items-center gap-3 text-gray-700 font-bold ml-8">
                  +260 762 595 634
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-10 rounded-[2rem] border border-gray-100">
              <h4 className="text-2xl font-bold text-gray-900 mb-4">Partnerships & Donations</h4>
              <p className="text-gray-600 mb-6 font-medium">For organisations, individuals, and supporters who want to contribute or collaborate.</p>
              <div className="space-y-3">
                <a href="mailto:partnerships@kindlinecare.org" className="flex items-center gap-3 text-brand-blue font-bold hover:underline">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  partnerships@kindlinecare.org
                </a>
                <p className="flex items-center gap-3 text-gray-700 font-bold">
                  <svg className="w-5 h-5 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  +260 958 582 293
                </p>
                <p className="flex items-center gap-3 text-gray-700 font-bold ml-8">
                  +260 762 595 634
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-10 rounded-[2rem] border border-gray-100">
              <h4 className="text-2xl font-bold text-gray-900 mb-4">Our Location</h4>
              <div className="space-y-6">
                <div>

                  <p className="text-gray-700 font-medium flex items-start gap-3">
                    <svg className="w-5 h-5 text-brand-blue shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Mtendere, Lusaka, Zambia
                  </p>
                </div>
                <div>
                  <p className="text-brand-blue font-bold mb-1">Service Area</p>
                  <p className="text-gray-700 font-medium">
                    10 Miles, Chibombo District, Central Province
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gray-50 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-6 text-gray-900">News & Updates</h2>
          <p className="text-lg text-gray-700 mb-10 font-medium">
            Stay informed about our latest activities, events, and announcements.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto" action={subscribe}>
            <input
              name="email"
              type="email"
              placeholder="Your email address"
              className="flex-grow px-6 py-3 rounded-full border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-blue bg-white text-gray-900 font-medium"
              required
            />
            <Button type="submit" className="rounded-full px-8 h-12 font-bold shadow-md">Subscribe</Button>
          </form>
          <div className="mt-8">
            <Button variant="link" asChild>
              <Link href="/news">View Recent Updates &rarr;</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
