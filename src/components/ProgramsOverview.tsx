import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { BookOpen, Heart, Users } from 'lucide-react';

const ProgramsOverview = () => {
  const programs = [
    {
      title: "WESAP",
      subtitle: "Widows Economic Skills Advancement Program",
      description: "Provide economic empowerment, vocational skills, and self-reliance opportunities for widows to regain their dignity and independence.",
      icon: <Heart className="h-8 w-8 text-blue-600" />,
      link: "/programs"
    },
    {
      title: "Child Support & Development",
      subtitle: "Holistic care for the vulnerable",
      description: "Ensuring holistic development for vulnerable children through education support, healthcare access, and psychosocial protection.",
      icon: <BookOpen className="h-8 w-8 text-blue-600" />,
      link: "/programs"
    },
    {
      title: "Community Development",
      subtitle: "Strengthening local capacity",
      description: "Strengthening local communities through collaboration, capacity building, and sustainable initiatives that benefit everyone.",
      icon: <Users className="h-8 w-8 text-blue-600" />,
      link: "/programs"
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Primary Programs</h2>
        <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
          We deliver impact through targeted interventions designed to address specific community needs.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {programs.map((program, index) => (
            <Card key={index} className="text-left border-none shadow-md hover:shadow-lg transition-shadow">
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
