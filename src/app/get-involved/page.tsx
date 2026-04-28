import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Landmark, Smartphone, Users, Heart, Building2, ArrowRight } from "lucide-react";
import DonationForm from "@/components/DonationForm";
import prisma from "@/lib/prisma";
import Script from "next/script";
import Link from "next/link";

export default async function GetInvolvedPage() {
  const settings = await prisma.paymentSettings.findFirst();

  const donationSettings = {
    lencoPublic: settings?.lencoPublic || process.env.LENCO_PUBLIC_KEY || undefined,
    flutterwavePublic: settings?.flutterwavePublic || process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY || undefined,
    flutterwavePlanZMW: settings?.flutterwavePlanZMW || process.env.FLUTTERWAVE_PLAN_ZMW || undefined,
    flutterwavePlanUSD: settings?.flutterwavePlanUSD || process.env.FLUTTERWAVE_PLAN_USD || undefined
  };

  const ways = [
    {
      title: "Volunteer With Us",
      description: "Join our team of dedicated volunteers. Whether you have specific skills or just a heart to serve, we have a place for you.",
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
      title: "Partner With Us",
      description: "We partner with companies, churches, and other organisations to amplify our impact. Let's work together for sustainable change.",
      icon: <Building2 className="h-6 w-6 text-blue-600" />,
      href: "/contact",
      action: "Partner Today"
    }
  ];

  return (
    <div className="bg-white">
      <Script src="https://checkout.flutterwave.com/v3.js" />

      {/* Header */}
      <section className="bg-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Get Involved</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Your support transforms lives. Here is how you can make a difference today.
          </p>
        </div>
      </section>

      {/* Donation Section */}
      <section className="py-20 dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Make a Difference</h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                        Join us in our mission to restore dignity and create opportunity. Your financial contribution directly supports our community-based interventions for orphans, vulnerable children, and widows.
                    </p>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full text-blue-600 dark:text-blue-400">
                                <Heart size={20} />
                            </div>
                            <span className="font-medium dark:text-gray-200">Direct Impact on Lives</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full text-blue-600 dark:text-blue-400">
                                <Users size={20} />
                            </div>
                            <span className="font-medium dark:text-gray-200">Community-Led Sustainable Change</span>
                        </div>
                    </div>
                </div>
                <div>
                    <DonationForm settings={donationSettings} />
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
                    <p><span className="text-gray-500 dark:text-gray-400">Account Name:</span><br/><span className="dark:text-gray-200">KINDLINE CARE FOUNDATION</span></p>
                    <p><span className="text-gray-500 dark:text-gray-400">Account No.:</span><br/><span className="dark:text-gray-200">63198221946</span></p>
                    <p><span className="text-gray-500 dark:text-gray-400">Bank:</span><br/><span className="dark:text-gray-200">FIRST NATIONAL BANK (FNB)</span></p>
                    <p><span className="text-gray-500 dark:text-gray-400">Branch:</span><br/><span className="dark:text-gray-200">CAIRO ROAD 260050</span></p>
                    <p><span className="text-gray-500 dark:text-gray-400">Swift Code:</span><br/><span className="dark:text-gray-200">FIRNZMLX</span></p>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-4 flex items-center dark:text-white">
                    <Smartphone className="mr-2 h-5 w-5 text-blue-600" /> Mobile Money (Direct)
                  </h3>
                  <div className="bg-white dark:bg-gray-900 p-4 rounded-lg text-sm shadow-sm space-y-2 border border-transparent dark:border-gray-800">
                    <p className="font-medium text-gray-900 dark:text-gray-100">Name: Astridah Chipowe</p>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">0973635013</p>
                    <p className="text-gray-500 dark:text-gray-400 text-xs mt-4 italic">
                      Please use your name as the reference. Supported currencies: ZMW, USD.
                    </p>
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
