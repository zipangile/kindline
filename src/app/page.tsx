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
import prisma from '@/lib/prisma';
import { subscribe } from '@/app/admin/newsletter/actions';

export const dynamic = "force-dynamic";

export default async function Home(props: {
  params: Promise<Record<string, string | string[] | undefined>>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await props.params;
  await props.searchParams;
  const images = await prisma.siteImage.findMany();
  const stats = await prisma.impactStat.findMany({ orderBy: { order: 'asc' }, take: 4 });
  const stories = await prisma.impactStory.findMany({ orderBy: { createdAt: 'desc' }, take: 2 });

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

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-brand-blue rounded-[3rem] p-8 md:p-20 text-center text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange/20 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-purple/20 rounded-full -ml-32 -mb-32"></div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-extrabold mb-8">Be Part of the Impact</h2>
              <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto font-medium">
                Your generosity fuels these stories of transformation. Join us in creating a brighter future for those who need it most.
              </p>
              <div className="flex flex-col sm:flex-row gap-5 justify-center">
                <Button size="lg" className="bg-brand-orange hover:bg-brand-orange/90 text-white border-none px-10 h-14 text-lg font-bold rounded-full" asChild>
                  <Link href="/get-involved">Donate Now</Link>
                </Button>
                <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-brand-blue px-10 h-14 text-lg font-bold rounded-full" asChild>
                  <Link href="/get-involved">Get Involved</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <LoveCareShare />

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
