import { CheckCircle2, GraduationCap, HeartPulse, Sprout } from "lucide-react";

export default function ProgramsPage() {
  return (
    <div className="bg-white">
      {/* Header */}
      <section className="bg-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Programs</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Empowering lives through targeted, community-based interventions.
          </p>
        </div>
      </section>

      {/* Program 1 */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="flex-1">
              <span className="bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                Economic Empowerment
              </span>
              <h2 className="text-3xl font-bold text-gray-900 mt-4 mb-6">WESAP (Widows Economic Skills Advancement Program)</h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                WESAP is a structured program designed to equip widows with practical and market-driven skills that enable them to generate income, become self-sufficient economically and support themselves and their families.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 mt-1 shrink-0" />
                  <span className="text-gray-700 font-medium">Entrepreneurship, Farming & Business Skills</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 mt-1 shrink-0" />
                  <span className="text-gray-700 font-medium">Financial Literacy</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 mt-1 shrink-0" />
                  <span className="text-gray-700 font-medium">Enterprise Circles (Peer Support Groups)</span>
                </div>
              </div>
            </div>
            <div className="flex-1 bg-gray-100 rounded-2xl h-80 w-full flex items-center justify-center">
              <p className="text-gray-400 italic">[WESAP Program Image]</p>
            </div>
          </div>
        </div>
      </section>

      {/* Program 2 */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row-reverse gap-12 items-center">
            <div className="flex-1">
              <span className="bg-green-100 text-green-800 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                Child Welfare
              </span>
              <h2 className="text-3xl font-bold text-gray-900 mt-4 mb-6">Child Support & Development</h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                We are dedicated to ensuring that every child has the chance to succeed. Our comprehensive program offers education support, literacy development, nutrition, and wellbeing for orphans and vulnerable children.
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
                    <span>Healthcare Focus</span>
                  </div>
                  <ul className="space-y-2 text-gray-600 text-sm">
                    <li>• Nutrition & Well-being - Meal kits</li>
                    <li>• Counselling & life skills sessions</li>
                    <li>• Health & hygiene guidance</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="flex-1 bg-white rounded-2xl h-80 w-full flex items-center justify-center shadow-sm border border-gray-100">
              <p className="text-gray-400 italic">[Child Development Image]</p>
            </div>
          </div>
        </div>
      </section>

      {/* Program 3 */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="flex-1">
              <span className="bg-orange-100 text-orange-800 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                Sustainable Impact
              </span>
              <h2 className="text-3xl font-bold text-gray-900 mt-4 mb-6">Community Development</h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                True change happens when communities are empowered to lead. We collaborate with local leaders and stakeholders to build capacity and sustainable initiatives that benefit the entire community.
              </p>
              <div className="flex items-center space-x-2 text-blue-800 font-bold mb-4">
                <Sprout className="h-5 w-5" />
                <span>Focus Areas</span>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Water and sanitation projects, community health outreach, and infrastructure improvement.
              </p>
            </div>
            <div className="flex-1 bg-gray-100 rounded-2xl h-80 w-full flex items-center justify-center">
              <p className="text-gray-400 italic">[Community Project Image]</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
