import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Landmark, Users, Heart, Building2, ArrowRight } from "lucide-react";
import DonationForm from "@/components/DonationForm";
import LoveCareShare from "@/components/LoveCareShare";
import prisma from "@/lib/prisma";
import Script from "next/script";
import Link from "next/link";
import { getOrganization, hasFeature } from "@/lib/features";

export const dynamic = "force-dynamic";

export default async function GetInvolvedPage(props: {
  params: Promise<Record<string, string | string[] | undefined>>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await props.params;
  await props.searchParams;
  let settings = null;
  try {
    settings = await prisma.paymentSettings.findFirst();
  } catch (error) {
    console.error("Error fetching payment settings:", error);
  }

  const org = await getOrganization();
  const recurringDonationsEnabled = hasFeature(org, "RECURRING_DONATIONS");

  const donationSettings = {
    lencoPublic: process.env.LENCO_PUBLIC_KEY || settings?.lencoPublic || undefined,
    lencoBaseUrl: process.env.LENCO_BASE_URL || settings?.lencoBaseUrl || 'https://api.lenco.co/access/v2/',
    lencoName: "Kindline Website",
    flutterwavePublic: process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY || settings?.flutterwavePublic || undefined,
    flutterwavePlanZMW: settings?.flutterwavePlanZMW || process.env.FLUTTERWAVE_PLAN_ZMW || undefined,
    flutterwavePlanUSD: settings?.flutterwavePlanUSD || process.env.FLUTTERWAVE_PLAN_USD || undefined
  };

  const ways = [
    {
      title: "Individual Volunteering",
      description: "Join our team of dedicated volunteers and partners. Whether you have specific skills or just a heart to serve, we have a place for you.",
      icon: <Users className="h-6 w-6 text-blue-600" />,
      href: "/volunteer",
      action: "Learn More"
    },
    {
      title: "Sponsor a Child or Widow",
      description: "Make a personal impact by sponsoring a specific child or widow. Your sponsorship covers education essentials and small business start-up costs.",
      icon: <Heart className="h-6 w-6 text-blue-600" />,
      href: "/contact",
      action: "Contact Us"
    },
    {
      title: "Corporate Partnerships",
      description: "We partner with companies, churches, and other organizations to amplify our impact. Let's work together for sustainable change.",
      icon: <Building2 className="h-6 w-6 text-blue-600" />,
      href: "/contact",
      action: "Partner Today"
    }
  ];

  const lencoScript = donationSettings.lencoBaseUrl.includes('sandbox')
    ? "https://pay.sandbox.lenco.co/js/v1/inline.js"
    : "https://pay.lenco.co/js/v1/inline.js";

  return (
    <div className="bg-white">
      <Script src="https://checkout.flutterwave.com/v3.js" />
      <Script src={lencoScript} />

      {/* Header */}
      <section className="bg-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Get Involved</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Your support transforms lives. Here is how you can make a difference today.
          </p>
        </div>
      </section>

      <LoveCareShare />

      {/* Donation Section */}
      <section className="py-24 dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-8">Your Gift, Their Future.</h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed font-medium">
                Every kwacha you give helps a child access education and empowers a widow to rebuild her life with dignity, hope, and independence.
              </p>
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-10 font-bold">
                Here is exactly what your support could do:
              </p>

              <div className="space-y-6 mb-12">
                <div className="p-6 bg-brand-blue/5 rounded-2xl border-l-4 border-brand-blue">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                    <span className="text-brand-blue"> K500 / $25 </span> — School Supplies for one Child
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">Could provide essential school supplies including books, uniform, shoes, and a school bag; giving a child the chance to learn with confidence.</p>
                </div>
                <div className="p-6 bg-brand-green/5 rounded-2xl border-l-4 border-brand-green">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                    <span className="text-brand-green">K1500 / $80</span> — Business Starter Kit
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">Could empower a widow with the tools, resources, and basic training needed to start a small, sustainable business.</p>
                </div>
                <div className="p-6 bg-brand-purple/5 rounded-2xl border-l-4 border-brand-purple">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                    <span className="text-brand-purple">K1000 / $50</span> — Skills Training Support
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">Could support widows’ meetings within the community, where women receive skills training, encouragement, and practical support to rebuild their lives and support their families.</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="bg-brand-blue/10 p-2 rounded-full text-brand-blue">
                    <Heart size={20} />
                  </div>
                  <span className="font-bold text-gray-800 dark:text-gray-200">100% Direct Program Impact</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-brand-green/10 p-2 rounded-full text-brand-green">
                    <Users size={20} />
                  </div>
                  <span className="font-bold text-gray-800 dark:text-gray-200">Community-Verified Interventions</span>
                </div>
              </div>
            </div>
            <div className="lg:sticky lg:top-8">
              <DonationForm settings={donationSettings} recurringDonationsEnabled={recurringDonationsEnabled} />
            </div>
          </div>
        </div>
      </section>

      {/* Alternative Payment Methods */}
      <section className="py-12 bg-gray-50 dark:bg-gray-950 border-y border-gray-100 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center mb-8 dark:text-white">Manual Payment Options</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4 flex items-center dark:text-white">
                <Landmark className="mr-2 h-5 w-5 text-blue-600" /> Bank Transfer
              </h3>
              <div className="bg-white dark:bg-gray-900 p-4 rounded-lg text-sm shadow-sm space-y-2 font-mono border border-transparent dark:border-gray-800">
                <p><span className="text-gray-500 dark:text-gray-400">Account Name:</span><br /><span className="dark:text-gray-200">KINDLINE CARE FOUNDATION</span></p>
                <p><span className="text-gray-500 dark:text-gray-400">Account No.:</span><br /><span className="dark:text-gray-200">63198221946</span></p>
                <p><span className="text-gray-500 dark:text-gray-400">Bank:</span><br /><span className="dark:text-gray-200">FIRST NATIONAL BANK (FNB)</span></p>
                <p><span className="text-gray-500 dark:text-gray-400">Branch:</span><br /><span className="dark:text-gray-200">CAIRO ROAD 260050</span></p>
                <p><span className="text-gray-500 dark:text-gray-400">Swift Code:</span><br /><span className="dark:text-gray-200">FIRNZMLX</span></p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Other Ways to Help */}
      <section className="py-20 dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 dark:text-white">More Ways to Help</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {ways.map((way, index) => (
              <Card key={index} className="h-full border-none shadow-sm bg-gray-50 dark:bg-gray-900 flex flex-col">
                <CardHeader>
                  <div className="bg-blue-50 dark:bg-blue-900/30 w-12 h-12 flex items-center justify-center rounded-lg mb-4">
                    {way.icon}
                  </div>
                  <CardTitle className="text-xl dark:text-white">{way.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                    {way.description}
                  </p>
                  <Link
                    href={way.href}
                    className="inline-flex items-center text-blue-600 dark:text-blue-400 font-semibold hover:gap-2 transition-all"
                  >
                    {way.action} <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
