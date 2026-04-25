import { Button } from '@/components/ui/Button';
import Link from 'next/link';

const ImpactSnapshot = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Impact</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            See the tangible difference your support makes in real lives.
          </p>
        </div>

        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100">
           <div className="max-w-3xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Changed Lives Journal</h3>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Behind every number is a story of resilience, hope, and transformation.
              </p>
              <Button variant="outline" asChild>
                <Link href="/impact">Read Impact Stories</Link>
              </Button>
           </div>
        </div>
      </div>
    </section>
  );
};

export default ImpactSnapshot;
