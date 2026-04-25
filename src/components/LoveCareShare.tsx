import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Heart, Calendar, MessageSquare } from 'lucide-react';

const LoveCareShare = () => {
  return (
    <section className="py-24 bg-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-blue-600 font-bold uppercase tracking-wider mb-2">Love Care Share</h2>
            <h3 className="text-4xl font-extrabold text-gray-900 mb-6">Friends of Kindline</h3>
            <p className="text-xl text-gray-700 mb-8 leading-relaxed">
              Love Care Share is Kindline Care Foundation&apos;s giving community for individuals, families, faith-Based and organisations who commit to support widows, orphans, and vulnerable children through monthly, quarterly, or annual giving.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700" asChild>
                <Link href="/get-involved">Join Our Community</Link>
              </Button>
            </div>

            <div className="space-y-6">
              <h4 className="text-2xl font-bold text-gray-900">Why Join Love Care Share?</h4>
              <p className="text-gray-600 leading-relaxed">
                Being a Friend of the Foundation means you are the backbone of our work. Your consistent commitment allows us to plan ahead, respond to emergencies, and guarantee long-term support for those who depend on us.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
                <div className="flex gap-4">
                  <div className="bg-white p-3 rounded-xl shadow-sm h-fit">
                    <Calendar className="text-blue-600 h-6 w-6" />
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-900 mb-1">Consistent Impact</h5>
                    <p className="text-sm text-gray-600">Monthly giving ensures no child is left without school requirements and no widow without support.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="bg-white p-3 rounded-xl shadow-sm h-fit">
                    <MessageSquare className="text-blue-600 h-6 w-6" />
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-900 mb-1">Community Connection</h5>
                    <p className="text-sm text-gray-600">Receive exclusive updates, field reports, and invitations to special community events.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square bg-blue-600 rounded-3xl overflow-hidden relative z-10">
               <div className="absolute inset-0 flex items-center justify-center text-blue-400">
                  <Heart size={240} strokeWidth={1} fill="currentColor" className="opacity-20" />
               </div>
               <div className="absolute inset-0 flex items-center justify-center p-12 text-center text-white">
                 <div>
                    <h4 className="text-3xl font-bold mb-4">Be the backbone of our work</h4>
                    <p className="text-blue-100 text-lg">Your recurring support creates lasting change.</p>
                 </div>
               </div>
            </div>
            <div className="absolute -bottom-6 -right-6 w-64 h-64 bg-blue-200 rounded-3xl -z-0"></div>
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-blue-800 rounded-3xl -z-0"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoveCareShare;
