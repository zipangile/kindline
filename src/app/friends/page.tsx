import { Heart, Users, Share2 } from "lucide-react";
import DonationForm from "@/components/DonationForm";
import prisma from "@/lib/prisma";
import Script from "next/script";

export const dynamic = "force-dynamic";

export default async function FriendsPage(props: {
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

  const donationSettings = {
    lencoPublic:
      process.env.LENCO_PUBLIC_KEY || settings?.lencoPublic || undefined,
    lencoBaseUrl:
      process.env.LENCO_BASE_URL ||
      settings?.lencoBaseUrl ||
      "https://api.lenco.co/access/v2/",
    lencoName: "Kindline Website",
    flutterwavePublic:
      process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY ||
      settings?.flutterwavePublic ||
      undefined,
    flutterwavePlanZMW:
      settings?.flutterwavePlanZMW ||
      process.env.FLUTTERWAVE_PLAN_ZMW ||
      undefined,
    flutterwavePlanUSD:
      settings?.flutterwavePlanUSD ||
      process.env.FLUTTERWAVE_PLAN_USD ||
      undefined,
  };

  const lencoScript = donationSettings.lencoBaseUrl.includes("sandbox")
    ? "https://pay.sandbox.lenco.co/js/v1/inline.js"
    : "https://pay.lenco.co/js/v1/inline.js";

  return (
    <div className="bg-white min-h-screen">
      <Script src="https://checkout.flutterwave.com/v3.js" />
      <Script src={lencoScript} />

      {/* Hero Section */}
      <section className="bg-blue-900 text-white py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-orange/10 rounded-full -ml-48 -mb-48 blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white mb-6 backdrop-blur-sm">
            <Heart className="h-4 w-4 fill-current" />
            <span className="text-sm font-bold tracking-wider uppercase">
              Love · Care · Share
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
            The Friends <span className="text-brand-orange">Experience</span>
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            When you donate, you become more than a donor—you become a{" "}
            <span className="font-bold text-white">Friend of Kindline</span>.
            Join our community of change-makers today.
          </p>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-24 bg-gray-50 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="order-2 lg:order-1">
              <DonationForm settings={donationSettings} />
            </div>

            <div className="order-1 lg:order-2 space-y-12">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  Why Join the Kindline Community?
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  The LoveCareShare experience is one that you definitely must
                  not miss. It&apos;s about collective action and sustainable
                  impact for orphans and widows in Zambia.
                </p>
              </div>

              <div className="grid gap-8">
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-14 h-14 bg-brand-blue rounded-2xl flex items-center justify-center text-white shadow-lg shadow-brand-blue/20">
                    <Heart className="h-7 w-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Love
                    </h3>
                    <p className="text-gray-600 ">
                      Pouring love into the lives of children and widows who
                      need it most, showing them they are not forgotten.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-14 h-14 bg-brand-green rounded-2xl flex items-center justify-center text-white shadow-lg shadow-brand-green/20">
                    <Users className="h-7 w-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Care
                    </h3>
                    <p className="text-gray-600 ">
                      Providing practical support, from school supplies to
                      business starter kits, ensuring sustainable growth.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-14 h-14 bg-brand-purple rounded-2xl flex items-center justify-center text-white shadow-lg shadow-brand-purple/20">
                    <Share2 className="h-7 w-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Share
                    </h3>
                    <p className="text-gray-600 ">
                      Sharing our resources, stories, and impact to inspire a
                      wider movement of compassion.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-blue-600 rounded-[2rem] text-white">
                <p className="text-xl font-bold mb-4">
                  &quot;Become a friend of Kindline Care Foundation by donating
                  today.&quot;
                </p>
                <p className="opacity-90">
                  Every contribution, no matter the size, brings you into our
                  inner circle of supporters.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
