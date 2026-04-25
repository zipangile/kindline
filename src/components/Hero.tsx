import Link from 'next/link';
import { Button } from '@/components/ui/Button';

const Hero = () => {
  return (
    <section className="relative bg-blue-900 text-white py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-opacity-50 bg-black"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Restoring Dignity. Creating Opportunity.
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-10 leading-relaxed">
            Join us in our mission to improve the lives of orphans, vulnerable children, and widows through compassion and sustainable action.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white border-none" asChild>
              <Link href="/get-involved">Donate Now</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10" asChild>
              <Link href="/get-involved">Get Involved</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
