import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { BookOpen, Heart, Users } from 'lucide-react';

const ProgramsOverview = () => {
  const programmes = [
    {
      title: "WESAP (Widows Economic Skills Advancement Programme.)",
      subtitle: "Economic Empowerment",
      description: "WESAP is a structured programme designed to equip widows with practical and market- driven skills that enable them to generate income, become self-sufficient economically and support themselves and their families.",
      icon: <Heart className="h-8 w-8 text-brand-blue" />,
      link: "/programmes",
      color: "border-brand-blue"
    },
    {
      title: "Child Support & Development Programme",
      subtitle: "Education & Wellbeing",
      description: "We are dedicated to ensuring that every child has the chance to succeed. Our comprehensive programme offers education support, literacy development, and wellbeing for orphans and vulnerable children, enabling them to become confident and responsible members of their communities.",
      icon: <BookOpen className="h-8 w-8 text-brand-blue" />,
      link: "/programmes",
      color: "border-brand-blue"
    },
    {
      title: "Community Development",
      subtitle: "Empowering communities to lead",
      description: "True change happens when communities are empowered to take ownership of the change process. We partner with communities to build capacity and implement projects for sustainable change. This includes water and sanitation projects, community health outreach, and infrastructure improvement to create a safe environment for the community.",
      icon: <Users className="h-8 w-8 text-brand-blue" />,
      link: "/programmes",
      color: "border-brand-blue"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6">Our Programmes</h2>
        <p className="text-lg text-gray-700 mb-16 max-w-2xl mx-auto font-medium">
          Empowering lives through targeted, community-based interventions.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {programmes.map((programme, index) => (
            <Card key={index} className={`text-left border-t-4 ${programme.color} shadow-lg hover:shadow-2xl transition-all duration-300 bg-white group`}>
              <CardHeader className="pb-4">
                <div className="mb-6 p-4 rounded-2xl bg-gray-50 w-fit group-hover:scale-110 transition-transform duration-300">{programme.icon}</div>
                <CardTitle className="text-2xl font-bold mb-3 group-hover:text-brand-blue transition-colors">{programme.title}</CardTitle>
                <p className="text-sm font-bold text-brand-blue uppercase tracking-wider">{programme.subtitle}</p>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed font-medium">
                  {programme.description}
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="link" className="px-0 text-brand-blue font-bold text-lg hover:no-underline group-hover:translate-x-2 transition-transform" asChild>
                  <Link href={programme.link}>Learn more &rarr;</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProgramsOverview;
