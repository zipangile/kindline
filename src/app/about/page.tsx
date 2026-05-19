import { Heart, Shield, Users, Star, HandHeart } from "lucide-react";
import prisma from '@/lib/prisma';
import AboutSnapshot from '@/components/AboutSnapshot';
import { SiteImage } from '@prisma/client';

export default async function AboutPage(props: {
  params: Promise<Record<string, string | string[] | undefined>>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await props.params;
  await props.searchParams;

  let images: SiteImage[] = [];
  try {
    images = await prisma.siteImage.findMany();
  } catch (error) {
    console.error('[AboutPage] Error fetching images:', error);
  }

  const getImage = (key: string) => images.find(img => img.key === key)?.url;

  const values = [
    { name: "Integrity", description: "Upholding honesty, accountability, and transparency in all we do.", icon: <Shield className="h-6 w-6" /> },
    { name: "Compassion", description: "Serving others with empathy, love, and kindness.", icon: <Heart className="h-6 w-6" /> },
    { name: "Respect", description: "Preserving the dignity and rights of every individual.", icon: <Star className="h-6 w-6" /> },
    { name: "Community", description: "Promoting unity, collaboration, and shared responsibility.", icon: <Users className="h-6 w-6" /> },
    { name: "Service", description: "Transforming care into meaningful action that impacts lives.", icon: <HandHeart className="h-6 w-6" /> },
  ];

  return (
    <div className="bg-white">
      {/* Header */}
      <section className="bg-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About Kindline Care</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Dedicated to restoring dignity and creating opportunities for the most vulnerable in our society.
          </p>
        </div>
      </section>

      {/* Who We Are */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 bg-blue-50 rounded-2xl h-80 flex items-center justify-center">
              <div className="text-blue-100">
                <Users size={160} strokeWidth={1} />
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Who We Are</h2>
              <p className="text-lg text-gray-600 mb-4 leading-relaxed">
                Kindline Care Foundation is a non-profit organization established to work in the field of positive change in the lives of underprivileged persons, particularly orphans, vulnerable children, and widows.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                The foundation focuses on community-based interventions that restore dignity, create opportunity, and promote sustainable development. We believe in going beyond immediate relief to build long-term resilience and self-reliance.
              </p>
            </div>
          </div>
        </div>
      </section>

      <AboutSnapshot imageUrl={getImage('about_snapshot') || '/images/volunteers.jpg'} />

      {/* Vision & Mission */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-blue-900 mb-4">Our Vision</h2>
              <p className="text-lg text-gray-700 leading-relaxed italic">
                &quot;A society where orphans, vulnerable children, and widows live with dignity, safety, and opportunity.&quot;
              </p>
            </div>
            <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-blue-900 mb-4">Our Mission</h2>
              <p className="text-gray-700 leading-relaxed">
                To improve the lives of orphans, vulnerable children, and widows by promoting education, skills development, healthcare, and psychosocial support, while empowering communities to break the cycle of poverty.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              These principles guide every decision we make and every action we take.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="flex flex-col items-center text-center p-6 bg-blue-50 rounded-2xl">
                <div className="mb-4 bg-white p-3 rounded-full text-blue-600 shadow-sm">
                  {value.icon}
                </div>
                <h4 className="font-bold text-xl text-gray-800 mb-2">{value.name}</h4>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* History / Background */}
      <section className="py-20 bg-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-bold mb-6">Our Journey</h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-lg text-blue-100">
                Kindline Care Foundation was born out of a deep concern for the increasing number of vulnerable individuals in our communities who lack basic support systems. We recognized that while charity provides immediate relief, true restoration comes from empowerment and sustainable community integration.
              </p>
              <p className="text-lg text-blue-100 mt-4">
                Since our inception, we have grown from a small group of concerned citizens to registered Non-Profit Organisation , impacting lives through education, skills training, and community-led initiatives.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
