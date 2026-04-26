import Link from 'next/link';
import { Button } from '@/components/ui/Button';

const AboutSnapshot = () => {
  return (
    <>
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-brand-purple font-bold uppercase tracking-widest mb-6 border-l-4 border-brand-orange pl-4">My Care. Your Care. Our Care.</h2>
            <p className="text-xl text-gray-800 mb-6 leading-relaxed font-medium">
              Kindline Care Foundation is dedicated to working in the field of positive change. We focus on community-based interventions that restore dignity and promote sustainable development for those who need it most; orphans, vulnerable children, and widows.
            </p>
            <p className="text-xl text-gray-800 mb-8 leading-relaxed">
              We believe that every individual deserves safety, opportunity, and the chance to thrive.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-brand-blue font-bold uppercase tracking-wider mb-2">About Kindline Care</h2>
              <h3 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-8 leading-tight">
                Dedicated to <span className="text-brand-purple">restoring dignity</span> and creating opportunities.
              </h3>

              <div className="mt-12 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <h4 className="text-2xl font-bold text-gray-900 mb-4">Who We Are</h4>
                <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                  Kindline Care Foundation is a non-profit organisation established to work in the field of positive change in the lives of underprivileged persons, particularly orphans, vulnerable children, and widows.
                </p>
                <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                  The foundation focuses on community-based interventions that restore dignity, create opportunity, and promote sustainable development. We believe in going beyond immediate relief to build long-term resilience and self-reliance.
                </p>
                <Button variant="outline" className="border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white font-bold rounded-full px-8" asChild>
                  <Link href="/about">Read Our Full Story</Link>
                </Button>
              </div>
            </div>
            <div className="bg-brand-blue/5 rounded-3xl h-[500px] flex items-center justify-center border-2 border-dashed border-brand-blue/20">
              <p className="text-brand-blue/40 font-semibold italic">[Impact Image: Community Support]</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutSnapshot;
