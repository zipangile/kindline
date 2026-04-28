import Link from 'next/link';
import { Button } from '@/components/ui/Button';

const AboutSnapshot = ({ imageUrl }: { imageUrl?: string }) => {
  return (
    <>
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-brand-purple font-bold uppercase tracking-widest mb-6 border-l-4 border-brand-orange pl-4">My Care. Your Care. Our Care.</h2>
            <p className="text-xl text-gray-800 mb-6 leading-relaxed font-medium">
              Kindline Care Foundation works at the heart of community transformation in Zambia. We provide a lifeline to those often forgotten, ensuring that orphans, vulnerable children, and widows have the resources they need to thrive.
            </p>
            <p className="text-xl text-gray-800 mb-8 leading-relaxed font-medium">
              By focusing on education and economic empowerment, we don&apos;t just provide temporary relief—we build the foundations for lifelong independence.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-brand-blue font-bold uppercase tracking-wider mb-2 font-mono">Our Commitment</h2>
              <h3 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-8 leading-tight">
                Practical Support for <span className="text-brand-purple">Real People</span>
              </h3>

              <div className="mt-12 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <h4 className="text-2xl font-bold text-gray-900 mb-4">Who We Are</h4>
                <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                  Kindline Care Foundation is a registered non-profit organisation dedicated to lifting underprivileged individuals through sustainable, community-led initiatives.
                </p>
                <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                  We believe that empowerment starts with listening to the community. From drilling wells to funding small businesses, our work is defined by the specific needs of the people we serve.
                </p>
                <Button variant="outline" className="border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white font-bold rounded-full px-8" asChild>
                  <Link href="/about">Read Our Full Story</Link>
                </Button>
              </div>
            </div>
            <div className="rounded-3xl h-[600px] relative overflow-hidden shadow-2xl border-4 border-white">
              {imageUrl ? (
                <img src={imageUrl} alt="Kindline Care Community" className="w-full h-full object-cover" />
              ) : (
                <div className="bg-brand-blue/5 h-full w-full flex items-center justify-center border-2 border-dashed border-brand-blue/20">
                  <p className="text-brand-blue/40 font-semibold italic">[Community Impact Photo]</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutSnapshot;
