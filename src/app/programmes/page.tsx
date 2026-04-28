import { CheckCircle2, GraduationCap, HeartPulse, Sprout, Landmark, Droplets, Users } from "lucide-react";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ProgramsPage() {
  const livePrograms = await prisma.program.findMany({
    where: { status: 'live' },
    orderBy: { createdAt: 'desc' },
  });

  const programmesToDisplay = livePrograms.length > 0 ? livePrograms : [];

  return (
    <div className="bg-white">
      {/* Header */}
      <section className="bg-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Programmes</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Empowering lives through targeted, community-based interventions.
          </p>
        </div>
      </section>

      {/* Programme 1: WESAP */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="flex-1">
              <span className="bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                Economic Empowerment
              </span>
              <h2 className="text-3xl font-bold text-gray-900 mt-4 mb-6">WESAP (Widows Economic Skills Advancement Programme.)</h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                WESAP is a structured programme designed to equip widows with practical and market- driven skills that enable them to generate income, become self-sufficient economically and support themselves and their families.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 mt-1 shrink-0" />
                  <span className="text-gray-700">Entrepreneurship, Farming & Business Skills</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 mt-1 shrink-0" />
                  <span className="text-gray-700">Financial Literacy</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 mt-1 shrink-0" />
                  <span className="text-gray-700">Enterprise Circles (Peer Support Groups)</span>
                </div>
              </div>
            </div>
            <div className="flex-1 bg-blue-50 rounded-2xl h-80 w-full flex items-center justify-center">
               <div className="text-blue-200">
                  <Sprout size={120} strokeWidth={1} />
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Programme 2: Child Support */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row-reverse gap-12 items-center">
            <div className="flex-1">
              <span className="bg-green-100 text-green-800 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                Child Welfare
              </span>
              <h2 className="text-3xl font-bold text-gray-900 mt-4 mb-6">Child Support & Development Programme</h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                We are dedicated to ensuring that every child has the chance to succeed. Our comprehensive programme offers education support, literacy development, and wellbeing for orphans and vulnerable children, enabling them to become confident and responsible members of their communities.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <div className="flex items-center space-x-2 text-blue-800 font-bold mb-3">
                    <GraduationCap className="h-5 w-5" />
                    <span>Education Focus</span>
                  </div>
                  <ul className="space-y-2 text-gray-600 text-sm">
                    <li>• Enrolment Support</li>
                    <li>• School uniforms and shoes</li>
                    <li>• School supplies (books, pens, bags)</li>
                  </ul>
                </div>
                <div>
                  <div className="flex items-center space-x-2 text-blue-800 font-bold mb-3">
                    <HeartPulse className="h-5 w-5" />
                    <span>Wellbeing Focus</span>
                  </div>
                  <ul className="space-y-2 text-gray-600 text-sm">
                    <li>• Nutrition & Well-being support</li>
                    <li>• Counselling & life skills sessions</li>
                    <li>• Literacy development initiatives</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="flex-1 bg-white rounded-2xl h-80 w-full flex items-center justify-center shadow-sm border border-gray-100">
              <div className="text-green-100">
                  <HeartPulse size={120} strokeWidth={1} />
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Programme 3: Community Development */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="flex-1">
              <span className="bg-orange-100 text-orange-800 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                Sustainable Impact
              </span>
              <h2 className="text-3xl font-bold text-gray-900 mt-4 mb-6">Community Development</h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                True change happens when communities are empowered to take ownership of the change process. We partner with communities to build capacity and implement projects for sustainable change.
              </p>
              <p className="text-gray-700 leading-relaxed mb-6">
                This includes water and sanitation projects, community health outreach, and infrastructure improvement to create a safe environment for the community.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full text-sm font-medium">
                  <Droplets size={16} className="text-blue-500" /> Water & Sanitation
                </div>
                <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full text-sm font-medium">
                  <Users size={16} className="text-blue-500" /> Health Outreach
                </div>
                <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full text-sm font-medium">
                  <Landmark size={16} className="text-blue-500" /> Infrastructure
                </div>
              </div>
            </div>
            <div className="flex-1 bg-orange-50 rounded-2xl h-80 w-full flex items-center justify-center">
               <div className="text-orange-200">
                  <Landmark size={120} strokeWidth={1} />
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Programmes from CMS/Database */}
      {programmesToDisplay.length > 0 && (
        <section className="py-20 border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Latest Projects & Initiatives</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {programmesToDisplay.map((programme) => (
                <div key={programme.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="h-48 bg-gray-100 relative">
                    {programme.image ? (
                      <img src={programme.image} alt={programme.title} className="object-cover w-full h-full" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-blue-200">
                        <Sprout size={48} />
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <span className="text-blue-600 text-xs font-bold uppercase tracking-wider">{programme.category}</span>
                    <h3 className="text-xl font-bold mt-2 mb-3">{programme.title}</h3>
                    <p className="text-gray-600 text-sm line-clamp-3">{programme.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
