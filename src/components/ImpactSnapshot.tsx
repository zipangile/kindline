import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Link from 'next/link';
import * as LucideIcons from "lucide-react";

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
  author: string;
  authorRole: string | null;
}

const ImpactSnapshot = ({ stats, stories }: { stats: Stat[], stories: Story[] }) => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">Our Impact</h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto font-medium">
            See the tangible difference your support makes in real lives.
          </p>
        </div>

        {stats.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
            {stats.map((stat) => {
              const iconKey = stat.icon as keyof typeof LucideIcons;
              const Icon = (stat.icon && LucideIcons[iconKey]) ? (LucideIcons[iconKey] as LucideIcons.LucideIcon) : LucideIcons.BarChart;
              return (
                <Card key={stat.id} className="text-center border-none bg-gray-50 shadow-none hover:bg-gray-100 transition-colors group">
                  <CardHeader className="flex flex-col items-center">
                    <div className="mb-4 p-3 bg-white rounded-2xl shadow-sm group-hover:scale-110 transition-transform">
                      <Icon className="h-8 w-8 text-brand-blue" />
                    </div>
                    <div className="text-4xl font-extrabold text-gray-900 mb-1">{stat.value}</div>
                    <CardTitle className="text-sm uppercase tracking-widest text-brand-orange font-bold">{stat.label}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 font-medium">
                      {stat.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">


          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 px-4">Changed Lives Journal</h3>
            <p className="text-gray-600 px-4 mb-4">Behind every number is a story of resilience, hope, and transformation.</p>
            {stories.length > 0 ? (
              stories.map((story) => (
                <div key={story.id} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <p className="text-gray-700 italic leading-relaxed mb-6 font-medium text-lg">
                    &quot;{story.content.length > 200 ? story.content.substring(0, 200) + '...' : story.content}&quot;
                  </p>
                  <div>
                    <p className="font-extrabold text-gray-900">— {story.author}</p>
                    <p className="text-sm text-brand-orange font-bold uppercase tracking-wider">{story.authorRole}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 border-2 border-dashed rounded-3xl text-center text-gray-400 font-medium">
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
