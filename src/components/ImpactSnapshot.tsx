import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import * as LucideIcons from "lucide-react";
import Image from "next/image";

interface Stat {
  id: string;
  label: string;
  value: string;
  description: string | null;
  icon: string | null;
}

interface Story {
  id: string;
  title: string;
  content: string;
  category: string;
  author: string;
  authorRole: string | null;
  image: string | null;
}

const ImpactSnapshot = ({ stats, stories }: { stats: Stat[], stories: Story[] }) => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">Our Impact</h2>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto font-medium">
            Real change. Real lives transformed.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
          {stats.map((stat) => {
            const iconKey = stat.icon as keyof typeof LucideIcons;
            const Icon = (stat.icon && LucideIcons[iconKey]) ? (LucideIcons[iconKey] as LucideIcons.LucideIcon) : LucideIcons.BarChart;
            return (
              <Card key={stat.id} className="text-center border-none bg-brand-blue/5 shadow-none hover:bg-brand-blue/10 transition-colors group p-8 rounded-[2rem]">
                <CardHeader className="flex flex-col items-center">
                  <div className="mb-6 p-4 bg-white rounded-2xl shadow-sm group-hover:scale-110 transition-transform">
                    <Icon className="h-10 w-10 text-brand-blue" />
                  </div>
                  <div className="text-5xl font-extrabold text-brand-blue mb-2">{stat.value}</div>
                  <CardTitle className="text-lg uppercase tracking-widest text-gray-600 font-bold">{stat.label}</CardTitle>
                </CardHeader>
                {stat.description && (
                  <CardContent>
                    <p className="text-sm text-gray-600 font-medium">
                      {stat.description}
                    </p>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>

        <div className="space-y-12">
          <div className="text-center">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Changed Lives Journal</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">Behind every number is a story of resilience, hope, and transformation.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {stories.length > 0 ? (
              stories.map((story) => (
                <div key={story.id} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                  {story.image && (
                    <div className="relative h-48 w-full mb-6 rounded-xl overflow-hidden">
                      <Image src={story.image} alt={story.title} fill className="object-cover" />
                    </div>
                  )}
                  <p className="text-brand-blue font-bold mb-2 uppercase tracking-wide text-xs">{story.category}</p>
                  <h4 className="text-2xl font-bold mb-4 text-gray-900">{story.title}</h4>
                  <p className="text-gray-700 italic leading-relaxed mb-6 font-medium">
                    &quot;{story.content}&quot;
                  </p>
                  <div className="mt-auto">
                    <p className="font-extrabold text-gray-900">— {story.author}</p>
                    <p className="text-sm text-brand-orange font-bold uppercase tracking-wider">{story.authorRole}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full p-12 border-2 border-dashed rounded-3xl text-center text-gray-400 font-medium">
                Real testimonials will appear here once added in the dashboard.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImpactSnapshot;
