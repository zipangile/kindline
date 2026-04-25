import Link from 'next/link';
import { Button } from '@/components/ui/Button';

const AboutSnapshot = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-blue-600 font-semibold uppercase tracking-wider mb-2">My Care. Your Care. Our Care.</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
              Dedicated to Working in the Field of Positive Change
            </h3>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              Kindline Care Foundation is dedicated to working in the field of positive change. We focus on community-based interventions that restore dignity and promote sustainable development for those who need it most—orphans, vulnerable children, and widows.
            </p>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              We believe that every individual deserves safety, opportunity, and the chance to thrive. Our approach goes beyond immediate relief to build long-term resilience.
            </p>
            <Button variant="outline" asChild>
              <Link href="/about">Learn More About Us</Link>
            </Button>
          </div>
          <div className="bg-gray-100 rounded-2xl h-96 flex items-center justify-center">
            <p className="text-gray-400 italic">[Impact Image: Community Support]</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSnapshot;
