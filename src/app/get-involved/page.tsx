import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Landmark, Smartphone, Users, Heart, Building2 } from "lucide-react";

export default function GetInvolvedPage() {
  const ways = [
    {
      title: "Volunteer With Us",
      description: "Join our team of dedicated volunteers. Whether you have specific skills or just a heart to serve, we have a place for you.",
      icon: <Users className="h-6 w-6 text-blue-600" />
    },
    {
      title: "Sponsor a Child or Widow",
      description: "Make a personal impact by sponsoring a specific child or widow. Your sponsorship covers education, healthcare, or business startup costs.",
      icon: <Heart className="h-6 w-6 text-blue-600" />
    },
    {
      title: "Partner With Us",
      description: "We partner with companies, churches, and other organizations to amplify our impact. Let's work together for sustainable change.",
      icon: <Building2 className="h-6 w-6 text-blue-600" />
    }
  ];

  return (
    <div className="bg-white">
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
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="border-2 border-blue-100 shadow-xl overflow-hidden">
            <div className="bg-blue-600 text-white p-8 text-center">
              <h2 className="text-3xl font-bold mb-2">Make an Impact</h2>
              <p className="opacity-90">Select your contribution level and frequency. Your support helps us provide sustainable care.</p>
            </div>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-bold mb-4 flex items-center">
                    <Landmark className="mr-2 h-5 w-5 text-blue-600" /> Bank Transfer
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg text-sm space-y-2 font-mono">
                    <p><span className="text-gray-500">Account Name:</span><br/>KINDLINE CARE FOUNDATION</p>
                    <p><span className="text-gray-500">Account No.:</span><br/>63198221946</p>
                    <p><span className="text-gray-500">Bank:</span><br/>FIRST NATIONAL BANK (FNB)</p>
                    <p><span className="text-gray-500">Branch:</span><br/>CAIRO ROAD 260050</p>
                    <p><span className="text-gray-500">Swift Code:</span><br/>FIRNZMLX</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-4 flex items-center">
                    <Smartphone className="mr-2 h-5 w-5 text-blue-600" /> Mobile Money (Direct)
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg text-sm space-y-2">
                    <p className="font-medium text-gray-900">Name: Astridah Chipowe</p>
                    <p className="text-2xl font-bold text-blue-600">0973635013</p>
                    <p className="text-gray-500 text-xs mt-4 italic">
                      Please use your name as the reference. Supported currencies: ZMW, USD.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Other Ways to Help */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Other Ways to Help</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {ways.map((way, index) => (
              <Card key={index} className="h-full border-none shadow-sm">
                <CardHeader>
                  <div className="bg-blue-50 w-12 h-12 flex items-center justify-center rounded-lg mb-4">
                    {way.icon}
                  </div>
                  <CardTitle className="text-xl">{way.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">
                    {way.description}
                  </p>
                </CardContent>
                <div className="px-6 pb-6 mt-auto">
                  <Button variant="outline" className="w-full">Get Started</Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
