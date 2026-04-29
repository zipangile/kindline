import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Users, Heart, Building2 } from "lucide-react";

const GetInvolvedSnapshot = () => {
  const ways = [
    {
      title: "Partner with Us",
      description: "Join our team of dedicated volunteers and partners. Whether you have specific skills or just a heart to serve, we have a place for you.",
      icon: <Users className="h-6 w-6 text-blue-600" />,
      href: "/volunteer"
    },
    {
      title: "Sponsor a Child or Widow",
      description: "Make a personal impact by sponsoring a specific child or widow. Your sponsorship covers education essentials and small business start-up costs.",
      icon: <Heart className="h-6 w-6 text-blue-600" />,
      href: "/contact"
    },
    {
      title: "Partner with Us",
      description: "We partner with companies, churches, and other organizations to amplify our impact. Let's work together for sustainable change.",
      icon: <Building2 className="h-6 w-6 text-blue-600" />,
      href: "/contact"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Get Involved</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your support transforms lives. Here is how you can make a difference today.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {ways.map((way, index) => (
            <Link key={index} href={way.href}>
              <Card className="h-full border-none shadow-sm bg-gray-50 hover:bg-gray-100 transition-colors">
                <CardHeader>
                  <div className="bg-blue-50 w-12 h-12 flex items-center justify-center rounded-lg mb-4">
                    {way.icon}
                  </div>
                  <CardTitle className="text-xl">{way.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed text-sm">
                    {way.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>


      </div>
    </section>
  );
};

export default GetInvolvedSnapshot;
