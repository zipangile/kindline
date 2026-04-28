import Link from 'next/link';
import { Button } from '@/components/ui/Button';

const Hero = ({ imageUrl }: { imageUrl?: string }) => {
  return (
    <section className="relative bg-brand-blue text-white py-24 lg:py-32 overflow-hidden min-h-[600px] flex items-center">
      {imageUrl ? (
        <div
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
          style={{ backgroundImage: `url(${imageUrl})` }}
        >
           <div className="absolute inset-0 bg-black/50"></div>
        </div>
      ) : (
        <div className="absolute inset-0 bg-black/40"></div>
      )}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-7xl font-extrabold mb-8 leading-tight tracking-tight">
            Empowering <span className="text-brand-orange">Futures.</span> <br />
            Lifting <span className="text-brand-green">Communities.</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-12 leading-relaxed max-w-2xl font-medium">
            We provide essential education for vulnerable children and economic tools for widows to build self-reliance and lasting change.
          </p>
          <div className="flex flex-col sm:flex-row gap-5">
            <Button size="lg" className="bg-brand-orange hover:bg-brand-orange/90 text-white border-none px-10 h-14 text-lg font-bold rounded-full shadow-xl transition-all hover:scale-105" asChild>
              <Link href="/get-involved">Donate Now</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-white border-2 border-white hover:bg-white hover:text-brand-blue px-10 h-14 text-lg font-bold rounded-full shadow-lg transition-all" asChild>
              <Link href="/volunteer">Volunteer</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
