export const dynamic = "force-dynamic";

import prisma from '@/lib/prisma';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { getOrganization } from '@/lib/features';
import Script from 'next/script';
import PayButtonClient from './PayButtonClient';

export default async function VolunteerPayPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const org = await getOrganization();
  if (org.volunteerSignupFee <= 0) {
    redirect('/dashboard/volunteer');
  }

  const volunteer = await prisma.volunteer.findUnique({
    where: { supabaseUserId: user.id },
  });

  if (!volunteer) {
    redirect('/volunteer');
  }

  let settings = null;
  try {
    settings = await prisma.paymentSettings.findFirst();
  } catch (error) {
    console.error("Error fetching payment settings:", error);
  }

  const donationSettings = {
    lencoPublic: process.env.LENCO_PUBLIC_KEY || settings?.lencoPublic || '',
    lencoBaseUrl: process.env.LENCO_BASE_URL || settings?.lencoBaseUrl || 'https://api.lenco.co/access/v2/',
    lencoName: "Volunteer Signup Fee",
    flutterwavePublic: process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY || settings?.flutterwavePublic || '',
  };

  const lencoScript = donationSettings.lencoBaseUrl.includes('sandbox')
    ? "https://pay.sandbox.lenco.co/js/v1/inline.js"
    : "https://pay.lenco.co/js/v1/inline.js";

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 text-center">
      <Script src="https://checkout.flutterwave.com/v3.js" />
      <Script src={lencoScript} />

      <Card className="border border-brand-blue/10 shadow-xl bg-white rounded-3xl p-10 space-y-6 max-w-lg mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-extrabold text-gray-900">Volunteer Application Fee</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-gray-500 text-sm">
            Thank you, <strong>{volunteer.name}</strong>, for applying to volunteer with us!
          </p>
          <p className="text-gray-600 text-sm">
            There is a one-time volunteer application processing fee of <strong>ZMW {org.volunteerSignupFee}</strong> to support administrative and vetting operations.
          </p>

          <div className="pt-4">
            <PayButtonClient
              amount={org.volunteerSignupFee}
              settings={donationSettings}
              email={volunteer.email}
              name={volunteer.name}
              phone={volunteer.phone || ''}
              userId={user.id}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
