import VolunteerForm from "./VolunteerForm";
import Image from 'next/image';
import prisma from "@/lib/prisma";
import { resolveSiteImage } from '@/lib/site-images';

export const dynamic = "force-dynamic";

export default async function VolunteerPage(props: {
  params: Promise<Record<string, string | string[] | undefined>>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await props.params;
  await props.searchParams;

  let actionImage: string | undefined;
  try {
    const siteImage = await prisma.siteImage.findUnique({
      where: { key: 'volunteer_action' }
    });
    actionImage = resolveSiteImage(siteImage ? [siteImage] : [], 'volunteer_action');
  } catch (error) {
    console.error('[VolunteerPage] Error fetching action image:', error);
  }

  return (
    <div className="bg-white">
      {/* Header */}
      <section className="bg-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Volunteer With Us</h1>
          <p className="text-xl text-purple-100 max-w-3xl mx-auto">
            Join our team of dedicated volunteers. Whether you have specific skills or just a heart to serve, we have a place for you.
          </p>
        </div>
      </section>

      {/* Volunteer Form Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-4 sm:p-8 rounded-2xl shadow-xl border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Become a Volunteer</h2>
            <VolunteerForm />
          </div>
        </div>
      </section>

      {/* Why Volunteer Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Volunteer?</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-brand-blue mb-2">Impact Lives Directly</h3>
                  <p className="text-gray-600">Your time and skills directly contribute to the well-being of orphans, vulnerable children, and widows in our community.</p>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-brand-green mb-2">Personal Growth</h3>
                  <p className="text-gray-600">Develop new skills, gain experience in the non-profit sector, and meet like-minded individuals dedicated to service.</p>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-brand-orange mb-2">Community Building</h3>
                  <p className="text-gray-600">Be part of a movement that values dignity, opportunity, and sustainable community-led change.</p>
                </div>
              </div>
            </div>
            {actionImage && <div className="relative h-96 w-full">
              <Image
                src={actionImage}
                alt="Volunteers working together"
                fill
                className="rounded-2xl shadow-lg object-cover"
              />
            </div>}
          </div>
        </div>
      </section>
    </div>
  );
}
