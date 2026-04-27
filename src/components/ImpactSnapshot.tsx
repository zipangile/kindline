import { Button } from '@/components/ui/Button';
import Link from 'next/link';

const ImpactSnapshot = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">Our Impact</h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto font-medium">
            See the tangible difference your support makes in real lives through our committed interventions.
          </p>
        </div>

        <div className="bg-gradient-to-br from-brand-blue to-brand-purple p-8 md:p-16 rounded-[3rem] shadow-2xl text-white relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48 blur-3xl group-hover:bg-white/20 transition-colors duration-700"></div>
           <div className="relative z-10 max-w-3xl">
              <h3 className="text-3xl md:text-4xl font-extrabold mb-6">Changed Lives Journal</h3>
              <p className="text-xl text-white/90 mb-10 leading-relaxed font-medium">
                Behind every number is a story of resilience, hope, and transformation. Discover how we are making a difference together.
              </p>
              <Button variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-brand-blue font-bold rounded-full px-10 h-14 text-lg shadow-lg" asChild>
                <Link href="/impact">Read Impact Stories</Link>
              </Button>
           </div>
        </div>
      </div>
    </section>
  );
};

export default ImpactSnapshot;
