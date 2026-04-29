import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Users, GraduationCap, Briefcase, Droplets } from "lucide-react";

export default async function ImpactPage(props: {
  params: Promise<Record<string, string | string[] | undefined>>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await props.params;
  await props.searchParams;
  const metrics = [
    { label: "Families Supported", value: "450+", description: "Provided with food, shelter, or financial aid.", icon: <Users className="h-8 w-8 text-blue-600" /> },
    { label: "Children in School", value: "1,200", description: "Tuition paid and uniforms provided.", icon: <GraduationCap className="h-8 w-8 text-blue-600" /> },
    { label: "Businesses Started", value: "85", description: "Widow-led small businesses launched.", icon: <Briefcase className="h-8 w-8 text-blue-600" /> },
    { label: "Clean Water Projects", value: "5", description: "Community wells and sanitation blocks built.", icon: <Droplets className="h-8 w-8 text-blue-600" /> },
  ];

  return (
    <div className="bg-white">
      {/* Header */}
      <section className="bg-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Impact</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            See the tangible difference your support makes in real lives.
          </p>
        </div>
      </section>

      {/* Metrics */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {metrics.map((metric, index) => (
              <Card key={index} className="text-center border-none bg-gray-50 shadow-none">
                <CardHeader className="flex flex-col items-center">
                  <div className="mb-4">{metric.icon}</div>
                  <div className="text-4xl font-bold text-gray-900 mb-1">{metric.value}</div>
                  <CardTitle className="text-sm uppercase tracking-wider text-blue-600">{metric.label}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    {metric.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stories */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Changed Lives Journal</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Behind every number is a story of resilience, hope, and transformation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-white p-8 rounded-2xl shadow-sm">
              <div className="h-48 bg-blue-50 rounded-xl mb-6 flex items-center justify-center">
                 <Briefcase size={80} className="text-blue-200" />
              </div>
              <p className="text-blue-600 font-bold mb-2 uppercase tracking-wide text-xs">Widow Empowerment</p>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Building a Future through WESAP</h3>
              <p className="text-gray-600 italic leading-relaxed mb-6">
                &quot;I lost my husband and thought the world had ended for me and my four children. Kindline Care didn&apos;t just give me food; they gave me the skills to run a tailoring business. Today, I am proud to say I am paying my children&apos;s school fees.&quot;
              </p>
              <p className="font-bold text-gray-900">— Mary M., WESAP Beneficiary</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm">
              <div className="h-48 bg-green-50 rounded-xl mb-6 flex items-center justify-center">
                <GraduationCap size={80} className="text-green-200" />
              </div>
              <p className="text-blue-600 font-bold mb-2 uppercase tracking-wide text-xs">Education Support</p>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">A Chance to Learn and Dream</h3>
              <p className="text-gray-600 italic leading-relaxed mb-6">
                &quot;I used to stay home while other children went to school because I didn&apos;t have a uniform or books. Now, I have everything I need, and my favorite subject is science. I want to be a doctor one day.&quot;
              </p>
              <p className="font-bold text-gray-900">— Junior S., Grade 5 Student</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">Be Part of the Impact</h2>
          <p className="text-xl text-gray-600 mb-10 leading-relaxed">
            Your generosity fuels these stories of transformation. Join us in creating a brighter future for those who need it most.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
                <Link href="/get-involved">Donate Now</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
                <Link href="/volunteer">Volunteer</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
