import Link from 'next/link';
import { Button } from '@/components/ui/Button';

const AboutSnapshot = () => {
  return (
    <>
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-blue-600 font-semibold uppercase tracking-wider mb-6">My Care. Your Care. Our Care.</h2>
            <p className="text-xl text-gray-700 mb-6 leading-relaxed">
              Kindline Care Foundation is dedicated to working in the field of positive change. We focus on community-based interventions that restore dignity and promote sustainable development for those who need it most; orphans, vulnerable children, and widows.
            </p>
            <p className="text-xl text-gray-700 mb-8 leading-relaxed">
              We believe that every individual deserves safety, opportunity, and the chance to thrive.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-blue-600 font-semibold uppercase tracking-wider mb-2">About Kindline Care</h2>
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                Dedicated to restoring dignity and creating opportunities for the most vulnerable in our society.
              </h3>

              <div className="mt-12">
                <h4 className="text-2xl font-bold text-gray-900 mb-4">Who We Are</h4>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  Kindline Care Foundation is a non-profit organization established to work in the field of positive change in the lives of underprivileged persons, particularly orphans, vulnerable children, and widows.
                </p>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  The foundation focuses on community-based interventions that restore dignity, create opportunity, and promote sustainable development. We believe in going beyond immediate relief to build long-term resilience and self-reliance.
                </p>
                <Button variant="outline" asChild>
                  <Link href="/about">Read Our Full Story</Link>
                </Button>
              </div>
            </div>
            <div className="bg-gray-200 rounded-2xl h-[500px] flex items-center justify-center">
              <p className="text-gray-400 italic">[Impact Image: Community Support]</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutSnapshot;
