import {
  Sprout,
  Landmark,
  HeartPulse,
  GraduationCap,
  Droplets,
  Users,
  CheckCircle2,
} from "lucide-react";
import prisma from "@/lib/prisma";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function ProgramsPage(props: {
  params: Promise<Record<string, string | string[] | undefined>>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await props.params;
  await props.searchParams;
  const livePrograms = await prisma.program.findMany({
    where: { status: "live" },
    orderBy: { createdAt: "asc" },
  });

  const getIcon = (category: string) => {
    switch (category) {
      case "Economic Empowerment":
        return <Sprout size={120} strokeWidth={1} />;
      case "Child Welfare":
        return <HeartPulse size={120} strokeWidth={1} />;
      case "Sustainable Impact":
        return <Landmark size={120} strokeWidth={1} />;
      default:
        return <Sprout size={120} strokeWidth={1} />;
    }
  };

  const getBadgeColor = (category: string) => {
    switch (category) {
      case "Economic Empowerment":
        return "bg-blue-100 text-blue-800";
      case "Child Welfare":
        return "bg-green-100 text-green-800";
      case "Sustainable Impact":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getBgColor = (category: string) => {
    switch (category) {
      case "Economic Empowerment":
        return "bg-blue-50";
      case "Child Welfare":
        return "bg-green-50";
      case "Sustainable Impact":
        return "bg-orange-50";
      default:
        return "bg-gray-50";
    }
  };

  return (
    <div className="bg-white">
      {/* Header */}
      <section className="bg-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Our Programmes
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Empowering lives through targeted, community-based interventions.
          </p>
        </div>
      </section>

      {livePrograms.length > 0 ? (
        livePrograms.map((programme, index) => (
          <section
            key={programme.id}
            className={`py-20 ${index % 2 === 1 ? "bg-gray-50" : ""}`}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div
                className={`flex flex-col lg:flex-row gap-12 items-center ${index % 2 === 1 ? "lg:flex-row-reverse" : ""}`}
              >
                <div className="flex-1">
                  <span
                    className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full ${getBadgeColor(programme.category)}`}
                  >
                    {programme.category}
                  </span>
                  <h2 className="text-3xl font-bold text-gray-900 mt-4 mb-6">
                    {programme.title}
                  </h2>
                  <p className="text-lg text-gray-600 mb-6 leading-relaxed whitespace-pre-wrap">
                    {programme.description}
                  </p>

                  {/* Default sub-features for the main programs if they are the ones identified by title */}
                  {programme.title.includes("WESAP") && (
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <CheckCircle2 className="h-5 w-5 text-blue-600 mt-1 shrink-0" />
                        <span className="text-gray-700">
                          Entrepreneurship, Farming & Business Skills
                        </span>
                      </div>
                      <div className="flex items-start space-x-3">
                        <CheckCircle2 className="h-5 w-5 text-blue-600 mt-1 shrink-0" />
                        <span className="text-gray-700">
                          Financial Literacy
                        </span>
                      </div>
                      <div className="flex items-start space-x-3">
                        <CheckCircle2 className="h-5 w-5 text-blue-600 mt-1 shrink-0" />
                        <span className="text-gray-700">
                          Enterprise Circles (Peer Support Groups)
                        </span>
                      </div>
                    </div>
                  )}

                  {programme.title.includes("Child Support") && (
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
                  )}

                  {programme.title.includes("Community Development") && (
                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center gap-2 bg-gray-200/50 px-4 py-2 rounded-full text-sm font-medium">
                        <Droplets size={16} className="text-blue-500" /> Water &
                        Sanitation
                      </div>
                      <div className="flex items-center gap-2 bg-gray-200/50 px-4 py-2 rounded-full text-sm font-medium">
                        <Users size={16} className="text-blue-500" /> Health
                        Outreach
                      </div>
                      <div className="flex items-center gap-2 bg-gray-200/50 px-4 py-2 rounded-full text-sm font-medium">
                        <Landmark size={16} className="text-blue-500" />{" "}
                        Infrastructure
                      </div>
                    </div>
                  )}
                </div>

                <div
                  className={`flex-1 relative rounded-2xl h-80 w-full flex items-center justify-center overflow-hidden shadow-sm border border-gray-100 ${getBgColor(programme.category)}`}
                >
                  {programme.image ? (
                    <Image
                      src={programme.image}
                      alt={programme.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div
                      className={`${programme.category === "Economic Empowerment" ? "text-blue-200" : programme.category === "Child Welfare" ? "text-green-200" : "text-orange-200"}`}
                    >
                      {getIcon(programme.category)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        ))
      ) : (
        <section className="py-20 text-center">
          <p className="text-gray-500 italic">
            No active programmes found. Please check back soon.
          </p>
        </section>
      )}
    </div>
  );
}
