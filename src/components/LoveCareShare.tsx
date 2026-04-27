import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Heart, Calendar, MessageSquare } from 'lucide-react';

const LoveCareShare = () => {
  return (
    <section className="py-24 bg-brand-blue/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-brand-purple font-bold uppercase tracking-widest mb-2">Love Care Share</h2>
            <h3 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-8">Friends of Kindline</h3>
            <p className="text-xl text-gray-800 mb-10 leading-relaxed font-medium">
              Love Care Share is Kindline Care Foundation&apos;s giving community for individuals, families, faith-based and organisations who commit to support widows, orphans, and vulnerable children through monthly, quarterly, or annual giving.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 mb-14">
              <Button size="lg" className="bg-brand-purple hover:bg-brand-purple/90 text-white rounded-full px-10 h-14 text-lg font-bold shadow-lg" asChild>
                <Link href="/get-involved">Join Our Community</Link>
              </Button>
            </div>

            <div className="space-y-8">
              <h4 className="text-2xl font-bold text-gray-900 border-b-2 border-brand-orange w-fit pb-2">Why Join Love Care Share?</h4>
              <p className="text-lg text-gray-700 leading-relaxed">
                Being a Friend of the Foundation means you are the backbone of our work. Your consistent commitment allows us to plan ahead, respond to emergencies, and guarantee long-term support for those who depend on us.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-10">
                <div className="flex gap-5">
                  <div className="bg-white p-4 rounded-2xl shadow-md h-fit border border-gray-100">
                    <Calendar className="text-brand-blue h-7 w-7" />
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-900 text-lg mb-2">Consistent Impact</h5>
                    <p className="text-gray-600 leading-relaxed">Monthly giving ensures no child is left without school requirements and no widow without support.</p>
                  </div>
                </div>
                <div className="flex gap-5">
                  <div className="bg-white p-4 rounded-2xl shadow-md h-fit border border-gray-100">
                    <MessageSquare className="text-brand-green h-7 w-7" />
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-900 text-lg mb-2">Community Connection</h5>
                    <p className="text-gray-600 leading-relaxed">Receive exclusive updates, field reports, and invitations to special community events.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square bg-brand-blue rounded-[3rem] overflow-hidden relative z-10 shadow-2xl">
               <div className="absolute inset-0 flex items-center justify-center text-white">
                  <Heart size={240} strokeWidth={1} fill="currentColor" className="opacity-10" />
               </div>
               <div className="absolute inset-0 flex items-center justify-center p-12 text-center text-white">
                 <div className="relative z-20">
                    <h4 className="text-4xl font-extrabold mb-6 leading-tight">Be the backbone of our work</h4>
                    <p className="text-white/90 text-xl font-medium">Your recurring support creates lasting change and transforms lives.</p>
                 </div>
               </div>
            </div>
            <div className="absolute -bottom-10 -right-10 w-72 h-72 bg-brand-orange/20 rounded-[3rem] -z-0"></div>
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-brand-purple/20 rounded-[3rem] -z-0"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoveCareShare;
