export const dynamic = "force-dynamic";
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import prisma from '@/lib/prisma';
import Link from 'next/link';

export default async function FriendDashboard(props: {
  params: Promise<Record<string, string | string[] | undefined>>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await props.params;
  await props.searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const userId = user.id;

  let donations;
  try {
    donations = await prisma.donation.findMany({
      where: { supabaseUserId: userId },
      orderBy: { createdAt: 'desc' },
    });
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error('Database error in friend dashboard:', error);
    redirect('/get-involved');
  }

  if (!donations || donations.length === 0) {
    redirect('/get-involved');
  }

  const totalsByCurrency = donations
    .filter(d => d.status === 'successful')
    .reduce((acc, d) => {
      acc[d.currency] = (acc[d.currency] || 0) + d.amount;
      return acc;
    }, {} as Record<string, number>);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-purple-900 px-8 py-12 text-white">
          <h1 className="text-3xl font-bold mb-2">Friends of Kindline</h1>
          <p className="text-purple-100">Thank you for your generous support!</p>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-purple-50 p-6 rounded-xl border border-purple-100 md:col-span-2">
              <p className="text-sm font-medium text-purple-600 uppercase tracking-wider">Total Contribution</p>
              <div className="flex flex-wrap gap-4 mt-2">
                {Object.entries(totalsByCurrency).length > 0 ? (
                  Object.entries(totalsByCurrency).map(([curr, amt]) => (
                    <div key={curr} className="flex flex-col">
                      <span className="text-3xl font-bold text-purple-900">{curr} {amt.toLocaleString()}</span>
                    </div>
                  ))
                ) : (
                  <span className="text-3xl font-bold text-purple-900">0</span>
                )}
              </div>
            </div>
            <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
              <p className="text-sm font-medium text-purple-600 uppercase tracking-wider">Donations Made</p>
              <p className="text-3xl font-bold text-purple-900 mt-2">{donations.length}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="md:col-span-2">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Donation History</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {donations.map((donation) => (
                      <tr key={donation.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(donation.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {donation.currency} {donation.amount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                          {donation.type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            donation.status === 'successful' ? 'bg-green-100 text-green-800' :
                            donation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {donation.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Impact & Resources</h2>
              <div className="space-y-4">
                <Link href="/impact" className="block p-4 bg-white border border-gray-200 rounded-xl hover:border-purple-300 hover:shadow-md transition-all">
                  <h3 className="font-bold text-purple-800">Our Impact</h3>
                  <p className="text-sm text-gray-500 mt-1">See how your contributions are making a difference.</p>
                </Link>
                <Link href="/programmes" className="block p-4 bg-white border border-gray-200 rounded-xl hover:border-purple-300 hover:shadow-md transition-all">
                  <h3 className="font-bold text-purple-800">Explore Programmes</h3>
                  <p className="text-sm text-gray-500 mt-1">Discover other initiatives you can support.</p>
                </Link>
                <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                  <p className="text-sm text-purple-700 font-medium italic">
                    &quot;Together, we are building a brighter future for orphans and widows in Zambia.&quot;
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
