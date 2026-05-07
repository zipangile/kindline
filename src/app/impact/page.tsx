import prisma from "@/lib/prisma";
import ImpactSnapshot from "@/components/ImpactSnapshot";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ImpactPage(props: {
  params: Promise<Record<string, string | string[] | undefined>>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await props.params;
  await props.searchParams;

  const stats = await prisma.impactStat.findMany({
    orderBy: { order: "asc" },
  });

  const stories = await prisma.impactStory.findMany({
    orderBy: { order: "asc" },
  });

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

      {/* Dynamic Metrics and Stories */}
      <ImpactSnapshot stats={stats} stories={stories} />

      {/* CTA */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">
            Be Part of the Impact
          </h2>
          <p className="text-xl text-gray-600 mb-10 leading-relaxed">
            Your generosity fuels these stories of transformation. Join us in
            creating a brighter future for those who need it most.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/get-involved">Donate Now</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/volunteer">Volunteer with us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
