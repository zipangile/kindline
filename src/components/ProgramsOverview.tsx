import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { BookOpen, Heart, Users } from 'lucide-react';

const ProgramsOverview = () => {
  const programs = [
    {
      title: "WESAP (Widows Economic Skills Advancement Programme.)",
      subtitle: "Economic Empowerment",
      description: "WESAP is a structured programme designed to equip widows with practical and market- driven skills that enable them to generate income, become self-sufficient economically and support themselves and their families.",
      icon: <Heart className="h-8 w-8 text-blue-600" />,
      link: "/programs"
    },
    {
      title: "Child Support & Development Programme",
      subtitle: "Education & Wellbeing",
      description: "We are dedicated to ensuring that every child has the chance to succeed. Our comprehensive programme offers education support, literacy development, and wellbeing for orphans and vulnerable children, enabling them to become confident and responsible members of their communities.",
      icon: <BookOpen className="h-8 w-8 text-blue-600" />,
      link: "/programs"
    },
    {
      title: "Community Development",
      subtitle: "Empowering communities to lead",
      description: "True change happens when communities are empowered to take ownership of the change process. We partner with communities to build capacity and implement projects for sustainable change. This includes water and sanitation projects, community health outreach, and infrastructure improvement to create a safe environment for the community.",
      icon: <Users className="h-8 w-8 text-blue-600" />,
      link: "/programs"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Programs</h2>
        <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
          Empowering lives through targeted, community-based interventions.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {programs.map((program, index) => (
            <Card key={index} className="text-left border-none shadow-md hover:shadow-lg transition-shadow bg-gray-50">
              <CardHeader>
                <div className="mb-4">{program.icon}</div>
                <CardTitle className="text-xl font-bold mb-1">{program.title}</CardTitle>
                <p className="text-sm font-medium text-blue-600 mb-2">{program.subtitle}</p>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  {program.description}
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="link" className="px-0 text-blue-600 font-semibold" asChild>
                  <Link href={program.link}>Learn more &rarr;</Link>
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
